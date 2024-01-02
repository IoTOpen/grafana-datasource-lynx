#!/bin/bash
PLUGIN_ID=$(grep '"id"' < src/plugin.json | sed -E 's/.*"id" *: *"(.*)".*/\1/')
cp -r dist "${PLUGIN_ID}"
zip -qr "${PLUGIN_ID}.zip" "${PLUGIN_ID}"
npx @grafana/plugin-validator@latest -sourceCodeUri file://. "${PLUGIN_ID}.zip"
rm -r "${PLUGIN_ID}" "${PLUGIN_ID}.zip"
