# IoTOpen grafana datasource

### Installation
#### Docker
```bash
$ docker run -p 3000:3000 \
  -e "GF_INSTALL_PLUGINS="<link to zip-file>" \
  grafana/grafana:latest
```

#### Manually
* Download the plugin zip file from the releases
* Unzip into grafana plugin directory (defaults to /var/lib/grafana/plugins)
* Restart grafana


### Configure

* Login to Lynx AAM
* Go to Profile -> Security -> Generate new API key
* Copy key to grafana datasource configuration.

### Query

All filters will be passed to functionx endpoint as filters.
Series will be grouped by all matching functions.

### Test from repo

Make sure docker daemon is up and running.
There is a script ```./grafana-dev.sh``` that starts a Grafana server and maps
the dist dir into grafa plugins.

It automatically installs following plugins:
* grafana-piechart-panel
* grafana-worldmap-panel
* pr0ps-trackmap-panel

Make sure to run the script in the git root directory.

Default username password is ```admin```:```helloworld``` and server is running
on http://localhost:3000


