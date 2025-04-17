package plugin

import (
	"fmt"
	"math"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/IoTOpen/go-lynx"
	"github.com/grafana/grafana-plugin-sdk-go/data"
)

func (instance *LynxDataSourceInstance) queryTimeSeries(queryModel *BackendQueryRequest) (data.Frames, error) {
	filter := make(map[string]string, len(queryModel.Meta))
	for _, m := range queryModel.Meta {
		filter[m.Key] = m.Value
	}
	functions, err := instance.client.GetFunctions(queryModel.InstallationID, filter)
	if err != nil {
		return nil, err
	}
	deviceMap := make(map[int64]*lynx.Device)
	if strings.HasPrefix(queryModel.NameBy, "@device.") {
		devices, err := instance.client.GetDevices(queryModel.InstallationID, map[string]string{})
		if err != nil {
			return nil, err
		}
		deviceMap = devices.MapByID()
	}
	logTopicMappings := createLogTopicMappings(functions)
	topicFilter := make([]string, 0, len(logTopicMappings))
	for k := range logTopicMappings {
		topicFilter = append(topicFilter, k)
	}
	logResult, err := fetchLog(instance.client, queryModel, topicFilter)
	if err != nil {
		return nil, err
	}
	frames := make(map[string]*data.Frame)
	for _, entry := range logResult {
		if functions, ok := logTopicMappings[entry.Topic]; ok {
			for _, fn := range functions {
				group := strconv.FormatInt(fn.ID, 10)
				if queryModel.GroupBy != "" {
					v := fn.Meta[queryModel.GroupBy]
					if queryModel.GroupBy == "type" {
						v = fn.Type
					}
					if v != "" {
						group = v
					}
				}
				frame, ok := frames[group]
				var dev *lynx.Device = nil
				if strings.HasPrefix(queryModel.NameBy, "@device.") {
					deviceID, err := strconv.ParseInt(fn.Meta["device_id"], 10, 64)
					if err == nil {
						dev = deviceMap[deviceID]
					}
				}
				if !ok {
					labels := createLabels(queryModel, dev, fn)
					frame = data.NewFrame("",
						data.NewField("Time", labels, []time.Time{}),
						data.NewField("Value", labels, []float64{}))
					frames[group] = frame
				}
				frame.Name = getName(queryModel.NameBy, fn, dev)
				sec, dec := math.Modf(entry.Timestamp)
				ts := time.Unix(int64(sec), int64(dec*(1e9)))
				frame.Fields[0].Append(ts)
				frame.Fields[1].Append(entry.Value)
			}
		}
	}
	return createResponse(frames), nil
}

func createLabels(qm *BackendQueryRequest, device *lynx.Device, fn *lynx.Function) data.Labels {
	if !qm.MetaAsLabels {
		return nil
	}
	res := data.Labels{}
	if device != nil {
		for k, v := range device.Meta {
			res[fmt.Sprintf("@device.%s", k)] = v
		}
	}
	for k, v := range fn.Meta {
		res[k] = v
	}
	res["installation_id"] = strconv.FormatInt(fn.InstallationID, 10)
	return res
}

func (instance *LynxDataSourceInstance) queryTableData(queryModel *BackendQueryRequest) (data.Frames, error) {
	filter := make(map[string]string, len(queryModel.Meta))
	for _, m := range queryModel.Meta {
		filter[m.Key] = m.Value
	}
	fn, err := instance.client.GetFunctions(queryModel.InstallationID, filter)
	if err != nil {
		return nil, err
	}
	if queryModel.MessageFrom != "" {
		filter["type"] = queryModel.MessageFrom
		tmpFn, err := instance.client.GetFunctions(queryModel.InstallationID, filter)
		if err != nil {
			return nil, err
		}
		fn = unique(append(fn, tmpFn...))
	}
	if queryModel.NameBy == "" {
		queryModel.NameBy = "name"
	}
	if queryModel.LinkKey == "" {
		queryModel.LinkKey = "device_id"
	}
	logTopicMappings := createLogTopicMappings(fn)
	topicFilter := make([]string, 0, len(logTopicMappings))
	for k := range logTopicMappings {
		topicFilter = append(topicFilter, k)
	}
	if len(topicFilter) == 0 {
		return nil, fmt.Errorf("empty topicfilter")
	}

	deviceMap := make(map[int64]*lynx.Device)
	if queryModel.JoinDeviceMeta || strings.HasPrefix(queryModel.NameBy, "@device.") {
		devices, err := instance.client.GetDevices(queryModel.InstallationID, map[string]string{})
		if err != nil {
			return nil, err
		}
		deviceMap = devices.MapByID()
	}
	metaColumns := createMetaColumns(queryModel, deviceMap, fn)
	logResult, err := fetchLog(instance.client, queryModel, topicFilter)
	if err != nil {
		return nil, err
	}
	lastMsg := make(map[string]string)
	frames := make(map[string]*data.Frame)
	for _, entry := range logResult {
		if matchingFn, ok := logTopicMappings[entry.Topic]; ok {
			for _, fn := range matchingFn {
				if queryModel.MessageFrom != "" && fn.Type == queryModel.MessageFrom {
					lastMsg[fn.Meta[queryModel.LinkKey]] = entry.Message
					continue
				} else if queryModel.MessageFrom != "" {
					v, ok := lastMsg[fn.Meta[queryModel.LinkKey]]
					if !ok {
						continue
					}
					entry.Message = v
				}
				group := strconv.FormatInt(fn.ID, 10)
				if queryModel.GroupBy != "" {
					group = fn.Meta[queryModel.GroupBy]
					if queryModel.GroupBy == "type" {
						group = fn.Type
					}
					if group == "" {
						group = entry.Message
					}
				}
				frame, ok := frames[group]
				deviceID, devIDError := strconv.ParseInt(fn.Meta["device_id"], 10, 64)
				var dev *lynx.Device
				if devIDError == nil {
					dev = deviceMap[deviceID]
				}
				if !ok {
					labels := createLabels(queryModel, dev, fn)
					frame = data.NewFrame("",
						data.NewField("Time", labels, []time.Time{}),
						data.NewField(queryModel.NameBy, labels, []string{}),
						data.NewField("Value", labels, []float64{}),
						data.NewField("Message", labels, []string{}))
					if queryModel.MetaAsFields {
						for _, column := range metaColumns {
							frame.Fields = append(frame.Fields,
								data.NewField(column, labels, []string{}))
						}
					}
					frames[group] = frame
				}
				frame.Name = getName(queryModel.NameBy, fn, dev)
				sec, dec := math.Modf(entry.Timestamp)
				ts := time.Unix(int64(sec), int64(dec*(1e9)))
				frame.Fields[0].Append(ts)
				frame.Fields[1].Append(getName(queryModel.NameBy, fn, dev))
				frame.Fields[2].Append(entry.Value)
				frame.Fields[3].Append(entry.Message)
				if queryModel.MetaAsFields {
					for i, c := range metaColumns {
						field := frame.Fields[4+i]
						field.Extend(1)
						if strings.HasPrefix(c, "@device.") {
							if devIDError != nil {
								continue
							}
							metaKey := strings.TrimPrefix(c, "@device.")
							if v, ok := deviceMap[deviceID]; ok {
								if v, ok := v.Meta[metaKey]; ok {
									field.Set(field.Len()-1, v)
								} else {
									field.Set(field.Len()-1, "")
								}
							} else {
								return nil, fmt.Errorf("device %d not found for function %d linked", deviceID, fn.ID)
							}
						} else if v, ok := fn.Meta[c]; ok {
							field.Set(field.Len()-1, v)
						}
					}
				}
			}
		}
	}
	return createResponse(frames), nil
}

func createResponse(frames map[string]*data.Frame) data.Frames {
	keys := make([]string, 0, len(frames))
	for k := range frames {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	res := make(data.Frames, 0, len(keys))
	for _, k := range keys {
		frame := frames[k]
		res = append(res, frame)
	}
	return res
}

func createLogTopicMappings(fn []*lynx.Function) map[string][]*lynx.Function {
	logTopicMappings := make(map[string][]*lynx.Function, len(fn))
	for i, f := range fn {
		v, ok := f.Meta["topic_read"]
		if ok {
			if _, ok := logTopicMappings[v]; !ok {
				logTopicMappings[v] = make([]*lynx.Function, 0, 2)
			}
			logTopicMappings[v] = append(logTopicMappings[v], fn[i])
		}
	}
	return logTopicMappings
}

func fetchLog(client *lynx.Client, request *BackendQueryRequest, topicFilter []string) ([]lynx.LogEntry, error) {
	var logResult []lynx.LogEntry
	var offset int
	if request.StateOnly {
		status, err := client.Status(request.InstallationID, topicFilter)
		if err != nil {
			return nil, err
		}
		for _, entry := range status {
			logResult = append(logResult, *entry)
		}
	} else {
		sec, dec := math.Modf(request.From)
		from := time.Unix(int64(sec), int64(dec*(1e9)))
		sec, dec = math.Modf(request.To)
		to := time.Unix(int64(sec), int64(dec*(1e9)))
		for {
			var interval time.Duration

			if request.AggrInterval != "" {
				var err error
				interval, err = time.ParseDuration(request.AggrInterval)
				if err != nil {
					return nil, fmt.Errorf("invalid aggrInterval: %s", err)
				}
			}
			logQuery, err := client.V3().Log(request.InstallationID, &lynx.LogOptionsV3{
				TopicFilter:  topicFilter,
				From:         from,
				To:           to,
				Offset:       int64(offset),
				Order:        lynx.LogOrderAsc,
				AggrMethod:   request.AggrMethod,
				AggrInterval: interval,
			})
			if err != nil {
				return nil, err
			}
			for _, x := range logQuery.Data {
				t := strings.SplitN(x.Topic, "/", 2)
				if len(t) == 2 {
					x.Topic = t[1]
				}
				logResult = append(logResult, x)
			}
			offset += logQuery.Count
			if offset >= int(logQuery.Total) {
				break
			}
		}
	}
	return logResult, nil
}

func getName(nameBy string, fn *lynx.Function, dev *lynx.Device) string {
	if strings.HasPrefix(nameBy, "@device.") && dev != nil {
		metaKey := strings.TrimPrefix(nameBy, "@device.")
		if v, ok := dev.Meta[metaKey]; ok {
			return v
		}
	}
	if nameBy != "" {
		name, ok := fn.Meta[nameBy]
		if ok {
			return name
		}
	}
	return fn.Meta["name"]
}

func unique(fn []*lynx.Function) []*lynx.Function {
	keys := make(map[int64]bool, len(fn))
	list := make([]*lynx.Function, 0, len(fn))
	for _, entry := range fn {
		if _, ok := keys[entry.ID]; !ok {
			keys[entry.ID] = true
			list = append(list, entry)
		}
	}
	return list
}

func createMetaColumns(queryModel *BackendQueryRequest, deviceMap map[int64]*lynx.Device, fn []*lynx.Function) []string {
	metaColumnsMap := make(map[string]bool, 5)
	res := make([]string, 0, 5)
	if queryModel.MetaAsFields {
		for _, f := range fn {
			for k := range f.Meta {
				if k != "name" && !metaColumnsMap[k] {
					metaColumnsMap[k] = true
					res = append(res, k)
				}
			}
			if queryModel.JoinDeviceMeta {
				deviceID, err := strconv.ParseInt(f.Meta["device_id"], 10, 64)
				if err != nil {
					continue
				}
				dev, ok := deviceMap[deviceID]
				if !ok {
					continue
				}
				for metaKey := range dev.Meta {
					deviceKey := fmt.Sprintf("@device.%s", metaKey)
					if !metaColumnsMap[deviceKey] {
						metaColumnsMap[deviceKey] = true
						res = append(res, deviceKey)
					}
				}
			}
		}
	}
	sort.Strings(res)
	return res
}
