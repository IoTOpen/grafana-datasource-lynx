import {DataQueryRequest, DataQueryResponse, DataSourceInstanceSettings, MetricFindValue} from '@grafana/data';
import {DataSourceWithBackend, getBackendSrv, getTemplateSrv} from '@grafana/runtime';
import {FunctionX, Installation, MyDataSourceOptions, MyQuery, MyVariableQuery} from './types';
import {Observable} from 'rxjs';
import {toNumber} from "lodash";

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

    fetchFunctions(installationId: number, meta?: { [key: string]: string }): Promise<FunctionX[]> {
        const q = meta ? Object.keys(meta).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(meta[key])}`).join('&') : '';
        return getBackendSrv()
            .datasourceRequest({
                method: 'GET',
                url: `${this.settings.url}/api/v2/functionx/${installationId}?${q}`,
            })
            .then(result => result.data as FunctionX[]);
    }

    query(options: DataQueryRequest<MyQuery>): Observable<DataQueryResponse> {
        console.log('query', options);
        const templateSrv = getTemplateSrv();
        //const varMap = templateSrv.getVariables().reduce((acc, x) => {
        //    acc[x.name] = templateSrv.replace(`\${${x.name}}`);
        //    return acc
        //}, {} as { [key: string]: string});
        const targets = options.targets.map(value => {
            return {
                //...value, installationId: value.installationVariable ? toNumber(varMap[value.installationVariable]) : value.installationId,
                ...value, installationId: value.installationVariable ? toNumber(templateSrv.replace(value.installationVariable)) : value.installationId,
                meta: value.meta.map(meta => {
                    return {
                        key: templateSrv.replace(meta.key),
                        value: templateSrv.replace(meta.value),
                    }
                }, value)
            }
        });
        return super.query({...options, targets});
    }

    findMetaQuery(query: MyVariableQuery, options?: any): Promise<MetricFindValue[]> {
        if (query.metaKey === '' || query.installationId === 0) {
            return Promise.resolve([]);
        }
        const filter = query.meta ? query.meta.reduce<{ [key: string]: string }>((acc, meta) => {
            if (meta.key !== '' && meta.value !== '') {
                acc[meta.key] = meta.value;
            }
            return acc;
        }, {}) : {};

        return this.fetchFunctions(query.installationId, filter).then(functions => {
            return functions.reduce<MetricFindValue[]>((acc, func) => {
                if (!acc.find(f => f.text === func.meta[query.metaKey]) && func.meta[query.metaKey]) {
                    return [...acc, {text: func.meta[query.metaKey], value: func.meta[query.metaKey]}];
                }
                return acc;
            }, []);
        }).then(result => {
            return result;
        })
    }

    metricFindQuery(query: MyVariableQuery, options?: any): Promise<MetricFindValue[]> {
        const qt = query.queryMode ? query.queryMode : 'functionMeta';
        switch (qt) {
            case 'installation':
                return this.fetchInstallations().then(installations => {
                    return installations.reduce<MetricFindValue[]>((acc, installation) => {
                        return [...acc, {text: installation.name, value: installation.id}];
                    }, []);
                });
            case 'functionMeta':
                return this.findMetaQuery(query, options);
            default:
                return this.findMetaQuery(query, options);

        }
    }
}
