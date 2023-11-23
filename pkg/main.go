package main

import (
	"github.com/IoTOpen/grafana-datasource-lynx/pkg/plugin"
	"github.com/grafana/grafana-plugin-sdk-go/backend/datasource"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"log/slog"
	"os"
)

func main() {
	slog.Info("Starting Lynx datasource")
	if err := datasource.Manage("iotopen-datasource", plugin.NewDatasourceInstance, datasource.ManageOpts{}); err != nil {
		log.DefaultLogger.Error(err.Error())
		os.Exit(1)
	}
}
