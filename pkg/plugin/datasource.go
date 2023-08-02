package plugin

import (
	"context"
	"encoding/json"
	"github.com/IoTOpen/go-lynx"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
)

type (
	// LynxDataSourceInstance handles plugin instances
	LynxDataSourceInstance struct {
		client *lynx.Client
	}
)

// NewDatasourceInstance create a new LynxDatasourceInstance
func NewDatasourceInstance(settings backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	dataSourceConfig := &struct {
		APIkey string `json:"apiKey"`
		URL    string `json:"url"`
	}{}
	if err := json.Unmarshal(settings.JSONData, dataSourceConfig); err != nil {
		return nil, err
	}
	client := lynx.NewClient(&lynx.Options{
		Authenticator: lynx.AuthApiKey{Key: dataSourceConfig.APIkey},
		APIBase:       dataSourceConfig.URL,
	})
	return &LynxDataSourceInstance{
		client: client,
	}, nil
}

func (instance *LynxDataSourceInstance) Dispose() {
}

// QueryData handler for data queries
func (instance *LynxDataSourceInstance) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	response := backend.NewQueryDataResponse()
	for _, q := range req.Queries {
		response.Responses[q.RefID] = readQuery(instance, q)
	}
	return response, nil
}

// CheckHealth checks if everything is up and running properly
func (instance *LynxDataSourceInstance) CheckHealth(ctx context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	res := &backend.CheckHealthResult{
		Status:  backend.HealthStatusOk,
		Message: "OK",
	}
	if err := instance.client.Ping(); err != nil {
		res.Status = backend.HealthStatusError
		res.Message = err.Error()
	}
	return res, nil
}

func readQuery(instance *LynxDataSourceInstance, query backend.DataQuery) (response backend.DataResponse) {
	queryModel := &BackendQueryRequest{}
	if err := json.Unmarshal(query.JSON, queryModel); err != nil {
		response.Error = err
		return
	}
	queryModel.From = float64(query.TimeRange.From.Unix())
	queryModel.To = float64(query.TimeRange.To.Unix())
	if queryModel.TableData {
		response.Frames, response.Error = instance.queryTableData(queryModel)
	} else {
		response.Frames, response.Error = instance.queryTimeSeries(queryModel)
	}
	return
}
