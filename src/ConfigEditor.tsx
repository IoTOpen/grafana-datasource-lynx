import React, { PureComponent, ChangeEvent } from 'react';
import { MyDataSourceOptions } from './types';
import { FormField } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';

interface MyProps extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> {}
interface State {}

export class ConfigEditor extends PureComponent<MyProps, State> {
  componentDidMount() {}

  onAPIKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      apiKey: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  onURLChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      url: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  render() {
    const { options } = this.props;
    const { jsonData } = options;

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <FormField
            label="URL"
            inputWidth={24}
            labelWidth={6}
            onChange={this.onURLChange}
            value={jsonData.url || ''}
            placeholder="https://aam.iotopen.se"
          />
        </div>
        <div className="gf-form">
          <FormField
            label="API Key"
            inputWidth={24}
            labelWidth={6}
            onChange={this.onAPIKeyChange}
            value={jsonData.apiKey || ''}
            placeholder="Your API key"
          />
        </div>
      </div>
    );
  }
}
