import {DataSource} from './DataSource';
import {ConfigEditor} from './ConfigEditor';
import {QueryEditor} from './QueryEditor';
import {DataSourceOptions, Query} from './types';
import {DataSourcePlugin} from '@grafana/data';
import {VariableEditor} from "./VariableEditor";

export const plugin = new DataSourcePlugin<DataSource, Query, DataSourceOptions>(DataSource)
    .setConfigEditor(ConfigEditor)
    .setQueryEditor(QueryEditor)
    .setVariableQueryEditor(VariableEditor);
