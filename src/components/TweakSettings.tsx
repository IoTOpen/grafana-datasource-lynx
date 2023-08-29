import {MyQuery} from "../types";
import {
    LegacyForms,
    VerticalGroup,
    HorizontalGroup,
} from "@grafana/ui";
import React, {FormEvent} from "react";
import {LabeledSwitch} from "./LabeledSwitch";

const {FormField} = LegacyForms;

export interface TweakSettingsProps {
    query: MyQuery;

    onChange(query: MyQuery): void;

    onRunQuery(): void;
}

const tooltipGroupBy = (
    <>
        Group series by some meta key or payload <code>msg</code> field. Defaults to Function ID.
    </>
);
const tooltipNameBy = (
    <>
        This will name series based on some meta key.
        <br/>
        Defaults to <code>name</code>.
    </>
);
const tooltipMessageFrom = (
    <>
        Using this field will join matching functions with the same filter, but the type changed to this field. The
        msg
        field will be overwritten by messages matching this type, linked through <code>device_id</code> meta key.
        Useful
        for eg. joining positional data. <br/>
        This field is only applied on table data.
    </>
);

export const TweakSettings = ({query, onChange, onRunQuery}: TweakSettingsProps) => {

    const onGroupByChange = (event: FormEvent<HTMLInputElement>) => {
        onChange({...query, groupBy: event.currentTarget.value});
        onRunQuery();
    }

    const onNameByChange = (event: FormEvent<HTMLInputElement>) => {
        onChange({...query, nameBy: event.currentTarget.value});
        onRunQuery();
    }

    const onMessageChange = (event: FormEvent<HTMLInputElement>) => {
        onChange({...query, messageFrom: event.currentTarget.value});
        onRunQuery();
    }

    const onLinkChange = (event: FormEvent<HTMLInputElement>) => {
        onChange({...query, linkKey: event.currentTarget.value});
        onRunQuery();
    }

    const onDatatable = (value: boolean) => {
        onChange({...query, tabledata: value});
        onRunQuery();
    }

    const onMetaAsFields = (value: boolean) => {
        onChange({...query, metaAsFields: value});
        onRunQuery();
    }

    const onDeviceMetaJoin = (value: boolean) => {
        onChange({...query, joinDeviceMeta: value});
        onRunQuery();
    }

    const onStateOnlyChange = (value: boolean) => {
        onChange({...query, stateOnly: value});
        onRunQuery();
    }

    return (
        <>
            <VerticalGroup spacing={"xs"}>
                <FormField
                    labelWidth={40}
                    label={'Group by'}
                    onChange={onGroupByChange}
                    value={query.groupBy}
                    tooltip={tooltipGroupBy}
                />
                <FormField
                    labelWidth={40}
                    label={'Name by'}
                    onChange={onNameByChange}
                    value={query.nameBy}
                    tooltip={tooltipNameBy}
                />
                <HorizontalGroup align={"flex-start"} spacing={"xs"}>
                    <LabeledSwitch label={"As table data"} value={query.tabledata} onChange={onDatatable}/>
                    {query.tabledata && <VerticalGroup spacing={"xs"} align={"flex-start"}>
                        <FormField
                            labelWidth={40}
                            label={'Message from'}
                            onChange={onMessageChange}
                            value={query.messageFrom}
                            tooltip={tooltipMessageFrom}
                        />
                        <FormField labelWidth={40} label={'Linked with'} onChange={onLinkChange}
                                   value={query.linkKey}/>
                        <LabeledSwitch label={"metaAsFields"} value={query.metaAsFields} onChange={onMetaAsFields} />
                        {query.metaAsFields && <LabeledSwitch label={"Add device meta"} value={query.joinDeviceMeta} onChange={onDeviceMetaJoin} />}
                    </VerticalGroup>
                    }
                </HorizontalGroup>
                <LabeledSwitch label={"Current state only"} value={query.stateOnly} onChange={onStateOnlyChange} />
            </VerticalGroup>
        </>
    )
}
