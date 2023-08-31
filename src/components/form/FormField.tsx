import React, {FormEventHandler, ReactElement} from 'react';
import {InlineField, Input} from "@grafana/ui";

export interface FormFieldProps {
    label: string;
    placeholder: string;
    value: string;
    name: string;
    onChange: FormEventHandler<HTMLInputElement>;
    tooltip?: ReactElement;
    labelWidth?: number | "auto";
    width?: number;
    type?: string;
}

export const FormField = ({type, tooltip, label, placeholder, name, value, onChange, labelWidth = 'auto', width}: FormFieldProps) => {
    return(
        <InlineField label={label} labelWidth={labelWidth} tooltip={tooltip} grow={true}>
            <Input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange}  width={width}/>
        </InlineField>
    )
}
