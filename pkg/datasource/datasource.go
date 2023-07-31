package datasource

import (
	"context"
	"encoding/json"
	"github.com/IoTOpen/go-lynx"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/datasource"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

type (
	// LynxDataSource satisfies the QueryDataHandler interface
	LynxDataSource struct {
		logger log.Logger
		im     instancemgmt.InstanceManager
	}
	// LynxDataSourceInstance handles datasource instances
	LynxDataSourceInstance struct {
		client *lynx.Client
	}
)

// NewDatasource create a new LynxDatasource
func NewDatasource() *LynxDataSource {
	return &LynxDataSource{
		im:     datasource.NewInstanceManager(newDatasourceInstance),
		logger: log.New(),
	}
}

func newDatasourceInstance(settings backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
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

func (ds *LynxDataSource) getDSInstance(ctx context.Context, pluginContext backend.PluginContext) (*LynxDataSourceInstance, error) {
	i, err := ds.im.Get(ctx, pluginContext)
	if err != nil {
		return nil, err
	}
	return i.(*LynxDataSourceInstance), nil
}

// QueryData handler for data queries
func (ds *LynxDataSource) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	instance, err := ds.getDSInstance(ctx, req.PluginContext)
	if err != nil {
		return nil, err
	}
	response := backend.NewQueryDataResponse()
	for _, q := range req.Queries {
		response.Responses[q.RefID] = readQuery(instance, q)
	}
	return response, nil
}

// CheckHealth checks if everything is up and running properly
func (ds *LynxDataSource) CheckHealth(ctx context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	res := &backend.CheckHealthResult{
		Status:  backend.HealthStatusOk,
		Message: "OK",
	}
	instance, err := ds.getDSInstance(ctx, req.PluginContext)
	if err != nil {
		res.Status = backend.HealthStatusError
		res.Message = "Error getting datasource instance"
		ds.logger.Error("Error getting datasource instance", "error", err)
		return res, nil
	}
	if err := instance.client.Ping(); err != nil {
		res.Status = backend.HealthStatusError
		res.Message = err.Error()
		ds.logger.Error("Error connecting to Lynx API", "error", err)
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
