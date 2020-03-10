#!/bin/bash
IMAGE="grafana"
VERSION="6.6.2"

docker run --rm \
	-e "GF_LOG_LEVEL=debug" \
	-e "GF_SECURITY_ADMIN_PASSWORD=helloworld" \
	-e "GF_INSTALL_PLUGINS=grafana-worldmap-panel,grafana-piechart-panel,pr0ps-trackmap-panel" \
	-v `pwd`/data/:/var/lib/grafana -v `pwd`/dist/:/var/lib/grafana/plugins/plugin \
	-p 3000:3000 \
	--user 0 \
	grafana/${IMAGE}:${VERSION}
