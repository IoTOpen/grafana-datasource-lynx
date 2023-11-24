import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {DataSource} from './DataSource';
import {MyQuery, MyDataSourceOptions, Installation, FunctionX, MetaEntry, defaultQuery} from './types';
import {QueryEditorProps} from '@grafana/data';
import {InstallationSelector} from "./components/InstallationSelector";
import {MetaEditor} from "./components/MetaEditor";
import {TweakSettings} from "./components/TweakSettings";
import {useBackoffCallback} from "./components/useBackoffCallback";
import {LabeledSwitch} from "./components/form/LabeledSwitch";
import {InlineFieldRow} from "@grafana/ui";
import {VariableSelector} from "./components/VariableSelector";

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export const QueryEditor = ({onChange, query, onRunQuery, datasource}: Props) => {
    const [installations, setInstallations] = useState<Installation[]>([])
    const [loadingInstallations, setLoadingInstallations] = useState<boolean>(true)

    const squery = useMemo(() => {
        let q = query;
        if (q.installationId === undefined) {
            q = {...q, ...defaultQuery};
            onChange(q);
        }
        return q;
    }, [query, onChange])

    const [functions, setFunctions] = useState<FunctionX[]>([])
    const [loadingFunctions, setLoadingFunctions] = useState<boolean>(false)

    const [selectedInstallation, setSelectedInstallation] = useState<Installation>({id: 0, name: '', client_id: 0})

    const onRunQueryTimed = useBackoffCallback(onRunQuery, 250);

    useEffect(() => {
        datasource.fetchInstallations().then(installations => {
            let tmpInstallation: Installation | undefined = installations.find(i => i.id === query.installationId);
            if (tmpInstallation === undefined && installations.length === 0) {
                tmpInstallation = {id: 0, name: 'No installations available', client_id: 0};
            }
            if (tmpInstallation === undefined && installations.length > 0) {
                tmpInstallation = installations[0];
            }
            setSelectedInstallation(tmpInstallation!);
            setInstallations(installations);
        }).finally(() => {
            setLoadingInstallations(false)
        });
    }, []); // eslint-disable-line

    useEffect(() => {
        if (selectedInstallation.id === 0) {
            return
        }
        setLoadingFunctions(true);
        datasource.fetchFunctions(Number(selectedInstallation.id)).then(functions => {
            setFunctions(functions);
            onRunQueryTimed();
        }).finally(() => {
            setLoadingFunctions(false)
        });
    }, [setLoadingFunctions, selectedInstallation, setFunctions, datasource, onRunQueryTimed]);

    const onUpdateMeta = useCallback((entries: MetaEntry[]) => {
        onChange({...squery, meta: entries});
        onRunQueryTimed();
    }, [onChange, squery, onRunQueryTimed]);

    useEffect(() => {
        if (selectedInstallation.id !== 0 &&
            selectedInstallation.id !== squery.installationId) {
            onChange({...squery, installationId: selectedInstallation.id});
        }
    }, [selectedInstallation, squery, onChange])

    const hints = useMemo(() => {
        const res: { [key: string]: string[] } = {};
        for (const func of functions) {
            if (res["type"] === undefined) {
                res["type"] = [func.type];
            } else {
                if (res["type"].indexOf(func.type) === -1) {
                    res["type"].push(func.type);
                }
            }
            for (const metaKey in func.meta) {
                if (res[metaKey] === undefined) {
                    res[metaKey] = [];
                }
                if (res[metaKey].indexOf(func.meta[metaKey]) === -1) {
                    res[metaKey].push(func.meta[metaKey]);
                }
            }
        }
        return res;
    }, [functions]);

    const setInstallationVariable = (variable?: string) => {
        onChange({...squery, installationVariable: variable});
    };

    return (
        <div className={'section gf-form-group'}>
            <InlineFieldRow>
                {squery.installationVariable === undefined ?
                    <InstallationSelector isLoading={loadingInstallations || loadingFunctions}
                                          installations={installations}
                                          installation={selectedInstallation}
                                          onSelection={setSelectedInstallation}/> :
                    <VariableSelector value={squery.installationVariable} onSelection={setInstallationVariable}/>}
                <LabeledSwitch label={"From variable"} name={"useVariable"}
                               value={squery.installationVariable !== undefined} onChange={(e) => {
                    if (e.currentTarget.checked) {
                        setInstallationVariable('');
                    } else {
                        setInstallationVariable(undefined);
                    }
                }}/>
            </InlineFieldRow>
            <MetaEditor entries={squery.meta || []}
                        onUpdate={onUpdateMeta}
                        hints={hints}
            />
            <TweakSettings query={query} onChange={onChange} onRunQuery={onRunQueryTimed}/>
        </div>
    )
};
