import React, { PureComponent, ChangeEvent } from 'react';
import { DataSource } from './DataSource';
import { MyQuery, MyDataSourceOptions } from './types';
import { FilterEntry } from './components/FilterEntry';
import { QueryEditorProps } from '@grafana/data';
import { Button, FormField, FormLabel, Switch } from '@grafana/ui';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

interface State {
  installations: any[];
  functions: any[];
  ticker: any;
}

export class QueryEditor extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      installations: [],
      functions: [],
      ticker: null,
    };
  }

  getClientIdByInstallation(installationId: number): number {
    for (const installation of this.state.installations) {
      if (installation.id === installationId) {
        return installation.client_id;
      }
    }
    return 0;
  }

  componentDidMount(): void {
    this.props.datasource.fetchInstallations().then(installations => {
      this.setState({ installations: installations });
    });
  }

  onSelectInstallation = (event: ChangeEvent<HTMLSelectElement>) => {
    const { onChange, query } = this.props;
    const target = Number(event.target.value);
    onChange({ ...query, installationId: target, clientId: this.getClientIdByInstallation(target) });
    this.props.datasource.fetchFunctions(Number(event.target.value)).then(functions => {
      this.setState({ functions: functions });
    });
    this.props.onRunQuery();
  };

  addFilter = () => {
    const { onChange, query } = this.props;
    query.meta.push({ key: '', value: '' });
    onChange({ ...query, meta: query.meta });
  };

  onMetaDelete = idx => {
    const { onChange, query } = this.props;
    query.meta = query.meta.filter((value, fidx) => {
      return !(idx === fidx);
    });
    onChange({ ...query, meta: query.meta });
    this.props.onRunQuery();
  };

  onMetaUpdate = (idx: number, key: string, value: string) => {
    const { onChange, query } = this.props;
    query.meta[idx].key = key;
    query.meta[idx].value = value;
    onChange({ ...query, meta: query.meta });
    this.onRunQuery();
  };

  onRunQuery() {
    if (this.state.ticker) {
      clearTimeout(this.state.ticker);
      const tmp = setTimeout(() => {
        this.props.onRunQuery();
      }, 250);
      this.setState({ ticker: tmp });
    } else {
      const tmp = setTimeout(() => {
        this.props.onRunQuery();
      }, 250);
      this.setState({ ticker: tmp });
    }
  }

  onMessageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { onChange, query } = this.props;
    onChange({ ...query, messageFrom: event.target.value });
    this.onRunQuery();
  };

  onGroupByChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { onChange, query } = this.props;
    onChange({ ...query, groupBy: event.target.value });
    this.onRunQuery();
  };

  onNameByChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { onChange, query } = this.props;
    onChange({ ...query, nameBy: event.target.value });
    this.onRunQuery();
  };

  onLinkChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { onChange, query } = this.props;
    onChange({ ...query, linkKey: event.target.value });
    this.onRunQuery();
  };

  onStateOnlyChange = (): void => {
    const { onChange, query } = this.props;
    onChange({ ...query, stateOnly: !query.stateOnly });
    this.props.onRunQuery();
  };

  onDatatable = (): void => {
    const { onChange, query } = this.props;
    onChange({ ...query, tabledata: !query.tabledata });
    this.props.onRunQuery();
  };

  tooltipGroupBy = (
    <>
      Group series by some meta key or payload <code>msg</code> field. Defaults to Function ID.
    </>
  );
  tooltipNameBy = (
    <>
      This will name series based on some meta key.
      <br />
      Defaults to <code>name</code>.
    </>
  );
  tooltipMessageFrom = (
    <>
      Using this field will join matching functions with the same filter, but the type changed to this field. The msg field will be overwritten by
      messages matching this type, linked through <code>device_id</code> meta key. Useful for eg. joining positional data. <br />
      This field is only applied on table data.
    </>
  );

  render() {
    const query = this.props.query as MyQuery;
    if (query.meta == null) {
      query.meta = [{ key: 'type', value: '' }];
    }

    return (
      <div className={'section gf-form-group'}>
        <div className={'gf-form-inline'}>
          <FormLabel className={'query-keyword'}>Installation</FormLabel>
          <select onChange={this.onSelectInstallation} style={{ width: 330 }}>
            <option value={0}>Select installation</option>
            {this.state.installations.map(value => {
              const selected = query.installationId === value.id;
              return (
                <option value={value.id} selected={selected}>
                  {value.name}
                </option>
              );
            })}
          </select>
        </div>
        {query.meta.map((value, idx) => {
          return <FilterEntry idx={idx} data={value} onDelete={this.onMetaDelete} onUpdate={this.onMetaUpdate} />;
        })}
        <div className={'gf-form-inline'} style={{ paddingBottom: 10 }}>
          <Button onClick={this.addFilter}>Add filter</Button>
        </div>
        <div className={'gf-form-inline'}>
          <FormField labelWidth={40} label={'Group by'} onChange={this.onGroupByChange} value={query.groupBy} tooltip={this.tooltipGroupBy} />
          <FormField labelWidth={40} label={'Name by'} onChange={this.onNameByChange} value={query.nameBy} tooltip={this.tooltipNameBy} />
        </div>
        <div className={'gf-form-inline'}>
          <Switch label={'As table data'} checked={query.tabledata} onChange={this.onDatatable} />
          <div hidden={!query.tabledata}>
            <FormField
              labelWidth={40}
              label={'Message from'}
              onChange={this.onMessageChange}
              value={query.messageFrom}
              tooltip={this.tooltipMessageFrom}
            />
            <FormField labelWidth={40} label={'Linked with'} onChange={this.onLinkChange} value={query.linkKey} />
          </div>
        </div>
        <Switch label={'Current state only'} checked={query.stateOnly} onChange={this.onStateOnlyChange} />
      </div>
    );
  }
}
