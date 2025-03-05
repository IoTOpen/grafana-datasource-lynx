import { MyQuery } from "../types";
import {
    VerticalGroup,
    HorizontalGroup,
} from "@grafana/ui";
import React, { FormEvent } from "react";
import { LabeledSwitch } from "./form/LabeledSwitch";
import { FormField } from "./form/FormField";

export interface TweakSettingsProps {
    query: MyQuery;

    onChange (query: MyQuery): void;

    onRunQuery (): void;
}

const tooltipGroupBy = (
    <>
        Group series by some meta key or payload <code>msg</code> field. Defaults to Function ID.
    </>
);
const tooltipNameBy = (
    <>
        This will name series based on some meta key.
        <br />
        Defaults to <code>name</code>.
    </>
);
const tooltipMessageFrom = (
    <>
        Using this field will join matching functions with the same filter, but the type changed to this field. The
        msg
        field will be overwritten by messages matching this type, linked through <code>device_id</code> meta key.
        Useful
        for eg. joining positional data. <br />
        This field is only applied on table data.
    </>
);

export const TweakSettings = ({ query, onChange, onRunQuery }: TweakSettingsProps) => {

    const onGroupByChange = (event: FormEvent<HTMLInputElement>) => {
        onChange({ ...query, groupBy: event.currentTarget.value });
        onRunQuery();
    }

    const onNameByChange = (event: FormEvent<HTMLInputElement>) => {
        onChange({ ...query, nameBy: event.currentTarget.value });
        onRunQuery();
    }

    const onMessageChange = (event: FormEvent<HTMLInputElement>) => {
        onChange({ ...query, messageFrom: event.currentTarget.value });
        onRunQuery();
    }

    const onLinkChange = (event: FormEvent<HTMLInputElement>) => {
        onChange({ ...query, linkKey: event.currentTarget.value });
        onRunQuery();
    }
    const onSwitchChange = (event: FormEvent<HTMLInputElement>) => {
        onChange({ ...query, [event.currentTarget.name]: event.currentTarget.checked });
        onRunQuery();
    }
    const onMetaAsLabelsChange = (event: FormEvent<HTMLInputElement>) => {
        onChange({ ...query, [event.currentTarget.name]: event.currentTarget.checked });
        onRunQuery();
    }

    return (
        <>
            <VerticalGroup spacing={"xs"}>
                <FormField
                    name={'groupBy'}
                    labelWidth={16}
                    label={'Group by'}
                    onChange={onGroupByChange}
                    value={query.groupBy}
                    placeholder={'Function ID'}
                    tooltip={tooltipGroupBy}
                />
                <FormField
                    name={'nameBy'}
                    labelWidth={16}
                    label={'Name by'}
                    placeholder={'name'}
                    onChange={onNameByChange}
                    value={query.nameBy}
                    tooltip={tooltipNameBy}
                />
                <HorizontalGroup align={"flex-start"} spacing={"xs"}>
                    <LabeledSwitch label={"As table data"} value={query.tabledata} name={"tabledata"}
                        onChange={onSwitchChange} labelWidth={16} />
                    {query.tabledata && <VerticalGroup spacing={"xs"} align={"flex-start"}>
                        <FormField
                            placeholder={'eg. latitude'}
                            name={'messageFrom'}
                            labelWidth={20}
                            label={'Message from'}
                            onChange={onMessageChange}
                            value={query.messageFrom}
                            tooltip={tooltipMessageFrom}
                        />
                        <FormField labelWidth={20} placeholder={'device_id'} name={'linkKey'} label={'Linked with'} onChange={onLinkChange}
                            value={query.linkKey} />
                        <LabeledSwitch label={"Meta as fields"} labelWidth={20} value={query.metaAsFields} name={"metaAsFields"}
                            onChange={onSwitchChange} />
                        {query.metaAsFields && <LabeledSwitch label={"Add device meta"} labelWidth={20} name={"joinDeviceMeta"}
                            value={query.joinDeviceMeta} onChange={onSwitchChange} />}
                    </VerticalGroup>
                    }
                </HorizontalGroup>

                <LabeledSwitch label={"Current state only"} value={query.stateOnly} name={"stateOnly"}
                    onChange={onSwitchChange} labelWidth={16} />
                <LabeledSwitch label={"Meta as labels"} name={"metaAsLabels"} value={query.metaAsLabels}
                    onChange={onMetaAsLabelsChange} labelWidth={16} />
            </VerticalGroup>
        </>
    )
}
