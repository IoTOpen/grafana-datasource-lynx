import { FunctionX, Installation, LogResult, MyDataSourceOptions, MyQuery } from './types';
import {
  ArrayVector,
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  DefaultTimeRange,
  FieldType,
  TableData,
  TimeSeries,
} from '@grafana/data';
import { BackendSrv } from '@grafana/runtime';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  private settings: DataSourceInstanceSettings<MyDataSourceOptions>;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>, private backendSrv: BackendSrv) {
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

  fetchInstallations(): Promise<Installation[]> {
    return this.backendSrv
      .datasourceRequest({
        method: 'GET',
        url: `${this.settings.url}/api/v2/installationinfo`,
      })
      .then(result => result.data);
  }

  fetchFunctions(installationId: number): Promise<any> {
    return this.backendSrv
      .datasourceRequest({
        method: 'GET',
        url: `${this.settings.url}/api/v2/functionx/${installationId}`,
      })
      .then(result => result.data);
  }

  fetchFilteredFunctions(installationId: number, filter: any): Promise<FunctionX[]> {
    const queryParams = filter
      .map(entry => {
        return encodeURIComponent(entry.key) + '=' + encodeURIComponent(entry.value);
      })
      .join('&');
    return this.backendSrv
      .datasourceRequest({
        method: 'GET',
        url: `${this.settings.url}/api/v2/functionx/${installationId}?${queryParams}`,
      })
      .then(result => result.data);
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
    const url = `${this.settings.url}/api/v3beta/log/${installationId}`;
    const queryParams = {
      from: String(from),
      to: String(to),
      offset: String(offset),
      order: 'asc',
    };
    if (topics) {
      queryParams['topics'] = topics.join(',');
    }
    const queryString = Object.keys(queryParams)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
      .join('&');
    return this.backendSrv
      .datasourceRequest({
        url: `${url}?${queryString}`,
        method: 'GET',
      })
      .then(result => result.data as LogResult);
  }

  fetchState(installationId: number, topics?: string[]): Promise<LogResult[]> {
    const url = `${this.settings.url}/api/v2/status/${installationId}`;
    const queryParams = {};
    if (topics) {
      queryParams['topics'] = topics.join(',');
    }
    const queryString =
      '?' +
      Object.keys(queryParams)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
        .join('&');
    return this.backendSrv
      .datasourceRequest({
        url: `${url}?${queryString}`,
        method: 'GET',
      })
      .then(result => result.data)
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
    const results: LogResult[] = [];
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
    if (target.messageFrom !== '' && target.messageFrom !== undefined) {
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

    const columns = [{ text: 'Time' }, { text: 'name' }, { text: 'value' }, { text: 'msg' }];
    const metaColumns: string[] = [];

    const functions = await this.fetchQueriedFunctions(target);
    const mappings = this.createLogTopicMappings(target.clientId, functions);
    const topics = Array.from(mappings.keys());
    if (topics.length === 0) {
      return null;
    }

    if (target.metaAsFields) {
      for (const func of functions) {
        for (const key in func.meta) {
          if (metaColumns.indexOf(key) === -1) {
            metaColumns.push(key);
            columns.push({ text: key });
          }
        }
      }
    }

    const results = target.stateOnly
      ? await this.fetchState(target.installationId, topics)
      : await this.fetchLogFull(target.installationId, from, to, topics);
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
          if (
            target.messageFrom !== undefined &&
            target.messageFrom !== '' &&
            matchingFunction.type === target.messageFrom
          ) {
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
          const row = [dat, matchingFunction.meta[target.nameBy], logEntry.value, msg];
          if (target.metaAsFields) {
            for (const key of metaColumns) {
              if (matchingFunction.meta[key]) {
                row.push(matchingFunction.meta[key]);
              } else {
                row.push('');
              }
            }
          }
          dps.push(row);
        }
      }
    }
    targetDatapoints.forEach((value, key) => {
      const dp: TableData = {
        name: targetDatapointsName.get(key),
        columns: columns,
        rows: value,
        refId: target.refId,
      };
      targetData.push(dp);
    });
    return targetData;
  }

  async queryDataFrames(target: MyQuery): Promise<DataFrame[]> {
    const data = [Date.now() - 1000 * 60 * 5, Date.now() - 1000 * 60 * 2];
    const result: DataFrame[] = [];
    const df: DataFrame = {
      name: 'MyFrame',
      refId: target.refId,
      length: 2,
      fields: [
        {
          type: FieldType.time,
          name: '_time_',
          config: {},
          labels: {
            timelabel: 'time1',
          },
          values: new ArrayVector(data),
        },
        {
          type: FieldType.number,
          name: 'value',
          config: {
            displayName: 'value',
          },
          labels: {
            valuelabels: 'lol',
          },
          values: new ArrayVector([1, 2]),
        },
        {
          type: FieldType.string,
          name: 'msg',
          config: {
            displayName: 'msg',
          },
          labels: {
            valuelabels: 'lol',
          },
          values: new ArrayVector(['hello', 'world']),
        },
      ],
    };

    const df2: DataFrame = {
      name: 'MyData2',
      length: 2,
      refId: target.refId,
      fields: [
        {
          name: '_time_',
          config: {},
          type: FieldType.time,
          labels: {
            label2: 'helloworld',
          },
          values: new ArrayVector(data),
        },
        {
          name: 'value',
          config: {},
          type: FieldType.number,
          labels: {
            level: '3',
            geohash: 'u6sdjpqs0',
          },
          values: new ArrayVector([3, 1]),
        },
        {
          type: FieldType.string,
          name: 'msg',
          config: {
            displayName: 'msg',
          },
          labels: {
            valuelabels: 'lol',
          },
          values: new ArrayVector(['hello', 'wow']),
        },
      ],
    };

    result.push(df);
    result.push(df2);

    return result;
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
      //    const job = this.queryDataFrames(target);
      //    jobs.push(job);

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
      fetch(`${this.settings.url}/api/v2/installationinfo`)
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
