package main

import (
	"net/http"
	"os"

	"github.com/IoTOpen/grafana-datasource-lynx/pkg/datasource"
	"github.com/gorilla/mux"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/backend/resource/httpadapter"
)

func main() {
	logger := log.New()
	logger.Debug("Starting Lynx datasource")
	ds := datasource.NewDatasource()
	r := mux.NewRouter()
	r.Handle("/lynx-api", http.HandlerFunc(ds.LynxAPIHandler)).Methods(http.MethodPost)
	resourceHandler := httpadapter.New(r)
	opts := backend.ServeOpts{
		QueryDataHandler:    ds,
		CheckHealthHandler:  ds,
		CallResourceHandler: resourceHandler,
	}
	if err := backend.Serve(opts); err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}
	logger.Debug("Bye")
}
