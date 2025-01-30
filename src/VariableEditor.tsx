import React, {ChangeEvent, SyntheticEvent, useMemo} from "react";
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
import {LabeledSwitch} from "./components/form/LabeledSwitch";

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

    const onChangeSwitch = (event: SyntheticEvent<HTMLInputElement, Event>) => {
        onChange({...q, [event.currentTarget.name]: event.currentTarget.checked});
    }

    const queryModeOptions = [
        {label: 'Meta values', value: 'meta'},
        {label: 'Installations', value: 'installation'},
    ];

    const labelWidth = 17;

    return (
        <VerticalGroup spacing={"xs"}>
            <HorizontalGroup spacing={"xs"}>
                <InlineFieldRow>
                    <InlineField label={"Query mode"} labelWidth={labelWidth}>
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
                                   onChange={onChangeText} labelWidth={labelWidth}/>
                        <FormField label={"Meta key"} placeholder={"name"} labelWidth={labelWidth} value={query.metaKey ?? ''}
                                   name={"metaKey"}
                                   onChange={onChangeText}/>
                    </HorizontalGroup>
                    <HorizontalGroup>
                        <FormField label={"Name by meta value"} placeholder={"key"} labelWidth={labelWidth}
                                   value={query.metaNameKey ?? ''}
                                   name={"metaNameKey"}
                                   onChange={onChangeText}/>
                        <LabeledSwitch label={"Join device meta"} name={"addDeviceMeta"} value={query.addDeviceMeta ?? false}
                                       onChange={onChangeSwitch} />
                    </HorizontalGroup>
                    <MetaEditor entries={q.meta ?? []} onUpdate={updateMeta}/>
                </VerticalGroup>
            }
        </VerticalGroup>
    )
}
