import { FunctionX, Installation, MyDataSourceOptions, MyQuery } from './types';
import { DataSourceInstanceSettings } from '@grafana/data';
import { BackendSrv, DataSourceWithBackend } from '@grafana/runtime';

export class DataSource extends DataSourceWithBackend<MyQuery, MyDataSourceOptions> {
  private settings: DataSourceInstanceSettings<MyDataSourceOptions>;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>, private backendSrv: BackendSrv) {
    super(instanceSettings);
    this.settings = instanceSettings;
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
