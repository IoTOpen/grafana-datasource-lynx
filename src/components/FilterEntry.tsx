import React, { PureComponent } from 'react';
import { Button, Select } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';

type onDeleteFunction = (idx: number) => void;
type onUpdateFunction = (idx: number, key: string, value: string) => void;

interface FilterEntryProps {
  data: any;
  idx: number;
  onDelete: onDeleteFunction;
  onUpdate: onUpdateFunction;
  keys?: string[];
  values?: string[];
}

export class FilterEntry extends PureComponent<FilterEntryProps> {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps: Readonly<FilterEntryProps>, nextState: Readonly<{}>, nextContext: any): boolean {
    return true;
  }

  onChangeKey = event => {
    if (typeof event === typeof '') {
      this.props.onUpdate(this.props.idx, event, this.props.data.value);
    } else {
      this.props.onUpdate(this.props.idx, event.label, this.props.data.value);
    }
  };

  onChangeValue = event => {
    console.log(event);
    if (typeof event === typeof '') {
      this.props.onUpdate(this.props.idx, this.props.data.key, event);
    } else {
      this.props.onUpdate(this.props.idx, this.props.data.key, event.value);
    }
  };

  onDelete = event => {
    this.props.onDelete(this.props.idx);
  };

  render() {
    const keys: SelectableValue[] = [];
    const values: SelectableValue[] = [];
    if (this.props.keys) {
      for (const x of this.props.keys) {
        keys.push({ label: x, value: x });
      }
    }

    if (this.props.values) {
      for (const x of this.props.values) {
        values.push({ label: x, value: x });
      }
    }

    return (
      <div className={'gf-form-inline'}>
        <div className={'gf-form'}>
          <span className={'gf-form-label query-keyword'}>key</span>
          <Select
            width={30}
            options={keys}
            onChange={this.onChangeKey}
            onCreateOption={this.onChangeKey}
            value={{ label: this.props.data.key, value: this.props.data.key }}
            isSearchable={true}
            allowCustomValue={true}
            menuPlacement={'bottom'}
            placeholder={'meta key'}
          />
          <span className={'gf-form-label query-keyword'}>match</span>
          <Select
            width={30}
            options={values}
            onChange={this.onChangeValue}
            onCreateOption={this.onChangeValue}
            value={{ label: this.props.data.value, value: this.props.data.value }}
            isSearchable={true}
            allowCustomValue={true}
            menuPlacement={'bottom'}
            placeholder={'wildcard match'}
          />
          <Button variant={'destructive'} onClick={this.onDelete}>
            X
          </Button>
        </div>
      </div>
    );
  }
}

//<Select width={30} options={keys} onChange={this.onChangeKey}  value={{label: this.props.data.key}} onCreateOption={this.onChangeKey} isSearchable={true} allowCustomValue={true} />
//<span className={'gf-form-label query-keyword'}>match</span>
//<Select width={30} options={values} onChange={this.onChangeValue} value={{label: this.props.data.value}} onCreateOption={this.onChangeValue} isSearchable={true} allowCustomValue={true} />

//<Input type={'text'} style={{ width: 150 }} value={this.props.data.key} onChange={this.onChangeKey} />
//<span className={'gf-form-label query-keyword'}>match</span>
//<Input type={'text'} style={{ width: 150 }} value={this.props.data.value} onChange={this.onChangeValue} />
