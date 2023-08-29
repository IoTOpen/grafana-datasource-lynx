import React, {FormEventHandler} from "react";
import {InlineField, InlineFieldRow, InlineSwitch} from "@grafana/ui";

export interface LabeledSwitchProps {
    label: string;
    name: string;
    value: boolean;
    onChange: FormEventHandler<HTMLInputElement>;
}

export const LabeledSwitch = ({label, value, name, onChange}: LabeledSwitchProps) => {
    return (
        <InlineFieldRow>
            <InlineField label={label}>
                <InlineSwitch value={value} name={name} onChange={onChange}/>
            </InlineField>
        </InlineFieldRow>
    )
}
