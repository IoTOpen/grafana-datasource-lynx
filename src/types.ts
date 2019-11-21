import { DataQuery, DataSourceJsonData } from '@grafana/ui';

export interface MyQuery extends DataQuery {
  installationId: number;
  type: string;
  meta: Array<any>;
}

export const defaultQuery: Partial<MyQuery> = {
  installationId: 0,
  type: '',
  meta: [{key: 'x', value:'y'}],
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  url?: string;
  apiKey?: string;
}
