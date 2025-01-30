import {DataQuery, DataSourceJsonData} from '@grafana/data';


export interface MetaEntry {
    key: string;
    value: string;
}

export interface MyVariableQuery {
    queryMode: string;
    installationId: string | number;
    meta: MetaEntry[];
    metaKey: string;
    metaNameKey: string;
    addDeviceMeta: boolean;
}

export interface MyQuery extends DataQuery {
    installationId: number;
    installationVariable?: string;
    type: string;
    meta: MetaEntry[];
    tabledata: boolean;
    stateOnly: boolean;
    metaAsFields: boolean;
    joinDeviceMeta: boolean;
    linkKey: string;
    messageFrom: string;
    groupBy: string;
    nameBy: string;
    metaAsLabels: boolean;
}


export const defaultQuery: Partial<MyQuery> = {
    installationId: 0,
    type: '',
    meta: [{key: 'type', value: ''}],
};


export type Meta = { [index: string]: string };

export interface FunctionX {
    id: number;
    type: string;
    meta: Meta;
}

export interface DeviceX {
    id: number;
    type: string;
    meta: Meta;
}

export interface Installation {
    id: number;
    client_id: number;
    name: string;
}

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
    url?: string;
    apiKey?: string;
    oauthPassThru?: boolean;
    auth?: string;
}

export interface MySecureJsonData {
    apiKey?: string;
}
