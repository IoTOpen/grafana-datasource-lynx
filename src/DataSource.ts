import {DataQueryRequest, DataQueryResponse, DataSourceInstanceSettings} from '@grafana/data';
import {DataSourceWithBackend, getBackendSrv, getTemplateSrv} from '@grafana/runtime';
import {FunctionX, Installation, MyDataSourceOptions, MyQuery} from './types';
import {Observable} from 'rxjs';
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

    query(options: DataQueryRequest<MyQuery>): Observable<DataQueryResponse> {
        const templateSrv = getTemplateSrv();
        const targets = options.targets.map(value => {
            return {
                ...value, meta: value.meta.map(meta => {
                    return {
                        key: templateSrv.replace(meta.key),
                        value: templateSrv.replace(meta.value),
                    }
                })
            }
        });
        return super.query({...options, targets});
    }
}
