import {MetaEntry} from "../types";
import {FilterEntry} from "./FilterEntry";
import React, {MouseEvent, useCallback} from "react";
import {Button, VerticalGroup} from "@grafana/ui";


export interface MetaEditorProps {
    entries: MetaEntry[];
    onUpdate(entries: MetaEntry[]): void;
    hints?: {[key: string]: string[]};
}

export const MetaEditor = ({entries: ents, onUpdate, hints}: MetaEditorProps) => {

    const onMetaDelete = useCallback((idx: number) => {
        const tmp = ents.filter((value, index) => index !== idx);
        onUpdate(tmp);
    }, [ents, onUpdate]);

    const onMetaAdd = useCallback((e: MouseEvent) => {
        onUpdate([...ents, {key: '', value: ''}]);
        e.preventDefault();
    }, [ents, onUpdate]);

    const onMetaUpdate = useCallback((idx: number, value: MetaEntry) => {
        const tmp = ents.map((entry, index) => {
            if (index === idx) {
                return value;
            }
            return entry;
        });
        onUpdate(tmp);
    }, [ents, onUpdate]);

    return (
        <VerticalGroup>
            <div className={'gf-form-inline,ui-list'}>
                {ents.map((value, idx) => {
                    return (
                        <FilterEntry
                            key={idx}
                            data={value}
                            onDelete={() => {onMetaDelete(idx)}}
                            onUpdate={(value) => onMetaUpdate(idx, value)}
                            keys={hints ? Object.keys(hints):[]}
                            values={hints ? hints[value.key] ?? []:[]}
                        />
                    );
                })}
            </div>
            <div className={'gf-form-inline'} style={{paddingBottom: 10}}>
                <Button onClick={onMetaAdd} icon={'plus'}>Add filter</Button>
            </div>
        </VerticalGroup>
    )
};
