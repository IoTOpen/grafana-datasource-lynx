package datasource

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"time"

	"github.com/IoTOpen/go-lynx"
	"github.com/grafana/grafana-plugin-sdk-go/backend/resource/httpadapter"
)

// LynxAPIHandler resource API endpoint handler
func (ds *LynxDataSource) LynxAPIHandler(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	data := &BackendQueryRequest{}
	if err := json.NewDecoder(r.Body).Decode(data); err != nil {
		ds.logger.Debug("Decoder error", "error", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	ctx := httpadapter.PluginConfigFromContext(r.Context())
	ctxData := &InstanceContext{}
	if err := json.Unmarshal(ctx.DataSourceInstanceSettings.JSONData, ctxData); err != nil {
		return
	}
	if data.TableData {
		res, err := queryTableData(ctxData, data)
		if err != nil {
			ds.logger.Debug("Lynx API request error", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if err := json.NewEncoder(w).Encode(res); err != nil {
			ds.logger.Error("couldn't write json response: %s", err.Error())
			return
		}
	} else {
		res, err := queryTimeSeries(ctxData, data)
		if err != nil {
			ds.logger.Debug("Lynx API request error", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if err := json.NewEncoder(w).Encode(res); err != nil {
			ds.logger.Error("couldn't write json response: %s", err.Error())
			return
		}
	}
}

func queryTimeSeries(ctx *InstanceContext, data *BackendQueryRequest) ([]*TimeSeriesQueryResponse, error) {
	client := lynx.NewClient(&lynx.Options{
		Authenticator: lynx.AuthApiKey{Key: ctx.APIkey},
		ApiBase:       ctx.URL,
	})
	filter := map[string]string{}
	for _, m := range data.Meta {
		filter[m.Key] = m.Value
	}
	functions, err := client.GetFunctions(data.InstallationID, filter)
	if err != nil {
		return nil, err
	}
	logTopicMappings := createLogTopicMappings(data.ClientID, functions)
	var topicFilter []string
	for k := range logTopicMappings {
		topicFilter = append(topicFilter, k)
	}
	logResult, err := fetchLog(client, data, topicFilter)
	if err != nil {
		return nil, err
	}
	targetDP := map[string][][]float64{}
	targetDPNames := map[string]string{}
	for _, entry := range logResult {
		functions, ok := logTopicMappings[entry.Topic]
		if ok {
			for _, f := range functions {
				var group string
				if data.GroupBy != "" {
					v, _ := f.Meta[data.GroupBy]
					if data.GroupBy == "type" {
						v = f.Type
					}
					if v != "" {
						group = v
					}
				}
				if data.NameBy == "" {
					data.NameBy = "name"
				}

				targetDPNames[group] = f.Meta[data.NameBy]
				v, ok := targetDP[group]
				if !ok {
					targetDP[group] = make([][]float64, 0)
				}
				v = append(v, []float64{entry.Value, entry.Timestamp * 1000})
				targetDP[group] = v
			}
		}
	}

	var res []*TimeSeriesQueryResponse
	for key, value := range targetDP {
		name, ok := targetDPNames[key]
		if !ok {
			name = key
		}
		res = append(res, &TimeSeriesQueryResponse{
			RefID:      data.RefID,
			Target:     name,
			Datapoints: value,
		})
	}
	return res, err
}

func unique(fn []*lynx.Function) []*lynx.Function {
	keys := make(map[int64]bool)
	list := []*lynx.Function{}
	for _, entry := range fn {
		if _, ok := keys[entry.ID]; !ok {
			keys[entry.ID] = true
			list = append(list, entry)
		}
	}
	return list
}

func queryTableData(ctx *InstanceContext, data *BackendQueryRequest) ([]*TableDataQueryResponse, error) {
	client := lynx.NewClient(&lynx.Options{
		Authenticator: lynx.AuthApiKey{Key: ctx.APIkey},
		ApiBase:       ctx.URL,
	})
	filter := map[string]string{}
	for _, m := range data.Meta {
		filter[m.Key] = m.Value
	}
	fn, err := client.GetFunctions(data.InstallationID, filter)
	if err != nil {
		return nil, err
	}
	if data.MessageFrom != "" {
		filter["type"] = data.MessageFrom
		tmpFn, err := client.GetFunctions(data.InstallationID, filter)
		if err != nil {
			return nil, err
		}
		fn = unique(append(fn, tmpFn...))
	}
	logTopicMappings := createLogTopicMappings(data.ClientID, fn)
	var topicFilter []string
	for k := range logTopicMappings {
		topicFilter = append(topicFilter, k)
	}
	if len(topicFilter) == 0 {
		return nil, fmt.Errorf("Empty topicfilter")
	}
	columns := []Column{{"Time"}, {"name"}, {"value"}, {"msg"}}
	metaColumns := map[string]bool{}
	if data.MetaAsFields {
		for _, f := range fn {
			for k := range f.Meta {
				if k != "name" {
					if _, ok := metaColumns[k]; !ok {
						metaColumns[k] = true
						columns = append(columns, Column{k})
					}
				}
			}
		}
	}
	logResult, err := fetchLog(client, data, topicFilter)
	if err != nil {
		return nil, err
	}
	lastMsg := map[string]string{}
	targetDP := map[string][][]interface{}{}
	targetDPNames := map[string]string{}
	for _, entry := range logResult {
		if matchingFn, ok := logTopicMappings[entry.Topic]; ok {
			for _, f := range matchingFn {
				if data.LinkKey == "" {
					data.LinkKey = "device_id"
				}
				if data.MessageFrom != "" && f.Type == data.MessageFrom {
					lastMsg[f.Meta[data.LinkKey]] = entry.Message
					continue
				} else if data.MessageFrom != "" {
					v, ok := lastMsg[f.Meta[data.LinkKey]]
					if !ok {
						continue
					}
					entry.Message = v
				}
				var group string
				if data.GroupBy != "" {
					group, _ := f.Meta[data.GroupBy]
					if data.GroupBy == "type" {
						group = f.Type
					}
					if group == "" {
						group = entry.Message
					}
				}
				if data.NameBy == "" {
					data.NameBy = "name"
				}
				targetDPNames[group] = f.Meta[data.NameBy]

				dps, ok := targetDP[group]
				if !ok {
					targetDP[group] = make([][]interface{}, 0)
				}
				row := []interface{}{
					entry.Timestamp * 1000,
					f.Meta[data.NameBy],
					entry.Value,
					entry.Message,
				}
				if data.MetaAsFields {
					for key := range metaColumns {
						if v, ok := f.Meta[key]; ok {
							row = append(row, v)
						} else {
							row = append(row, "")
						}
					}
				}
				dps = append(dps, row)
				targetDP[group] = dps
			}
		}
	}
	var res []*TableDataQueryResponse
	for key, value := range targetDP {
		name, _ := targetDPNames[key]
		res = append(res, &TableDataQueryResponse{
			RefID:   data.RefID,
			Name:    name,
			Rows:    value,
			Columns: columns,
		})
	}
	return res, nil
}

func createLogTopicMappings(clientID int64, fn []*lynx.Function) map[string][]*lynx.Function {
	logTopicMappings := map[string][]*lynx.Function{}
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