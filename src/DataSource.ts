import { FunctionX, LogResult, MyDataSourceOptions, MyQuery } from './types';
import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  DefaultTimeRange,
  TableData,
  TimeSeries,
} from '@grafana/data';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  private settings: DataSourceInstanceSettings<MyDataSourceOptions>;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.settings = instanceSettings;
  }

  distinctiveId(input: FunctionX[]): FunctionX[] {
    const tag = new Map<number, boolean>();
    return input.filter(fn => {
      if (tag.get(fn.id) === undefined) {
        tag.set(fn.id, true);
        return true;
      }
      return false;
    });
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
      const topicRead = String(clientId) + '/' + fn.meta['topic_read'];
      if (fmap[topicRead] != null) {
        fmap[topicRead].push(fn);
      } else {
        fmap.set(topicRead, [fn]);
      }
    });
    return fmap;
  }

  fetchLog(installationId: number, from: number, to: number, offset: number, topics?: string[]): Promise<LogResult> {
    const url = this.settings.jsonData.url + '/api/v3beta/log/' + String(installationId);
    const queryParams = {
      from: String(from),
      to: String(to),
      offset: String(offset),
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

  fetchState(installationId: number, topics?: string[]): Promise<LogResult[]> {
    const url = `${this.settings.jsonData.url}/api/v2/status/${installationId}`;
    const queryParams = {};
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
        const res: LogResult = {
          total: obj.length,
          count: obj.length,
          last: 0,
          data: obj.map(ent => {
            return {
              timestamp: ent.timestamp,
              client_id: ent.client_id,
              installation_id: ent.installation_id,
              topic: `${ent.client_id}/${ent.topic}`,
              value: ent.value,
              msg: ent.msg,
            };
          }),
        };
        if (obj.length > 0) {
          res.last = obj[obj.length - 1].timestamp;
        }
        return [res];
      });
  }

  async fetchLogFull(installationId: number, from: number, to: number, topics: string[]): Promise<LogResult[]> {
    const results = new Array<LogResult>();
    let offset = 0;
    while (true) {
      const logResult = await this.fetchLog(installationId, from / 1000, to / 1000, offset, topics);
      results.push(logResult);
      offset += logResult.count;
      if (offset >= logResult.total) {
        break;
      }
    }
    return results;
  }

  async fetchQueriedFunctions(target: MyQuery): Promise<FunctionX[]> {
    let functions = await this.fetchFilteredFunctions(target.installationId, target.meta);
    if (target.messageFrom !== '') {
      const messageMeta = [{ key: 'type', value: target.messageFrom }];
      for (const originalFilter of target.meta) {
        if (originalFilter.key !== 'type') {
          messageMeta.push(originalFilter);
        }
      }
      // Add "message from" functions
      const tmp = await this.fetchFilteredFunctions(target.installationId, messageMeta);
      for (const fn of tmp) {
        functions.push(fn);
      }
    }
    functions = this.distinctiveId(functions);
    return functions;
  }

  async queryTimeSeries(target: MyQuery, from: number, to: number): Promise<TimeSeries[] | null> {
    const seriesList: TimeSeries[] = [];
    const targetDatapoints = new Map<string, number[][]>();
    const targetDatapointsName = new Map<string, string>();

    const functions = await this.fetchFilteredFunctions(target.installationId, target.meta);
    const mappings = this.createLogTopicMappings(target.clientId, functions);
    const topics = Array.from(mappings.keys());
    if (topics.length === 0) {
      return null;
    }
    const results = target.stateOnly
      ? await this.fetchState(target.installationId, topics)
      : await this.fetchLogFull(target.installationId, from, to, topics);

    for (const logResult of results) {
      for (const logEntry of logResult.data) {
        const matchingFunctions = mappings.get(logEntry.topic);
        if (matchingFunctions === undefined) {
          continue;
        }
        for (const matchingFunction of matchingFunctions) {
          // Grouping
          let group = String(matchingFunction.id);
          if (target.groupBy !== undefined && target.groupBy !== '') {
            const tmpGroup = matchingFunction.meta[target.groupBy];
            if (tmpGroup !== undefined) {
              group = tmpGroup;
            }
          }
          let dps = targetDatapoints.get(group);
          if (dps === undefined) {
            dps = [];
            targetDatapoints.set(group, dps);
          }
          // Naming
          if (!target.nameBy || target.nameBy === '') {
            target.nameBy = 'name';
          }
          targetDatapointsName.set(group, matchingFunction.meta[target.nameBy]);

          dps.push([logEntry.value, logEntry.timestamp * 1000]);
        }
      }
    }
    targetDatapoints.forEach((value, key) => {
      let name = targetDatapointsName.get(key);
      if (name === undefined) {
        name = key;
      }
      const dp: TimeSeries = {
        refId: target.refId,
        target: name,
        datapoints: value,
      };
      seriesList.push(dp);
    });

    return seriesList;
  }

  async queryTableData(target: MyQuery, from: number, to: number): Promise<TableData[] | null> {
    const targetData: TableData[] = [];
    const targetDatapoints = new Map<string, any[][]>();
    const targetDatapointsName = new Map<string, string>();

    const functions = await this.fetchQueriedFunctions(target);
    const mappings = this.createLogTopicMappings(target.clientId, functions);
    const topics = Array.from(mappings.keys());
    if (topics.length === 0) {
      return null;
    }
    const results = target.stateOnly
      ? await this.fetchState(target.installationId, topics)
      : await this.fetchLogFull(target.installationId, from, to, topics);
    console.log(functions);
    const lastMsg = new Map<string, string>();
    for (const logResult of results) {
      for (const logEntry of logResult.data) {
        const matchingFunctions = mappings.get(logEntry.topic);
        if (matchingFunctions === undefined) {
          continue;
        }
        for (const matchingFunction of matchingFunctions) {
          let msg = logEntry.msg;
          if (msg === undefined) {
            msg = '';
          }
          let link = target.linkKey;
          if (link === undefined || link === '') {
            link = 'device_id';
          }
          if (target.messageFrom !== undefined && target.messageFrom !== '' && matchingFunction.type === target.messageFrom) {
            lastMsg.set(matchingFunction.meta[link], logEntry.msg);
            continue;
          } else if (target.messageFrom !== undefined && target.messageFrom !== '') {
            const tmpMsg = lastMsg.get(matchingFunction.meta[link]);
            if (tmpMsg !== undefined) {
              msg = tmpMsg;
            } else {
              continue;
            }
          }
          // Grouping
          let group = String(matchingFunction.id);
          if (target.groupBy !== undefined && target.groupBy !== '') {
            let tmpGroup = matchingFunction.meta[target.groupBy];
            if (tmpGroup === undefined) {
              tmpGroup = msg;
            }
            group = tmpGroup;
          }

          // Naming
          if (!target.nameBy || target.nameBy === '') {
            target.nameBy = 'name';
          }
          targetDatapointsName.set(group, matchingFunction.meta[target.nameBy]);

          let dps = targetDatapoints.get(group);
          if (dps === undefined) {
            dps = [];
            targetDatapoints.set(group, dps);
          }

          const dat = new Date(logEntry.timestamp * 1000);
          const row = [dat.toISOString(), matchingFunction.meta[target.nameBy], logEntry.value, msg];
          dps.push(row);
        }
      }
    }
    targetDatapoints.forEach((value, key) => {
      const dp: TableData = {
        name: targetDatapointsName.get(key),
        columns: [{ text: 'Time' }, { text: 'name' }, { text: 'value' }, { text: 'msg' }],
        rows: value,
        refId: target.refId,
      };
      console.log(dp);
      targetData.push(dp);
    });
    return targetData;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    let { range } = options;
    if (range == null) {
      range = DefaultTimeRange;
    }
    const from = range.from.valueOf();
    const to = range.to.valueOf();
    const targets = options.targets.filter(target => !target.hide);

    const response: DataQueryResponse = {
      data: [],
    };

    const jobs: Array<Promise<any[] | null>> = [];
    for (const target of targets) {
      if (target.tabledata) {
        const job = this.queryTableData(target, from, to);
        jobs.push(job);
      } else {
        const job = this.queryTimeSeries(target, from, to);
        jobs.push(job);
      }
    }
    const data = await Promise.all(jobs);
    for (const series of data) {
      if (series === null) {
        continue;
      }
      for (const serie of series) {
        response.data.push(serie);
      }
    }
    return response;
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
