import defaults from 'lodash/defaults';

import React, { PureComponent, ChangeEvent } from 'react';
import { Button, FormLabel, QueryEditorProps } from '@grafana/ui';
import { DataSource } from './DataSource';
import { MyQuery, MyDataSourceOptions, defaultQuery } from './types';
import { FilterEntry } from "./components/FilterEntry";

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

interface State {
  installations: any[];
  functions: any[];
}


export class QueryEditor extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      installations: [],
      functions: [],
    };
  }

  componentDidMount(): void {
    this.props.datasource.fetchInstallations().then(installations => {
      this.setState({installations: installations});
      console.log(installations);
    });
  }

  onSelectInstallation = (event: ChangeEvent<HTMLSelectElement>) => {
    const {onChange, query} = this.props;
    onChange({...query, installationId: Number(event.target.value)});
    this.props.datasource.fetchFunctions(Number(event.target.value)).then(functions => {
      this.setState({functions: functions});
    });
  };

  addFilter = () => {
    const {onChange, query} = this.props;
    query.meta.push({key: "a", value: "b"});
    onChange({...query, meta: query.meta});
  };

  onMetaDelete = (idx) => {
    const {onChange, query} = this.props;
    query.meta = query.meta.filter((value, fidx) => {
      return idx != fidx;
    });
    onChange({...query, meta: query.meta});
    this.setState({});
  };

  onMetaUpdate = (idx: number, key: string, value:string) => {
    const {onChange, query} = this.props;
    query.meta[idx].key = key;
    query.meta[idx].value = value;
    onChange({...query, meta: query.meta});
    this.setState({});
  };

  render() {
    const query = defaults(this.props.query, defaultQuery) as MyQuery;
    console.log("Current query:", query);
    console.log("Hello render world");
    return (
      <div>
        <div className={"gf-form-inline"}>
          <FormLabel className={"query-keyword"}>Installation</FormLabel>
          <select onChange={this.onSelectInstallation} style={{width: 330}}>
            {this.state.installations.map(value => {
              let selected = query.installationId == value.id;
              return <option value={value.id} selected={selected}>{value.name}</option>;
            })}
          </select>
        </div>
        {query.meta.map((value, idx) => {
          return <FilterEntry idx={idx} data={value} onDelete={this.onMetaDelete} onUpdate={this.onMetaUpdate}/>
        })}
        <Button onClick={this.addFilter}>Add filter</Button>
      </div>
    );
  }
}
