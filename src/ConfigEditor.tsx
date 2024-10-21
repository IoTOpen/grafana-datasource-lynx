import React, {ChangeEvent, SyntheticEvent, useEffect} from 'react';
import {MyDataSourceOptions, MySecureJsonData} from './types';
import {DataSourcePluginOptionsEditorProps} from '@grafana/data';
import {Alert, HorizontalGroup, VerticalGroup} from '@grafana/ui';
import {FormField} from 'components/form/FormField'
import {LabeledSwitch} from "./components/form/LabeledSwitch";

interface ConfigEditorProps extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions, MySecureJsonData> {
}

export const ConfigEditor = ({onOptionsChange, options}: ConfigEditorProps) => {
    const {jsonData, secureJsonData, secureJsonFields} = options;
    const [migrated, setMigrated] = React.useState(false);
    const onChangeText = (event: ChangeEvent<HTMLInputElement>) => {
        onOptionsChange({
            ...options,
            jsonData: {
                ...jsonData,
                [event.target.name]: event.target.value
            }
        });
    }

    const onChangeSwitch = (event: SyntheticEvent<HTMLInputElement, Event>) => {
        onOptionsChange({
            ...options,
            jsonData: {
                ...jsonData,
                [event.currentTarget.name]: event.currentTarget.checked
            }
        });
    }

    const onChangeSecretText = (event: ChangeEvent<HTMLInputElement>) => {
        onOptionsChange({
            ...options,
            secureJsonData: {
                ...secureJsonData,
                [event.target.name]: event.target.value
            }
        });
    }

    useEffect(() => {
        if (options.jsonData.apiKey !== undefined && options.jsonData.apiKey !== '') {
            setMigrated(true);
            let newJsonData = {...jsonData};
            delete newJsonData.apiKey;
            onOptionsChange({
                ...options,
                secureJsonData: {...secureJsonData, apiKey: options.jsonData.apiKey},
                jsonData: newJsonData
            });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <VerticalGroup spacing={"none"}>
            <FormField label={"URL"}
                       value={options.jsonData.url || ''}
                       name={"url"}
                       placeholder={"Enter URL, eg. https://lynx.iotopen.se"}
                       onChange={onChangeText}
                       labelWidth={15}
                       width={40}
            />
            <LabeledSwitch labelWidth={15} label={"OAuth2 Passthru"} name={"oauthPassThru"}
                           value={options.jsonData.oauthPassThru || false} onChange={onChangeSwitch}/>
            {!options.jsonData.oauthPassThru &&
                <FormField label={"API Key"}
                           labelWidth={15}
                           name={"apiKey"}
                           value={secureJsonData?.apiKey ?? ''}
                           onChange={onChangeSecretText}
                           placeholder={secureJsonFields.apiKey ? 'Configured' : 'Enter API Key'}
                           width={70}
                           type={"password"}
                />
            }
            {migrated && !secureJsonFields.apiKey &&
                <HorizontalGroup width={"100%"}>
                    <Alert title={"Secure the API Key"} severity={"error"}>
                        <VerticalGroup>
                            <p>
                                The API key has migrated to a secure location. <br/>
                                Please press save to migrate the key to the secure store and get rid of this message.
                            </p>
                        </VerticalGroup>
                    </Alert>
                </HorizontalGroup>}
        </VerticalGroup>
    )
}
