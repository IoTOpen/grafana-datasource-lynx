import React, { FormEvent } from 'react';
import { HorizontalGroup, Select } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { FormField } from './form/FormField';
import { MyQuery } from '../types';

interface AggregationSettingsProps {
    query: MyQuery;
    onChange: (query: MyQuery) => void;
    onRunQuery: () => void;
}

const aggregationMethods: Array<SelectableValue<string>> = [
    { label: 'Average', value: 'avg' },
    { label: 'Count', value: 'count' },
    { label: 'First', value: 'first' },
    { label: 'Last', value: 'last' },
    { label: 'Max', value: 'max' },
    { label: 'Median', value: 'median' },
    { label: 'Min', value: 'min' },
    { label: 'Percentile 50', value: 'percentile(50)' },
    { label: 'Percentile 90', value: 'percentile(90)' },
    { label: 'Percentile 95', value: 'percentile(95)' },
    { label: 'Percentile 99', value: 'percentile(99)' },
    { label: 'Spread', value: 'spread' },
    { label: 'Standard Deviation', value: 'stddev' },
    { label: 'Sum', value: 'sum' },
];

const tooltipAggrInterval = (
    <>
        <p>
            Time interval for data aggregation. Format: 1m, 10m, 2h, 24h
            <br />
            If a method is chosen but no interval is specified, the default interval will be 1m.
        </p>
    </>
);

export const AggregationSettings: React.FC<AggregationSettingsProps> = ({ query, onChange, onRunQuery }) => {
    const onAggrMethodChange = (value: SelectableValue<string> | null) => {
        onChange({
            ...query,
            aggrMethod: value?.value || '',
            aggrInterval: value?.value ? query.aggrInterval : ''
        });
        onRunQuery();
    };

    const onAggrIntervalChange = (event: FormEvent<HTMLInputElement>) => {
        onChange({ ...query, aggrInterval: event.currentTarget.value });
        onRunQuery();
    };

    return (
        <>
            <div style={{ marginBottom: '16px' }}>
                <HorizontalGroup align={"flex-start"} spacing={"xs"}>
                    <label className="gf-form-label label">Aggregation method</label>
                    <div>
                        <Select
                            width={22}
                            options={aggregationMethods}
                            value={query.aggrMethod ? aggregationMethods.find(x => x.value === query.aggrMethod) : undefined}
                            onChange={onAggrMethodChange}
                            isClearable={true}
                        />
                    </div>
                    <div>
                        <FormField
                            name={'aggrInterval'}
                            label={'Interval'}
                            tooltip={tooltipAggrInterval}
                            width={13}
                            value={query.aggrInterval ?? ''}
                            onChange={onAggrIntervalChange}
                            placeholder={'None'}
                        />
                    </div>
                </HorizontalGroup>
            </div>
        </>
    );
};