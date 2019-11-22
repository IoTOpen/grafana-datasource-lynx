import defaults from 'lodash/defaults';

import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings } from '@grafana/ui';

import { MyQuery, MyDataSourceOptions, defaultQuery } from './types';
import { MutableDataFrame, FieldType} from '@grafana/data';

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


  createLogTopicMappings(functions: any[]): Map<string, any[]> {
    let fmap: Map<string, any[]> = new Map();
    functions.map((fn) => {
      if (fmap[fn.meta.topic_read] != null) {
        fmap[fn.meta.topic_read].push(fn)
      } else {
        fmap[fn.meta.topic_read] = [fn];
      }
    });
    return fmap;
  }

  query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range.from.valueOf();
    const to = range.to.valueOf();

    // Return a constant for each query
    const data = options.targets.map(target => {
      const query = defaults(target, defaultQuery);
      this.fetchFilteredFunctions(query.installationId, query.meta).then(data => {
        let mappings = this.createLogTopicMappings(data);
        console.log(mappings);

      });

      return new MutableDataFrame({
        refId: query.refId,
        fields: [
          { name: 'Time', values: [from, to], type: FieldType.time },
          { name: 'Value', values: [query.constant, query.constant], type: FieldType.number },
        ],
      });
    });

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
