import React, { PureComponent } from 'react';
import { Button, Input } from '@grafana/ui';

type onDeleteFunction = (idx: number) => void;
type onUpdateFunction = (idx: number, key: string, value: string) => void;

interface FilterEntryProps {
  data: any;
  idx: number;
  onDelete: onDeleteFunction;
  onUpdate: onUpdateFunction;
}

export class FilterEntry extends PureComponent<FilterEntryProps> {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps: Readonly<FilterEntryProps>, nextState: Readonly<{}>, nextContext: any): boolean {
    return true;
  }

  onChangeKey = event => {
    this.props.onUpdate(this.props.idx, event.currentTarget.value, this.props.data.value);
  };

  onChangeValue = event => {
    this.props.onUpdate(this.props.idx, this.props.data.key, event.currentTarget.value);
  };

  onDelete = event => {
    this.props.onDelete(this.props.idx);
  };

  render() {
    return (
      <div className={'gf-form-inline'}>
        <div className={'gf-form'}>
          <span className={'gf-form-label query-keyword'}>key</span>
          <Input type={'text'} style={{ width: 150 }} value={this.props.data.key} onChange={this.onChangeKey} />
          <span className={'gf-form-label query-keyword'}>match</span>
          <Input type={'text'} style={{ width: 150 }} value={this.props.data.value} onChange={this.onChangeValue} />
          <Button variant={'danger'} onClick={this.onDelete}>X</Button>
        </div>
      </div>
    );
  }
}
