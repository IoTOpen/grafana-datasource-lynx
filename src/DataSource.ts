import { FunctionX, Installation, MyDataSourceOptions, MyQuery } from './types';
import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  DefaultTimeRange,
  TimeSeries,
} from '@grafana/data';
import { BackendSrv } from '@grafana/runtime';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  private settings: DataSourceInstanceSettings<MyDataSourceOptions>;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>, private backendSrv: BackendSrv) {
    super(instanceSettings);
    this.settings = instanceSettings;
  }

  backendAPIRequest(obj: MyQuery, from: number, to: number): Promise<TimeSeries[]> {
    const job: any = obj;
    job.from = from / 1000;
    job.to = to / 1000;
    let data = JSON.stringify(job);
    return this.backendSrv
      .post(`/api/datasources/${this.settings.id}/resources/lynx-api`, data)
      .then(result => result as TimeSeries[]);
  }

  fetchInstallations(): Promise<Installation[]> {
    return this.backendSrv
      .datasourceRequest({
        method: 'GET',
        url: `${this.settings.url}/api/v2/installationinfo`,
      })
      .then(result => result.data);
  }

  fetchFunctions(installationId: number): Promise<FunctionX[]> {
    return this.backendSrv
      .datasourceRequest({
        method: 'GET',
        url: `${this.settings.url}/api/v2/functionx/${installationId}`,
      })
      .then(result => result.data as FunctionX[]);
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
      const job = this.backendAPIRequest(target, from, to);
      jobs.push(job);
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
    return new Promise((resolve, reject) => {
      this.backendSrv
        .datasourceRequest({
          method: 'GET',
          url: `${this.settings.url}/api/v2/installationinfo`,
        })
        .then(result => {
          resolve({ status: 'success', message: 'All good!' });
        })
        .catch(err => {
          reject({ status: 'error', message: err.statusText });
        });
    });
  }
}
