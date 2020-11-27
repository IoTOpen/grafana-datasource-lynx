package main

import (
	"github.com/grafana/grafana-plugin-sdk-go/backend/datasource"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"os"
)

func main() {
	logger := log.New()
	ds := &dataSource{}
	opts := datasource.ServeOpts{
		QueryDataHandler: ds,
	}
	if err := datasource.Serve(opts); err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}
}
