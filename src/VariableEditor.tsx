import React, {ChangeEvent, useMemo} from "react";
import {MetaEntry, MyVariableQuery} from "./types";
import {
    HorizontalGroup,
    InlineField,
    InlineFieldRow,
    RadioButtonGroup,
    VerticalGroup
} from "@grafana/ui";
import {FormField} from "./components/form/FormField";
import {MetaEditor} from "./components/MetaEditor";

export interface MyVariableEditorProps {
    query: MyVariableQuery;
    onChange: (query: MyVariableQuery) => void;
}

export const VariableEditor = ({query, onChange}: MyVariableEditorProps) => {

    const q = useMemo(() => {
        if (query.queryMode === undefined || query.queryMode === '') {
            return {...query, queryMode: 'meta', installationId: '0', meta: [], metaKey: ''};
        }
        return query;
    }, [query]);

    const updateMeta = (meta: MetaEntry[]) => {
        onChange({...q, meta: meta});
    }

    const onChangeText = (event: ChangeEvent<HTMLInputElement>) => {
        onChange({...q, [event.target.name]: event.target.value});
    }

    const queryModeOptions = [
        {label: 'Meta values', value: 'meta'},
        {label: 'Installations', value: 'installation'},
    ];

    return (
        <VerticalGroup spacing={"xs"}>
            <HorizontalGroup spacing={"xs"}>
                <InlineFieldRow>
                    <InlineField label={"Query mode"} labelWidth={15}>
                        <RadioButtonGroup options={queryModeOptions} value={q.queryMode} onChange={(v) => {
                            onChange({...q, queryMode: v ?? 'meta'});
                        }}/>
                    </InlineField>
                </InlineFieldRow>
            </HorizontalGroup>
            {q.queryMode === 'meta' &&
                <VerticalGroup>
                    <HorizontalGroup>
                        <FormField label={"Installation ID"} placeholder={"ID"}
                                   value={q.installationId === undefined ? '0' : q.installationId.toString()}
                                   name={"installationId"}
                                   onChange={onChangeText} labelWidth={15}/>
                        <FormField label={"Meta key"} placeholder={"name"} labelWidth={15} value={query.metaKey ?? ''}
                                   name={"metaKey"}
                                   onChange={onChangeText}/>
                    </HorizontalGroup>
                    <MetaEditor entries={q.meta ?? []} onUpdate={updateMeta}/>
                </VerticalGroup>
            }
        </VerticalGroup>
    )
}
