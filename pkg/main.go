package main

import (
	"github.com/IoTOpen/grafana-datasource-lynx/pkg/plugin"
	"github.com/grafana/grafana-plugin-sdk-go/backend/datasource"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"os"
)

func main() {
	if err := datasource.Manage("iotopen-datasource", plugin.NewDatasourceInstance, datasource.ManageOpts{}); err != nil {
		log.DefaultLogger.Error(err.Error())
		os.Exit(1)
	}
}
