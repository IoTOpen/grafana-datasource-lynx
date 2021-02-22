import React, { PureComponent, ChangeEvent } from 'react';
import { DataSource } from './DataSource';
import { MyQuery, MyDataSourceOptions, Installation, FunctionX } from './types';
import { FilterEntry } from './components/FilterEntry';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { LegacyForms, Button, Select } from '@grafana/ui';

const { FormField, Switch } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

interface State {
  installations: Installation[];
  functions: FunctionX[];
  ticker: any;
  selectedInstallation: SelectableValue<Installation>;
  loadingInstallations: boolean;
}

export class QueryEditor extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      installations: [],
      functions: [],
      selectedInstallation: { value: { id: 0, name: '', client_id: 0 } },
      ticker: null,
      loadingInstallations: true,
    };
  }

  componentDidMount(): void {
    this.props.datasource.fetchInstallations().then(installations => {
      let selectedInstallation = { id: 0, client_id: 0, name: '' };
      if (installations.length > 0) {
        selectedInstallation = installations[0];
      }
      if (this.props.query.installationId !== 0) {
        const tmp = installations.find(i => i.id === this.props.query.installationId);
        if (tmp !== undefined) {
          selectedInstallation = tmp;
        }
      }
      this.onSelectInstallation({ value: selectedInstallation });
      this.setState({
        installations: installations,
        loadingInstallations: false,
        selectedInstallation: { value: selectedInstallation },
      });
    });
  }

  onSelectInstallation = (selected: SelectableValue<Installation>) => {
    const { onChange, query } = this.props;
    if (selected.value == null) {
      return;
    }
    this.setState({ selectedInstallation: selected });
    onChange({ ...query, installationId: selected.value.id, clientId: selected.value.client_id });
    this.props.datasource.fetchFunctions(Number(selected.value.id)).then(functions => {
      if (selected.value !== undefined) {
        if (this.state.selectedInstallation.value === selected.value) {
          this.setState({ functions: functions, selectedInstallation: selected });
          this.props.onRunQuery();
        }
      }
    });
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

  onMetaAsFields = (): void => {
    const { onChange, query } = this.props;
    onChange({ ...query, metaAsFields: !query.metaAsFields });
    this.props.onRunQuery();
  };

  onDeviceMetaJoin = (): void => {
    const { onChange, query } = this.props;
    onChange({ ...query, joinDeviceMeta: !query.joinDeviceMeta });
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
      Using this field will join matching functions with the same filter, but the type changed to this field. The msg
      field will be overwritten by messages matching this type, linked through <code>device_id</code> meta key. Useful
      for eg. joining positional data. <br />
      This field is only applied on table data.
    </>
  );

  getInstallationOptionLabel(input: SelectableValue<Installation>): string {
    if (input.value == null) {
      return '';
    }
    return input.value.name;
  }

  getMetaKeys(): string[] {
    const res: string[] = ['id', 'type'];

    for (const func of this.state.functions) {
      for (const metaKey in func.meta) {
        if (res.indexOf(metaKey) === -1) {
          res.push(metaKey);
        }
      }
    }

    return res;
  }

  getMetaValues(key: string): string[] {
    const res: string[] = [];

    for (const func of this.state.functions) {
      let value = func.meta[key];
      if (key === 'type') {
        value = func.type;
      }
      if (key === 'id') {
        value = func.id.toString();
      }
      if (value && res.indexOf(value) === -1) {
        res.push(value);
      }
    }

    return res;
  }

  render() {
    const query = this.props.query as MyQuery;
    if (query.meta == null) {
      query.installationId = 0;
      query.clientId = 0;
      query.meta = [{ key: 'type', value: '' }];
    }

    return (
      <div className={'section gf-form-group'}>
        <div className={'gf-form-inline'}>
          <Select
            isLoading={this.state.loadingInstallations}
            width={65}
            getOptionLabel={this.getInstallationOptionLabel}
            options={this.state.installations.map(installation => {
              return { value: installation };
            })}
            menuPlacement={'bottom'}
            onChange={this.onSelectInstallation}
            value={this.state.selectedInstallation}
          />
        </div>
        <div className={'gf-form-inline,ui-list'}>
          {query.meta.map((value, idx) => {
            return (
              <FilterEntry
                idx={idx}
                data={value}
                onDelete={this.onMetaDelete}
                onUpdate={this.onMetaUpdate}
                keys={this.getMetaKeys()}
                values={this.getMetaValues(value.key)}
              />
            );
          })}
        </div>
        <div className={'gf-form-inline'} style={{ paddingBottom: 10 }}>
          <Button onClick={this.addFilter}>Add filter</Button>
        </div>
        <div className={'gf-form-inline'}>
          <FormField
            labelWidth={40}
            label={'Group by'}
            onChange={this.onGroupByChange}
            value={query.groupBy}
            tooltip={this.tooltipGroupBy}
          />
          <FormField
            labelWidth={40}
            label={'Name by'}
            onChange={this.onNameByChange}
            value={query.nameBy}
            tooltip={this.tooltipNameBy}
          />
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
            <div>
              <Switch label={'Meta to fields'} checked={query.metaAsFields} onChange={this.onMetaAsFields} />
              <div hidden={!query.metaAsFields}>
                <Switch label={'Add device meta'} checked={query.joinDeviceMeta} onChange={this.onDeviceMetaJoin} />
              </div>
            </div>
          </div>
        </div>
        <Switch label={'Current state only'} checked={query.stateOnly} onChange={this.onStateOnlyChange} />
      </div>
    );
  }
}
