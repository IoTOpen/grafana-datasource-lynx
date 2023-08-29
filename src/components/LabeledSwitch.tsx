import React, {FormEventHandler} from "react";
import {InlineField, InlineFieldRow, InlineSwitch} from "@grafana/ui";

export interface LabeledSwitchProps {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

export const LabeledSwitch = ({label, value, onChange}: LabeledSwitchProps) => {
    const onSwitchChange: FormEventHandler<HTMLInputElement> = (event) => {
        onChange(event.currentTarget.checked);
    }
    return (
        <InlineFieldRow>
            <InlineField label={label}>
                <InlineSwitch value={value} onChange={onSwitchChange}/>
            </InlineField>
        </InlineFieldRow>
    )
}
