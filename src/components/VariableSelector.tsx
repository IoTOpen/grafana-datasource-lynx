import {getTemplateSrv} from "@grafana/runtime";
import {Select} from "@grafana/ui";
import React from "react";


type VariableSelectorProps = {
    value: string;
    onSelection: (selection: string) => void;
}

export const VariableSelector = ({value, onSelection}: VariableSelectorProps) => {
    const templateSrv = getTemplateSrv();
    const variables = templateSrv.getVariables();
    const options = variables.map((variable) => {
        return {label: variable.name, value: `$\{${variable.name}}`};
    });
    return (
        <div className={'gf-form-inline'}>
            <Select
                placeholder={"Variable"}
                noOptionsMessage={"No available variables"}
                width={65}
                options={options}
                menuPlacement={'bottom'}
                onChange={(event) => onSelection(event.value ?? '')}
                value={value}
            />
        </div>
    )
}
