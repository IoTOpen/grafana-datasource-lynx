import {MyQuery} from "../types";
import {LegacyForms} from "@grafana/ui";
import React from "react";

const {FormField, Switch} = LegacyForms;

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

    const onGroupByChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        onChange({...query, groupBy: event.currentTarget.value});
        onRunQuery();
    }

    const onNameByChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        onChange({...query, nameBy: event.currentTarget.value});
        onRunQuery();
    }

    const onMessageChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        onChange({...query, messageFrom: event.currentTarget.value});
        onRunQuery();
    }

    const onLinkChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        onChange({...query, linkKey: event.currentTarget.value});
        onRunQuery();
    }

    const onDatatable = (event: React.SyntheticEvent<HTMLInputElement>) => {
        onChange({...query, tabledata: event.currentTarget.checked});
        onRunQuery();
    }

    const onMetaAsFields = (event: React.SyntheticEvent<HTMLInputElement>) => {
        onChange({...query, metaAsFields: event.currentTarget.checked});
        onRunQuery();
    }

    const onDeviceMetaJoin = (event: React.SyntheticEvent<HTMLInputElement>) => {
        onChange({...query, joinDeviceMeta: event.currentTarget.checked});
        onRunQuery();
    }

    const onStateOnlyChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        onChange({...query, stateOnly: event.currentTarget.checked});
        onRunQuery();
    }

    return (
        <>
            <div className={'gf-form-inline'}>
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
            </div>
            <div className={'gf-form-inline'}>
                <Switch label={'As table data'} checked={query.tabledata} onChange={onDatatable}/>
                <div hidden={!query.tabledata}>
                    <FormField
                        labelWidth={40}
                        label={'Message from'}
                        onChange={onMessageChange}
                        value={query.messageFrom}
                        tooltip={tooltipMessageFrom}
                    />
                    <FormField labelWidth={40} label={'Linked with'} onChange={onLinkChange}
                               value={query.linkKey}/>
                    <div>
                        <Switch label={'Meta to fields'} checked={query.metaAsFields}
                                onChange={onMetaAsFields}/>
                        <div hidden={!query.metaAsFields}>
                            <Switch label={'Add device meta'} checked={query.joinDeviceMeta}
                                    onChange={onDeviceMetaJoin}/>
                        </div>
                    </div>
                </div>
            </div>
            <Switch label={'Current state only'} checked={query.stateOnly} onChange={onStateOnlyChange}/>
        </>
    )
}
