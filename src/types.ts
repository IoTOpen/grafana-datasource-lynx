import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  installationId: number;
  clientId: number;
  type: string;
  meta: any[];
}

export const defaultQuery: Partial<MyQuery> = {
  installationId: 0,
  type: '',
  meta: [{ key: 'type', value: '' }],
};

export interface LogEntry {
  client_id: number;
  installation_id: number;
  timestamp: number;
  topic: string;
  value: number;
}

export interface LogResult {
  count: number;
  data: LogEntry[];
  last: number;
  total: number;
}

export interface FunctionX {
  id: number;
  type: string;
  meta: Map<string, string>;
}

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  url?: string;
  apiKey?: string;
}
