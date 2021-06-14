package main

import (
	"os"

	"github.com/IoTOpen/grafana-datasource-lynx/pkg/datasource"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

func main() {
	logger := log.New()
	logger.Debug("Starting Lynx datasource")
	ds := datasource.NewDatasource()
	opts := backend.ServeOpts{
		QueryDataHandler:   ds,
		CheckHealthHandler: ds,
	}
	if err := backend.Serve(opts); err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}
	logger.Debug("Bye")
}
