#!/bin/bash
IMAGE="grafana"
VERSION="8.5.27"

docker run --rm \
	-e "GF_LOG_LEVEL=debug" \
	-e "GF_LOG_MODE=console" \
	-e "GF_LOG_CONSOLE_FORMAT=json" \
	-e "GF_SECURITY_ADMIN_PASSWORD=helloworld" \
	-e "GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=iotopen-datasource" \
	-e "GF_INSTALL_PLUGINS=grafana-worldmap-panel,grafana-piechart-panel,pr0ps-trackmap-panel,https://packages.hiveeyes.org/grafana/grafana-map-panel/grafana-map-panel-0.9.0.zip;grafana-map-panel" \
	-e "GF_AUTH_GENERIC_OAUTH_CLIENT_ID=6483eb86-bdf7-40a4-ad67-4fa327d5f0fd" \
	-e "GF_AUTH_GENERIC_OAUTH_CLIENT_SECRET=bf0c73f5-d060-4e55-9c57-6494efb1e522" \
	-e "GF_AUTH_GENERIC_OAUTH_TOKEN_URL=https://lynx-dev.iotopen.se/api/v2/oauth2/token" \
	-e "GF_AUTH_GENERIC_OAUTH_AUTH_URL=https://lynx-dev.iotopen.se/oauth2/authorize" \
	-e "GF_AUTH_GENERIC_OAUTH_API_URL=https://lynx-dev.iotopen.se/api/v2/oauth2/userinfo" \
	-e "GF_AUTH_GENERIC_OAUTH_ENABLED=true" \
	-e "GF_AUTH_GENERIC_OAUTH_SCOPES=openid" \
	-e "GF_AUTH_GENERIC_OAUTH_AUTH_STYLE=InHeader" \
	-e "GF_AUTH_GENERIC_OAUTH_NAME=Lynx" \
	-e "GF_AUTH_GENERIC_OAUTH_ALLOW_ASSIGN_GRAFANA_ADMIN=true" \
	-e "GF_AUTH_GENERIC_OAUTH_ROLE_ATTRIBUTE_PATH='Admin'" \
	-v `pwd`/data/:/var/lib/grafana -v `pwd`/dist/:/var/lib/grafana/plugins/plugin \
	-p 3000:3000 \
	--user 0 \
	grafana/${IMAGE}:${VERSION}
