package datasource

import (
	"fmt"
	"github.com/IoTOpen/go-lynx"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	"math"
	"sort"
	"strconv"
	"strings"
	"time"
)

func (ds *LynxDataSourceInstance) queryTimeSeries(queryModel *BackendQueryRequest) (data.Frames, error) {
	filter := make(map[string]string, len(queryModel.Meta))
	for _, m := range queryModel.Meta {
		filter[m.Key] = m.Value
	}
	functions, err := ds.client.GetFunctions(queryModel.InstallationID, filter)
	if err != nil {
		return nil, err
	}
	logTopicMappings := createLogTopicMappings(queryModel.ClientID, functions)
	topicFilter := make([]string, 0, len(logTopicMappings))
	for k := range logTopicMappings {
		topicFilter = append(topicFilter, k)
	}
	logResult, err := fetchLog(ds.client, queryModel, topicFilter)
	if err != nil {
		return nil, err
	}
	frames := make(map[string]*data.Frame)
	for _, entry := range logResult {
		if functions, ok := logTopicMappings[entry.Topic]; ok {
			for _, fn := range functions {
				group := strconv.FormatInt(fn.ID, 10)
				if queryModel.GroupBy != "" {
					v, _ := fn.Meta[queryModel.GroupBy]
					if queryModel.GroupBy == "type" {
						v = fn.Type
					}
					if v != "" {
						group = v
					}
				}
				frame, ok := frames[group]
				if !ok {
					frame = data.NewFrame("",
						data.NewField("Time", nil, []time.Time{}),
						data.NewField("Value", nil, []float64{}))
					frames[group] = frame
				}
				frame.Name = getName(queryModel.NameBy, fn)
				sec, dec := math.Modf(entry.Timestamp)
				ts := time.Unix(int64(sec), int64(dec*(1e9)))
				frame.Fields[0].Append(ts)
				frame.Fields[1].Append(entry.Value)
			}
		}
	}
	return createResponse(frames), nil
}

func (ds *LynxDataSourceInstance) queryTableData(queryModel *BackendQueryRequest) (data.Frames, error) {
	filter := make(map[string]string, len(queryModel.Meta))
	for _, m := range queryModel.Meta {
		filter[m.Key] = m.Value
	}
	fn, err := ds.client.GetFunctions(queryModel.InstallationID, filter)
	if err != nil {
		return nil, err
	}
	if queryModel.MessageFrom != "" {
		filter["type"] = queryModel.MessageFrom
		tmpFn, err := ds.client.GetFunctions(queryModel.InstallationID, filter)
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
	logTopicMappings := createLogTopicMappings(queryModel.ClientID, fn)
	topicFilter := make([]string, 0, len(logTopicMappings))
	for k := range logTopicMappings {
		topicFilter = append(topicFilter, k)
	}
	if len(topicFilter) == 0 {
		return nil, fmt.Errorf("Empty topicfilter")
	}

	deviceMap := make(map[int64]*lynx.Device)
	if queryModel.JoinDeviceMeta {
		devices, err := ds.client.GetDevices(queryModel.InstallationID, map[string]string{})
		if err != nil {
			return nil, err
		}
		deviceMap = lynx.DeviceList(devices).MapByID()
	}
	metaColumns := createMetaColumns(queryModel, deviceMap, fn)
	logResult, err := fetchLog(ds.client, queryModel, topicFilter)
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
					group, _ = fn.Meta[queryModel.GroupBy]
					if queryModel.GroupBy == "type" {
						group = fn.Type
					}
					if group == "" {
						group = entry.Message
					}
				}
				frame, ok := frames[group]
				if !ok {
					frame = data.NewFrame("",
						data.NewField("Time", nil, []time.Time{}),
						data.NewField(queryModel.NameBy, nil, []string{}),
						data.NewField("Value", nil, []float64{}),
						data.NewField("Message", nil, []string{}))
					if queryModel.MetaAsFields {
						for _, column := range metaColumns {
							frame.Fields = append(frame.Fields,
								data.NewField(column, nil, []string{}))
						}
					}
					frames[group] = frame
				}
				frame.Name = getName(queryModel.NameBy, fn)
				sec, dec := math.Modf(entry.Timestamp)
				ts := time.Unix(int64(sec), int64(dec*(1e9)))
				frame.Fields[0].Append(ts)
				frame.Fields[1].Append(getName(queryModel.NameBy, fn))
				frame.Fields[2].Append(entry.Value)
				frame.Fields[3].Append(entry.Message)
				if queryModel.MetaAsFields {
					for i, c := range metaColumns {
						field := frame.Fields[4+i]
						field.Extend(1)
						if strings.HasPrefix(c, "@device.") {
							deviceID, err := strconv.ParseInt(fn.Meta["device_id"], 10, 64)
							if err != nil {
								continue
							}
							metaKey := strings.TrimPrefix(c, "@device.")
							if v, ok := deviceMap[deviceID].Meta[metaKey]; ok {
								field.Set(field.Len()-1, v)
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
		frame, _ := frames[k]
		res = append(res, frame)
	}
	return res
}

func createLogTopicMappings(clientID int64, fn []*lynx.Function) map[string][]*lynx.Function {
	logTopicMappings := make(map[string][]*lynx.Function, len(fn))
	for _, f := range fn {
		v, ok := f.Meta["topic_read"]
		if ok {
			topicRead := fmt.Sprintf("%d/%s", clientID, v)
			if _, ok := logTopicMappings[topicRead]; !ok {
				logTopicMappings[topicRead] = make([]*lynx.Function, 0)
			}
			logTopicMappings[topicRead] = append(logTopicMappings[topicRead], f)
		}
	}
	return logTopicMappings
}

func fetchLog(client *lynx.Client, data *BackendQueryRequest, topicFilter []string) ([]lynx.LogEntry, error) {
	var logResult []lynx.LogEntry
	var offset int
	if data.StateOnly {
		status, err := client.Status(data.InstallationID, topicFilter)
		if err != nil {
			return nil, err
		}
		for _, entry := range status {
			entry.Topic = fmt.Sprintf("%d/%s", entry.ClientID, entry.Topic)
			logResult = append(logResult, *entry)
		}
	} else {
		sec, dec := math.Modf(data.From)
		from := time.Unix(int64(sec), int64(dec*(1e9)))
		sec, dec = math.Modf(data.To)
		to := time.Unix(int64(sec), int64(dec*(1e9)))
		for {
			log, err := client.V3().Log(data.InstallationID, &lynx.LogOptionsV3{
				TopicFilter: topicFilter,
				From:        from,
				To:          to,
				Offset:      int64(offset),
				Order:       lynx.LogOrderAsc,
			})
			if err != nil {
				return nil, err
			}
			logResult = append(logResult, log.Data...)
			offset += log.Count
			if offset >= int(log.Total) {
				break
			}
		}
	}
	return logResult, nil
}

func getName(nameBy string, fn *lynx.Function) string {
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
