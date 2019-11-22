import defaults from 'lodash/defaults';

import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings } from '@grafana/ui';

import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';
import { FieldType, MISSING_VALUE, MutableDataFrame } from '@grafana/data';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  private settings: DataSourceInstanceSettings<MyDataSourceOptions>;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.settings = instanceSettings;
  }

  fetchInstallations(): Promise<any> {
    return fetch(this.settings.jsonData.url + '/api/v2/installationinfo/grafana/ds', {
      headers: {
        Authorization: 'Basic ' + btoa('grafana:' + this.settings.jsonData.apiKey),
      },
    }).then(result => result.json());
  }

  fetchFunctions(installationId: number): Promise<any> {
    return fetch(this.settings.jsonData.url + '/api/v2/functionx/' + installationId, {
      headers: {
        Authorization: 'Basic ' + btoa('grafana:' + this.settings.jsonData.apiKey),
      },
    }).then(result => result.json());
  }

  fetchFilteredFunctions(installationId: number, filter: any): Promise<any> {
    const queryParams = filter.map((entry) => {
      return encodeURIComponent(entry.key) + "=" + encodeURIComponent(entry.value);
    }).join("&");
    return fetch(this.settings.jsonData.url + '/api/v2/functionx/' + installationId + "?" + queryParams, {
      headers: {
        Authorization: 'Basic ' + btoa('grafana:' + this.settings.jsonData.apiKey),
      },
    }).then(result => result.json());
  }


  createLogTopicMappings(clientId: number, functions: any[]): Map<string, any[]> {
    let fmap: Map<string, any[]> = new Map();
    functions.map((fn) => {
      if(fn.meta.topic_read == null){
        return;
      }
      let topicRead = String(clientId) + "/" + fn.meta.topic_read;
      if (fmap[topicRead] != null) {
        fmap[topicRead].push(fn)
      } else {
        fmap.set(topicRead, [fn]);
      }
    });
    return fmap;
  }

  fetchLog(installationId: number, from: number, to: number, topics?: string[]): any {
    const url = this.settings.jsonData.url + "/api/v2beta/log/" + String(installationId);
    let queryParams = {
      "from": String(from),
      "to": String(to),
    };
    if(topics) {
      queryParams["topics"] = topics.join(",");
    }
    let queryString = "?" + Object.keys(queryParams).map(key => encodeURIComponent(key) + "=" + encodeURIComponent(queryParams[key])).join("&");
    return fetch(url + queryString, {
      headers: {
        Authorization: 'Basic ' + btoa('grafana:' + this.settings.jsonData.apiKey),
      },
    }).then(result => result.json());
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range.from.valueOf();
    const to = range.to.valueOf();

    let data = new Array<any>();
    for(let target of options.targets) {
      const query = defaults(target, defaultQuery);
      let filteredFunctions = await this.fetchFilteredFunctions(query.installationId, query.meta);
      console.log(filteredFunctions);
      let mappings = this.createLogTopicMappings(query.clientId, filteredFunctions);
      let log = await this.fetchLog(query.installationId, from / 1000, to / 1000, Array.from(mappings.keys()));
      const res = new MutableDataFrame({
        refId: query.refId,
        fields: []
      });
      res.addField({name: "Time", type:FieldType.time});
      for(let fn of filteredFunctions) {
        res.addField({
          name: fn.meta.name,
          type: FieldType.number,
        });
      }

      console.log(mappings);

      for(let entry of log.data) {
        let row = new Array<any>();
        row.push(entry.time * 1000);
        let currentFn = mappings.get(entry.topic);
        if (currentFn == null) {
          continue;
        }
        console.log(currentFn);
        for(let fn of filteredFunctions) {
          if (fn.id == currentFn[0].id) {
            row.push(entry.value);
          } else {
            row.push(MISSING_VALUE);
          }
        }
        res.appendRow(row);
      }
      console.log(res);
      data.push(res);
    }
    return Promise.resolve({ data });
  }

  testDatasource() {
    // Implement a health check for your data source.
    return new Promise((resolve, reject) => {
      fetch(this.settings.jsonData.url + '/api/v2/installationinfo/grafana/ds', {
        headers: {
          Authorization: 'Basic ' + btoa('grafana:' + this.settings.jsonData.apiKey),
        },
      })
        .then(value => {
          if (value.status != 200) {
            throw new Error(value.statusText);
          }
          return value.json();
        })
        .then(value => {
          console.log(value);
          resolve({ status: 'success', message: 'All good!' });
        })
        .catch(reason => {
          reject({ status: 'error', message: reason.message });
        });
    });
  }
}
