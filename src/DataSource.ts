import {DataQueryRequest, DataQueryResponse, DataSourceInstanceSettings, MetricFindValue} from '@grafana/data';
import {DataSourceWithBackend, getBackendSrv, getTemplateSrv} from '@grafana/runtime';
import {DeviceX, FunctionX, Installation, Meta, MyDataSourceOptions, MyQuery, MyVariableQuery} from './types';
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

    fetchDevices(installationId: number, meta?: { [key: string]: string }): Promise<DeviceX[]> {
        const q = meta ? Object.keys(meta).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(meta[key])}`).join('&') : '';
        return getBackendSrv()
            .datasourceRequest({
                method: 'GET',
                url: `${this.settings.url}/api/v2/devicex/${installationId}?${q}`,
            })
            .then(result => result.data as DeviceX[]);
    }

    query(options: DataQueryRequest<MyQuery>): Observable<DataQueryResponse> {
        const templateSrv = getTemplateSrv();
        const targets = options.targets.map(value => {
            return {
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

    joinMeta(deviceMeta: DeviceX, functionMeta: FunctionX): Meta {
        const res: Meta = {};
        Object.keys(functionMeta.meta).forEach(key => {
            res[key] = functionMeta.meta[key];
        });
        if(deviceMeta !== undefined && deviceMeta !== null) {
            Object.keys(deviceMeta.meta).forEach(key => {
                res[`@device.${key}`] = deviceMeta.meta[key];
            });
        }
        return res;
    }

    findMetaQuery(query: MyVariableQuery, options?: any): Promise<MetricFindValue[]> {
        if (query.metaKey === '' || query.installationId === '0' || query.installationId === '') {
            return Promise.resolve([]);
        }
        let id = toNumber(query.installationId);
        if (typeof query.installationId === 'string' && query.installationId.includes('$')) {
            const tmp = getTemplateSrv().replace(query.installationId);
            id = toNumber(tmp);
        }
        if (isNaN(id)) {
            return Promise.reject(`Invalid installation id: ${query.installationId} => ${id}`);
        }
        const filter = query.meta ? query.meta.reduce<{ [key: string]: string }>((acc, meta) => {
            if (meta.key !== '' && meta.value !== '') {
                acc[meta.key] = meta.value;
            }
            return acc;
        }, {}) : {};
        if(query.addDeviceMeta) {
            return this.fetchDevices(id).then(devices => {
                console.log(devices);
                const deviceMap: {[key: string]: DeviceX} = devices.reduce<{ [key: string]: DeviceX }>((acc, device) => {
                    acc[`${device.id}`] = device;
                    return acc;
                }, {});
                return this.fetchFunctions(id, filter).then(functions => {
                    return functions.reduce<MetricFindValue[]>((acc, func) => {
                        const dev = deviceMap[func.meta['device_id']];
                        const meta = this.joinMeta(dev,func);
                        if (!acc.find(f => f.text === meta[query.metaKey]) && meta[query.metaKey]) {
                            if(query.metaNameKey !== "" && meta[query.metaNameKey]) {
                                const name = query.metaNameKey === 'type' ? func.type : meta[query.metaNameKey];
                                return [...acc, {text: name, value: meta[query.metaKey]}];
                            } else {
                                return [...acc, {text: meta[`${query.metaKey}`], value: meta[query.metaKey]}];
                            }
                        }
                        return acc;
                    }, []);
                }).then(result => {
                    return result;
                })
            }).then(result => {
                return result;
            });
        }
        return this.fetchFunctions(id, filter).then(functions => {
            return functions.reduce<MetricFindValue[]>((acc, func) => {
                if (!acc.find(f => f.text === func.meta[query.metaKey]) && func.meta[query.metaKey]) {
                    if(query.metaNameKey !== "" && func.meta[query.metaNameKey]) {
                        const name = query.metaNameKey === 'type' ? func.type : func.meta[query.metaNameKey];
                        return [...acc, {text: name, value: func.meta[query.metaKey]}];
                    } else {
                        return [...acc, {text: func.meta[query.metaKey], value: func.meta[query.metaKey]}];
                    }
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
