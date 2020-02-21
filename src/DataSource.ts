import { FunctionX, LogResult, MyDataSourceOptions, MyQuery } from './types';
import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings, DefaultTimeRange } from '@grafana/data';

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

  fetchFilteredFunctions(installationId: number, filter: any): Promise<FunctionX[]> {
    const queryParams = filter
      .map(entry => {
        return encodeURIComponent(entry.key) + '=' + encodeURIComponent(entry.value);
      })
      .join('&');
    return fetch(this.settings.jsonData.url + '/api/v2/functionx/' + installationId + '?' + queryParams, {
      headers: {
        Authorization: 'Basic ' + btoa('grafana:' + this.settings.jsonData.apiKey),
      },
    }).then(result => result.json());
  }

  createLogTopicMappings(clientId: number, functions: FunctionX[]): Map<string, FunctionX[]> {
    const fmap: Map<string, FunctionX[]> = new Map();
    functions.map(fn => {
      if (fn.meta['topic_read'] === null) {
        return;
      }
      //const topicRead = String(clientId) + '/' + fn.meta['topic_read'];
      const topicRead = String(clientId) + '/' + fn.meta['topic_read'];
      if (fmap[topicRead] != null) {
        fmap[topicRead].push(fn);
      } else {
        fmap.set(topicRead, [fn]);
      }
    });
    return fmap;
  }

  fetchLog(installationId: number, from: number, to: number, topics?: string[]): Promise<LogResult> {
    const url = this.settings.jsonData.url + '/api/v3beta/log/' + String(installationId);
    const queryParams = {
      from: String(from),
      to: String(to),
      order: 'asc',
    };
    if (topics) {
      queryParams['topics'] = topics.join(',');
    }
    const queryString =
      '?' +
      Object.keys(queryParams)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
        .join('&');
    return fetch(url + queryString, {
      headers: {
        Authorization: 'Basic ' + btoa('grafana:' + this.settings.jsonData.apiKey),
      },
    })
      .then(result => result.json())
      .then(obj => {
        return obj as LogResult;
      });
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    let { range } = options;
    if (range == null) {
      range = DefaultTimeRange;
    }
    const from = range.from.valueOf();
    const to = range.to.valueOf();
    const targets = options.targets.filter(target => !target.hide);

    const seriesList: any[] = [];

    for (const target of targets) {
      const targetDatapoints = new Map<string, number[][]>();

      const functions = await this.fetchFilteredFunctions(target.installationId, target.meta);
      const mappings = this.createLogTopicMappings(target.clientId, functions);
      const logResult = await this.fetchLog(target.installationId, from / 1000, to / 1000, Array.from(mappings.keys()));
      for (const logEntry of logResult.data) {
        const matchingFunctions = mappings.get(logEntry.topic);
        if (matchingFunctions === undefined) {
          continue;
        }
        for (const matchingFunction of matchingFunctions) {
          const name = matchingFunction.meta['name'];
          let dps = targetDatapoints.get(name);
          if (dps === undefined) {
            dps = [];
            targetDatapoints.set(name, dps);
          }
          dps.push([logEntry.value, logEntry.timestamp * 1000]);
        }
      }
      targetDatapoints.forEach((value, key) => {
        const dp = { target: key, datapoints: value };
        console.log(dp);
        seriesList.push(dp);
      });
    }

    return {
      data: seriesList,
    };
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
          if (!(value.status === 200)) {
            throw new Error(value.statusText);
          }
          return value.json();
        })
        .then(value => {
          resolve({ status: 'success', message: 'All good!' });
        })
        .catch(reason => {
          reject({ status: 'error', message: reason.message });
        });
    });
  }
}
