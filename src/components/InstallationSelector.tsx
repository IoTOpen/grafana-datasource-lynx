import {Installation} from "../types";
import {Select} from "@grafana/ui";
import React, {useCallback, useMemo} from "react";
import {SelectableValue} from "@grafana/data";
import {SelectValue} from "@grafana/ui/components/Select/types";


export interface InstallationSelectorProps {
    isLoading: boolean;
    installations: Installation[];
    installation: Installation;
    onSelection(installation: Installation): void;

}

export const InstallationSelector = ({isLoading, installations, installation, onSelection}: InstallationSelectorProps) => {
    const installationOptions = useMemo<Array<SelectValue<Installation>>>(() => {
       return installations.map((installation) => {
              return {label: installation.name, value: installation};
       });
    }, [installations]);

    const currentSelectedInstallation = useMemo<SelectValue<Installation>>(() => {
        return {label: installation.name ,value: installation};
    },[installation]);

    const onChange = (event: SelectableValue<Installation>) => {
        onSelection(event.value ?? installations[0]);
    }

    const filter = useCallback((option: SelectableValue<Installation>, rawInput: string) => {
        const input = rawInput.toLowerCase();
        return option.value?.name?.toLowerCase().includes(input) ?? false;
    },[]);

    return (
        <div className={'gf-form-inline'}>
            <Select
                isLoading={isLoading}
                placeholder={"Installation"}
                noOptionsMessage={"No available installations"}
                filterOption={filter}
                width={65}
                options={installationOptions}
                menuPlacement={'bottom'}
                onChange={onChange}
                value={currentSelectedInstallation}
            />
        </div>
    )
};
