import {DataQuery, DataSourceJsonData} from '@grafana/data';


export interface MetaEntry {
    key: string;
    value: string;
}

export interface VariableQuery {
    queryMode: string;
    installationId: string | number;
    meta: MetaEntry[];
    metaKey: string;
    metaNameKey: string;
    addDeviceMeta: boolean;
}

export interface Query extends DataQuery {
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
    aggrMethod?: string;
    aggrInterval?: string;
}


export const defaultQuery: Partial<Query> = {
    installationId: 0,
    type: '',
    meta: [{key: 'type', value: ''}],
};

/**
 * These are options configured for each DataSource instance
 */
export interface DataSourceOptions extends DataSourceJsonData {
    url?: string;
    apiKey?: string;
    oauthPassThru?: boolean;
    auth?: string;
    timeout?: string;
}

export interface SecureJsonData {
    apiKey?: string;
}
