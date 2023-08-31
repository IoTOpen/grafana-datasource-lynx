import React, {FormEventHandler} from "react";
import {InlineField, InlineFieldRow, InlineSwitch} from "@grafana/ui";

export interface LabeledSwitchProps {
    label: string;
    name: string;
    value: boolean;
    labelWidth?: number | "auto";
    onChange: FormEventHandler<HTMLInputElement>;
}

export const LabeledSwitch = ({label, value, name, onChange, labelWidth = 'auto'}: LabeledSwitchProps) => {
    return (
        <InlineFieldRow>
            <InlineField label={label} labelWidth={labelWidth} >
                <InlineSwitch value={value} name={name} onChange={onChange}/>
            </InlineField>
        </InlineFieldRow>
    )
}
