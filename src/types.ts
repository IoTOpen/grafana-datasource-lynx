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
}

export interface MyQuery extends DataQuery {
    installationId: number;
    clientId: number;
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
}


export const defaultQuery: Partial<MyQuery> = {
    installationId: 0,
    clientId: 0,
    type: '',
    meta: [{key: 'type', value: ''}],
};

export interface FunctionX {
    id: number;
    type: string;
    meta: { [index: string]: string };
}

export interface DeviceX {
    id: number;
    type: string;
    meta: { [index: string]: string };
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
