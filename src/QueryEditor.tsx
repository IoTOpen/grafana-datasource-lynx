import defaults from 'lodash/defaults';

import React, { PureComponent, ChangeEvent } from 'react';
import { Button, FormLabel, Input, QueryEditorProps } from '@grafana/ui';
import { DataSource } from './DataSource';
import { MyQuery, MyDataSourceOptions, defaultQuery } from './types';

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
    this.props.datasource.fetchInstalaltions().then(installations => {
      this.setState({ installations: installations });
      console.log(installations);
    });
  }

  //  onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
  //    const { onChange, query } = this.props;
  //    onChange({ ...query, queryText: event.target.value });
  //  };
  //
  //  onConstantChange = (event: ChangeEvent<HTMLInputElement>) => {
  //    const { onChange, query, onRunQuery } = this.props;
  //    onChange({ ...query, constant: parseFloat(event.target.value) });
  //    onRunQuery(); // executes the query
  //  };

  onSelectInstallation = (event: ChangeEvent<HTMLSelectElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, installationId: Number(event.target.value) });
    this.props.datasource.fetchFunctions(Number(event.target.value)).then(functions => {
      this.setState({ functions: functions });
    });
  };

  createFilterEntry(e: any) {
    return (
      <div>
        <Input  placeholder={"key"} className={"width-10"} type={"text"} value={e.key} />
        <Input  placeholder={"value"} className={"width-10"} type={"text"} value={e.value} />
      </div>
    );
//    return <Button title={e.key}>{e.key}</Button>;
//    return <FormField type={"text"} label={"key"}>hello</FormField>
  }

  render() {
    const query = defaults(this.props.query, defaultQuery) as MyQuery;
    console.log("Current query:", query);
    return (
      <div className={'gf-form'}>
        <div>
          <FormLabel>Installation</FormLabel>
          <select onChange={this.onSelectInstallation}>
            {this.state.installations.map(value => {
              let selected = query.installationId == value.id;
              return <option value={value.id} selected={selected}>{value.name}</option>;
            })}
          </select>
        </div>
        <div>
          <FormLabel>Filters</FormLabel>
          {query.meta.map(value => {
            return this.createFilterEntry(value);
          })}
          <Button>+</Button>
        </div>
      </div>
    );
  }
}




//return (
//  <div className="gf-form">
//    <FormLabel>Installation</FormLabel>
//    <select onChange={this.onSelectInstallation}>
//      {this.state.installations.map((value) => {
//        return <option value={value.id}>{value.name}</option>
//      })}
//    </select>
//
//    <FormLabel>Functions</FormLabel>
//    <select multiple={true}>
//      {this.state.functions.map((value) => {
//        return <option value={value.id}>{value.meta.name}</option>
//      })}
//    </select>
//  </div>
//);

//        <FormField width={4} value={constant} onChange={this.onConstantChange} label="Constant" type="number" step="0.1"></FormField>
//        <FormField labelWidth={8} value={queryText || ''} onChange={this.onQueryTextChange} label="Query Text" tooltip="Not used yet"></FormField>
