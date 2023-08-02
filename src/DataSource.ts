import {DataSourceInstanceSettings} from '@grafana/data';
import {DataSourceWithBackend, getBackendSrv} from '@grafana/runtime';
import {FunctionX, Installation, MyDataSourceOptions, MyQuery} from './types';

export class DataSource extends DataSourceWithBackend<MyQuery, MyDataSourceOptions> {
    private settings: DataSourceInstanceSettings<MyDataSourceOptions>;

    constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
        super(instanceSettings);
        this.settings = instanceSettings;
    }

    fetchInstallations(): Promise<Installation[]> {
        return getBackendSrv()
            .datasourceRequest({
                method: 'GET',
                url: `${this.settings.url}/api/v2/installationinfo`,
            })
            .then(result => result.data);
    }

    fetchFunctions(installationId: number): Promise<FunctionX[]> {
        return getBackendSrv()
            .datasourceRequest({
                method: 'GET',
                url: `${this.settings.url}/api/v2/functionx/${installationId}`,
            })
            .then(result => result.data as FunctionX[]);
    }

    testDatasource() {
        return new Promise((resolve, reject) => {
            getBackendSrv()
                .datasourceRequest({
                    method: 'GET',
                    url: `${this.settings.url}/api/v2/installationinfo`,
                })
                .then(result => {
                    resolve({status: 'success', message: 'All good!'});
                })
                .catch(err => {
                    reject({status: 'error', message: err.statusText});
                });
        });
    }
}
