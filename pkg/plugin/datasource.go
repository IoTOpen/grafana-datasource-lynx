package plugin

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/IoTOpen/go-lynx"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"strings"
)

type (
	Settings struct {
		APIKey         string `json:"apiKey"`
		URL            string `json:"URL"`
		OAuth2Passthru bool   `json:"oauthPassThru"`
	}

	// LynxDataSourceInstance handles plugin instances
	LynxDataSourceInstance struct {
		client  *lynx.Client
		options Settings
	}
)

// NewDatasourceInstance create a new LynxDatasourceInstance
func NewDatasourceInstance(ctx context.Context, settings backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	instance := &LynxDataSourceInstance{}
	if err := json.Unmarshal(settings.JSONData, &instance.options); err != nil {
		return nil, err
	}
	if settings.DecryptedSecureJSONData["apiKey"] != "" {
		instance.options.APIKey = settings.DecryptedSecureJSONData["apiKey"]
	}
	instance.client = lynx.NewClient(&lynx.Options{
		Authenticator: lynx.AuthApiKey{Key: instance.options.APIKey},
		APIBase:       instance.options.URL,
	})
	return instance, nil
}

func (instance *LynxDataSourceInstance) Dispose() {
}

// QueryData handler for data queries
func (instance *LynxDataSourceInstance) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	response := backend.NewQueryDataResponse()
	var usedInstance = instance
	if instance.options.OAuth2Passthru {
		headers := req.GetHTTPHeaders()
		authHeader := headers.Get(backend.OAuthIdentityTokenHeaderName)
		parts := strings.Fields(authHeader)
		if len(parts) != 2 {
			return nil, fmt.Errorf("bad auth header")
		}
		usedInstance = &LynxDataSourceInstance{
			client: lynx.NewClient(&lynx.Options{
				Authenticator: lynx.AuthBearer{Token: parts[1]},
				APIBase:       instance.options.URL,
			}),
		}
	}
	for _, q := range req.Queries {
		response.Responses[q.RefID] = readQuery(usedInstance, q)
	}
	return response, nil
}

// CheckHealth checks if everything is up and running properly
func (instance *LynxDataSourceInstance) CheckHealth(ctx context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	res := &backend.CheckHealthResult{
		Status: backend.HealthStatusOk,
	}
	var usedInstance = instance
	if instance.options.OAuth2Passthru {
		headers := req.GetHTTPHeaders()
		authHeader := headers.Get(backend.OAuthIdentityTokenHeaderName)
		parts := strings.Fields(authHeader)
		if len(parts) != 2 {
			return nil, fmt.Errorf("bad auth header")
		}
		usedInstance = &LynxDataSourceInstance{
			client: lynx.NewClient(&lynx.Options{
				Authenticator: lynx.AuthBearer{Token: parts[1]},
				APIBase:       instance.options.URL,
			}),
		}
	}
	if me, err := usedInstance.client.Me(); err != nil {
		res.Status = backend.HealthStatusError
		res.Message = err.Error()
	} else {
		res.Message = fmt.Sprintf("Logged in as %s", me.Email)
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
