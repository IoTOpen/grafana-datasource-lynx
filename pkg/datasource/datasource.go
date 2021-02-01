package datasource

import (
	"context"
	"encoding/json"
	"time"

	"github.com/IoTOpen/go-lynx"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
)

// LynxDataSource saticfies the QueryDataHandler interface
type LynxDataSource struct {
	im        instancemgmt.InstanceManager
	apiClient *lynx.Client
	logger    log.Logger
}

// NewDatasource create a new LynxDatasource
func NewDatasource() *LynxDataSource {
	lynxAPIClient := lynx.NewClient(&lynx.Options{
		Authenticator: lynx.AuthApiKey{},
	})
	return &LynxDataSource{
		apiClient: lynxAPIClient,
		logger:    log.New(),
	}
}

// QueryData ...
func (ds *LynxDataSource) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	ctxData := &InstanceContext{}
	if err := json.Unmarshal(req.PluginContext.DataSourceInstanceSettings.JSONData, ctxData); err != nil {
		return nil, err
	}
	response := backend.NewQueryDataResponse()
	for _, q := range req.Queries {
		response.Responses[q.RefID] = readQuery(ctxData, q)
	}
	return response, nil
}

// CheckHealth checks if everythin is up and running properly
func (ds *LynxDataSource) CheckHealth(ctx context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	res := &backend.CheckHealthResult{}
	// TODO make ping request to Lynx-api
	res.Status = backend.HealthStatusOk
	res.Message = "OK"
	return res, nil
}

func readQuery(ctx *InstanceContext, query backend.DataQuery) (response backend.DataResponse) {
	model := &BackendQueryRequest{}
	if err := json.Unmarshal(query.JSON, model); err != nil {
		response.Error = err
		return
	}
	model.From = float64(query.TimeRange.From.Unix())
	model.To = float64(query.TimeRange.To.Unix())
	queryResp, err := queryTimeSeries(ctx, model)
	if err != nil {
		response.Error = err
		return
	}
	frame := data.NewFrame(model.Type,
		data.NewField("Time", nil, []time.Time{}),
		data.NewField(model.Meta[0].Value, nil, []float64{}))

	for _, query := range queryResp {
		for _, dp := range query.Datapoints {
			ts := time.Unix(0, int64(dp[1]))
			v := dp[0]
			frame.AppendRow(ts, v)
		}
	}
	response.Frames = append(response.Frames, frame)
	return
}
