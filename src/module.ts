import {DataSource} from './DataSource';
import {ConfigEditor} from './ConfigEditor';
import {QueryEditor} from './QueryEditor';
import {MyQuery, MyDataSourceOptions} from './types';
import {DataSourcePlugin} from '@grafana/data';

export const plugin = new DataSourcePlugin<DataSource, MyQuery, MyDataSourceOptions>(DataSource)
    .setConfigEditor(ConfigEditor)
    .setQueryEditor(QueryEditor);
