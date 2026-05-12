package plugin

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"
	"net/url"
	"path"
	"sort"
	"strconv"
	"strings"
	"time"

	"log/slog"

	"github.com/IoTOpen/go-lynx"
	"github.com/grafana/grafana-plugin-sdk-go/data"
)

const logPageLimit int64 = 10000

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
	logResult, err := fetchLog(context.Background(), instance, queryModel, topicFilter)
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
				var dev *lynx.Device
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
	functions, err := instance.tableQueryFunctions(queryModel)
	if err != nil {
		return nil, err
	}
	if queryModel.NameBy == "" {
		queryModel.NameBy = "name"
	}
	if queryModel.LinkKey == "" {
		queryModel.LinkKey = "device_id"
	}
	logTopicMappings := createLogTopicMappings(functions)
	topicFilter := createTopicFilter(logTopicMappings)
	if len(topicFilter) == 0 {
		return nil, fmt.Errorf("empty topicfilter")
	}
	deviceMap, err := instance.tableDeviceMap(queryModel)
	if err != nil {
		return nil, err
	}
	metaColumns := createMetaColumns(queryModel, deviceMap, functions)
	logResult, err := fetchLog(context.Background(), instance, queryModel, topicFilter)
	if err != nil {
		return nil, err
	}
	exactByLinkAndTime := buildExactMessageIndex(queryModel, logResult, logTopicMappings)
	return buildTableFrames(queryModel, logResult, logTopicMappings, deviceMap, metaColumns, exactByLinkAndTime)
}

func (instance *LynxDataSourceInstance) tableQueryFunctions(queryModel *BackendQueryRequest) ([]*lynx.Function, error) {
	filter := make(map[string]string, len(queryModel.Meta))
	for _, m := range queryModel.Meta {
		filter[m.Key] = m.Value
	}
	functions, err := instance.client.GetFunctions(queryModel.InstallationID, filter)
	if err != nil {
		return nil, err
	}
	if queryModel.MessageFrom == "" {
		return functions, nil
	}
	filter["type"] = queryModel.MessageFrom
	tmpFunctions, err := instance.client.GetFunctions(queryModel.InstallationID, filter)
	if err != nil {
		return nil, err
	}
	return unique(append(functions, tmpFunctions...)), nil
}

func createTopicFilter(logTopicMappings map[string][]*lynx.Function) []string {
	topicFilter := make([]string, 0, len(logTopicMappings))
	for topic := range logTopicMappings {
		topicFilter = append(topicFilter, topic)
	}
	return topicFilter
}

func (instance *LynxDataSourceInstance) tableDeviceMap(queryModel *BackendQueryRequest) (map[int64]*lynx.Device, error) {
	if !queryModel.JoinDeviceMeta && !strings.HasPrefix(queryModel.NameBy, "@device.") {
		return make(map[int64]*lynx.Device), nil
	}
	devices, err := instance.client.GetDevices(queryModel.InstallationID, map[string]string{})
	if err != nil {
		return nil, err
	}
	return devices.MapByID(), nil
}

func buildTableFrames(
	queryModel *BackendQueryRequest,
	logResult []lynx.LogEntry,
	logTopicMappings map[string][]*lynx.Function,
	deviceMap map[int64]*lynx.Device,
	metaColumns []string,
	exactByLinkAndTime map[string]string,
) (data.Frames, error) {
	lastMsg := make(map[string]string)
	frames := make(map[string]*data.Frame)
	for _, entry := range logResult {
		matchingFns, ok := logTopicMappings[entry.Topic]
		if !ok {
			continue
		}
		for _, fn := range matchingFns {
			entryMessage, shouldContinue := resolveTableMessage(queryModel, fn, entry.Message, entry.Timestamp, exactByLinkAndTime, lastMsg)
			if shouldContinue {
				continue
			}
			group := tableGroupKey(queryModel, fn, entryMessage)
			device, deviceID, deviceIDParsed := tableDeviceForFunction(fn, deviceMap)
			frame := ensureTableFrame(frames, group, queryModel, fn, device, metaColumns)
			if err := appendTableRow(frame, queryModel, fn, entry, entryMessage, device, deviceID, deviceIDParsed, metaColumns); err != nil {
				return nil, err
			}
		}
	}
	return createResponse(frames), nil
}

func resolveTableMessage(
	queryModel *BackendQueryRequest,
	fn *lynx.Function,
	message string,
	timestamp float64,
	exactByLinkAndTime map[string]string,
	lastMsg map[string]string,
) (string, bool) {
	if queryModel.MessageFrom == "" {
		return message, false
	}
	linkKey := fn.Meta[queryModel.LinkKey]
	if linkKey == "" {
		return message, true
	}
	if fn.Type == queryModel.MessageFrom {
		lastMsg[linkKey] = message
		return message, true
	}
	v, ok := resolveJoinedMessage(exactByLinkAndTime, lastMsg, linkKey, timestamp)
	if !ok {
		return message, true
	}
	return v, false
}

func buildExactMessageIndex(
	queryModel *BackendQueryRequest,
	logResult []lynx.LogEntry,
	logTopicMappings map[string][]*lynx.Function,
) map[string]string {
	exactByLinkAndTime := make(map[string]string)
	if queryModel.MessageFrom == "" {
		return exactByLinkAndTime
	}

	for _, entry := range logResult {
		matchingFns, ok := logTopicMappings[entry.Topic]
		if !ok {
			continue
		}
		for _, fn := range matchingFns {
			if fn.Type != queryModel.MessageFrom {
				continue
			}
			linkValue := fn.Meta[queryModel.LinkKey]
			if linkValue == "" {
				continue
			}
			exactByLinkAndTime[messageJoinKey(linkValue, entry.Timestamp)] = entry.Message
		}
	}

	return exactByLinkAndTime
}

func messageJoinKey(linkValue string, timestamp float64) string {
	return fmt.Sprintf("%s|%d", linkValue, timestampToUnixNano(timestamp))
}

func timestampToUnixNano(ts float64) int64 {
	return int64(math.Round(ts*1e6)) * int64(time.Microsecond)
}

func resolveJoinedMessage(
	exactByLinkAndTime map[string]string,
	lastByLink map[string]string,
	linkValue string,
	timestamp float64,
) (string, bool) {
	if v, ok := exactByLinkAndTime[messageJoinKey(linkValue, timestamp)]; ok {
		return v, true
	}

	v, ok := lastByLink[linkValue]
	return v, ok
}

func tableGroupKey(queryModel *BackendQueryRequest, fn *lynx.Function, message string) string {
	group := strconv.FormatInt(fn.ID, 10)
	if queryModel.GroupBy == "" {
		return group
	}
	group = fn.Meta[queryModel.GroupBy]
	if queryModel.GroupBy == "type" {
		group = fn.Type
	}
	if group == "" {
		return message
	}
	return group
}

func tableDeviceForFunction(fn *lynx.Function, deviceMap map[int64]*lynx.Device) (*lynx.Device, int64, bool) {
	deviceID, err := strconv.ParseInt(fn.Meta["device_id"], 10, 64)
	if err != nil {
		return nil, 0, false
	}
	device := deviceMap[deviceID]
	return device, deviceID, true
}

func ensureTableFrame(
	frames map[string]*data.Frame,
	group string,
	queryModel *BackendQueryRequest,
	fn *lynx.Function,
	device *lynx.Device,
	metaColumns []string,
) *data.Frame {
	if frame, ok := frames[group]; ok {
		return frame
	}
	labels := createLabels(queryModel, device, fn)
	frame := data.NewFrame("",
		data.NewField("Time", labels, []time.Time{}),
		data.NewField(queryModel.NameBy, labels, []string{}),
		data.NewField("Value", labels, []float64{}),
		data.NewField("Message", labels, []string{}))
	if queryModel.MetaAsFields {
		for _, column := range metaColumns {
			frame.Fields = append(frame.Fields, data.NewField(column, labels, []string{}))
		}
	}
	frames[group] = frame
	return frame
}

func appendTableRow(
	frame *data.Frame,
	queryModel *BackendQueryRequest,
	fn *lynx.Function,
	entry lynx.LogEntry,
	message string,
	device *lynx.Device,
	deviceID int64,
	deviceIDParsed bool,
	metaColumns []string,
) error {
	frame.Name = getName(queryModel.NameBy, fn, device)
	sec, dec := math.Modf(entry.Timestamp)
	ts := time.Unix(int64(sec), int64(dec*(1e9)))
	frame.Fields[0].Append(ts)
	frame.Fields[1].Append(getName(queryModel.NameBy, fn, device))
	frame.Fields[2].Append(entry.Value)
	frame.Fields[3].Append(message)
	if !queryModel.MetaAsFields {
		return nil
	}
	for i, column := range metaColumns {
		field := frame.Fields[4+i]
		field.Extend(1)
		if strings.HasPrefix(column, "@device.") {
			if !deviceIDParsed {
				continue
			}
			metaKey := strings.TrimPrefix(column, "@device.")
			if device == nil {
				return fmt.Errorf("device %d not found for function %d linked", deviceID, fn.ID)
			}
			if value, ok := device.Meta[metaKey]; ok {
				field.Set(field.Len()-1, value)
			} else {
				field.Set(field.Len()-1, "")
			}
			continue
		}
		if value, ok := fn.Meta[column]; ok {
			field.Set(field.Len()-1, value)
		}
	}
	return nil
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

func fetchLog(ctx context.Context, instance *LynxDataSourceInstance, request *BackendQueryRequest, topicFilter []string) ([]lynx.LogEntry, error) {
	var logResult []lynx.LogEntry
	var offset int

	if request.StateOnly {
		status, err := instance.client.Status(request.InstallationID, topicFilter)
		if err != nil {
			return nil, err
		}
		for _, entry := range status {
			logResult = append(logResult, *entry)
		}
		return logResult, nil
	}

	for {
		logQuery, err := instance.requestLogPage(
			ctx,
			request.InstallationID,
			topicFilter,
			offset,
			logPageLimit,
			request.AggrMethod,
			request.AggrInterval,
			request.From,
			request.To,
		)
		if err != nil {
			return nil, err
		}

		pageCount := len(logQuery.Data)
		for _, x := range logQuery.Data {
			t := strings.SplitN(x.Topic, "/", 2)
			if len(t) == 2 {
				x.Topic = t[1]
			}
			logResult = append(logResult, x)
		}

		if pageCount == 0 {
			break
		}

		offset += pageCount
		if pageCount < int(logPageLimit) {
			break
		}
	}
	return logResult, nil
}

func (instance *LynxDataSourceInstance) requestLogPage(
	ctx context.Context,
	installationID int64,
	topicFilter []string,
	offset int,
	limit int64,
	aggrMethod string,
	aggrInterval string,
	fromValue float64,
	toValue float64,
) (*lynx.V3Log, error) {
	baseURL, err := url.Parse(instance.options.URL)
	if err != nil {
		return nil, fmt.Errorf("invalid api base url: %w", err)
	}

	endpoint, err := url.Parse(path.Join("/api/v3beta/log", strconv.FormatInt(installationID, 10)))
	if err != nil {
		return nil, fmt.Errorf("invalid log path: %w", err)
	}

	requestURL := baseURL.ResolveReference(endpoint)
	query := requestURL.Query()
	query.Set("include_total", "false")
	query.Set("limit", strconv.FormatInt(limit, 10))
	query.Set("offset", strconv.Itoa(offset))
	query.Set("order", "asc")

	sec, dec := math.Modf(fromValue)
	from := time.Unix(int64(sec), int64(dec*(1e9)))
	sec, dec = math.Modf(toValue)
	to := time.Unix(int64(sec), int64(dec*(1e9)))
	query.Set("from", strconv.FormatInt(from.Unix(), 10))
	query.Set("to", strconv.FormatInt(to.Unix(), 10))
	if aggrMethod != "" {
		query.Set("aggr_method", aggrMethod)
	}
	if aggrInterval != "" {
		interval, err := time.ParseDuration(aggrInterval)
		if err != nil {
			return nil, fmt.Errorf("invalid aggrInterval: %s", err)
		}
		query.Set("aggr_interval", interval.String())
	}
	for _, topic := range topicFilter {
		query.Add("topics", topic)
	}
	requestURL.RawQuery = query.Encode()

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, requestURL.String(), http.NoBody)
	if err != nil {
		return nil, fmt.Errorf("build log request: %w", err)
	}
	if instance.bearerToken != "" {
		request.Header.Set("Authorization", "Bearer "+instance.bearerToken)
	} else if instance.options.APIKey != "" {
		request.Header.Set("X-API-Key", instance.options.APIKey)
	}

	httpClient := &http.Client{Timeout: instance.Timeout}
	response, err := httpClient.Do(request)
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := response.Body.Close(); closeErr != nil {
			slog.Warn("log response body close failed", "error", closeErr)
		}
	}()

	if response.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(response.Body)
		return nil, fmt.Errorf("log request failed: status=%d body=%s", response.StatusCode, strings.TrimSpace(string(body)))
	}

	var logQuery lynx.V3Log
	if err := json.NewDecoder(response.Body).Decode(&logQuery); err != nil {
		return nil, fmt.Errorf("decode log response: %w", err)
	}

	return &logQuery, nil
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
