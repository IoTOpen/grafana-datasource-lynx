import React, {FormEventHandler, ReactElement} from 'react';
import {InlineLabel, Input} from "@grafana/ui";

export interface FormFieldProps {
    label: string;
    placeholder: string;
    value: string;
    name: string;
    onChange: FormEventHandler<HTMLInputElement>;
    tooltip?: ReactElement;
    labelWidth: number | "auto";
}

export const FormField = ({tooltip, label, placeholder, name, value, onChange, labelWidth = 'auto'}: FormFieldProps) => {
    return(
        <>
            <InlineLabel tooltip={tooltip} width={labelWidth}>
                {label}
            </InlineLabel>
            <Input name={name} placeholder={placeholder} value={value} onChange={onChange} />
        </>
    )
}
