import React, {ChangeEvent, useEffect} from "react";
import {MetaEntry, MyVariableQuery} from "./types";
import {HorizontalGroup, VerticalGroup} from "@grafana/ui";
import {FormField} from "./components/form/FormField";
import {MetaEditor} from "./components/MetaEditor";

export interface MyVariableEditorProps {
    query: MyVariableQuery;
    onChange: (query: MyVariableQuery) => void;
}

export const VariableEditor = ({query, onChange}: MyVariableEditorProps) => {
    const onChangeNumber = (event: ChangeEvent<HTMLInputElement>) => {
        const x = parseInt(event.target.value,10);
        if (isNaN(x)) {
            onChange({...query, [event.target.name]: 0});
        } else {
            onChange({...query, [event.target.name]: x});
        }
    }

    useEffect(() => {
        let q = query;
        if (q.installationId === undefined) {
            q = {...q, installationId: 0, meta: [], metaKey: ''};
            onChange(q);
        }
    }, []); // eslint-disable-line

    const updateMeta = (meta: MetaEntry[]) => {
        onChange({...query, meta: meta});
    }


    const onChangeText = (event: ChangeEvent<HTMLInputElement>) => {
        onChange({...query, [event.target.name]: event.target.value});
    }

    return (
        <VerticalGroup spacing={"none"}>
            <HorizontalGroup>
                <FormField label={"Installation ID"} placeholder={"ID"} value={query.installationId?.toString() ?? 0}
                           name={"installationId"}
                           onChange={onChangeNumber} labelWidth={15}/>
            </HorizontalGroup>
            <HorizontalGroup>
                <FormField label={"Meta key"} placeholder={"name"} labelWidth={15} value={query.metaKey ?? ''} name={"metaKey"}
                           onChange={onChangeText}/>
            </HorizontalGroup>
            <MetaEditor entries={query.meta ?? []} onUpdate={updateMeta}/>
        </VerticalGroup>
    )
}
