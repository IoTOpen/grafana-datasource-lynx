package main

import (
	"context"
	"encoding/json"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	"time"
)

type queryModel struct {
	InstallationID int64 `json:"installationID"`
	ClientID       int64 `json:"clientID"`
	Meta           []struct {
		Key   string `json:"key"`
		Value string `json:"value"`
	} `json:"meta"`
}

// dataSource saticfies the QueryDataHandler interface
type dataSource struct{}

func (ds *dataSource) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	response := backend.NewQueryDataResponse()
	for _, q := range req.Queries {
		response.Responses[q.RefID] = readQuery(q)
	}
	return response, nil
}

func readQuery(query backend.DataQuery) backend.DataResponse {
	var model queryModel
	response := backend.DataResponse{}
	log.DefaultLogger.Debug("QueryData", "JSON", query.JSON)
	if err := json.Unmarshal(query.JSON, &model); err != nil {
		response.Error = err
		return response
	}
	response.Frames = append(response.Frames, data.NewFrame(model.Meta[0].Value,
		data.NewField("Time", nil, []time.Time{}),
		data.NewField("Value", nil, []float64{}),
	))

	return response
}
