# IoTOpen grafana datasource

### Installation
#### Docker
```bash
$ docker run -p 3000:3000 \
  -e "GF_INSTALL_PLUGINS="https://cloud.iotopen.se/s/RTwsMwQdkbTBesa/download;iotopen-datasource" \
  grafana/grafana:latest
```

#### Manually
* Download the plugin zip file from [here](https://cloud.iotopen.se/s/RTwsMwQdkbTBesa/download)
* Unzip into grafana plugin directory (defaults to /var/lib/grafana/plugins)
* Restart grafana


### Configure

* Login to aam
* Go to profile -> security -> generate new API key
* Copy key to grafana datasource configuration.

### Query

All filters will be passed to functionx endpoint as filters.

Series will be grouped by all matching functions.
