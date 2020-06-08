#!/bin/bash
IMAGE="grafana"
VERSION="7.0.3"

docker run --rm \
	-e "GF_LOG_LEVEL=debug" \
	-e "GF_SECURITY_ADMIN_PASSWORD=helloworld" \
	-e "GF_INSTALL_PLUGINS=grafana-worldmap-panel,grafana-piechart-panel,pr0ps-trackmap-panel,https://packages.hiveeyes.org/grafana/grafana-map-panel/grafana-map-panel-0.9.0.zip;grafana-map-panel" \
	-v `pwd`/data/:/var/lib/grafana -v `pwd`/dist/:/var/lib/grafana/plugins/plugin \
	-p 3000:3000 \
	--user 0 \
	grafana/${IMAGE}:${VERSION}
