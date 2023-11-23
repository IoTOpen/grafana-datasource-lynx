import React, {MouseEventHandler, useCallback, useMemo} from 'react';
import {Button, Select} from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import {MetaEntry} from "../types";

type onDeleteFunction = () => void;
type onUpdateFunction = (event: MetaEntry) => void;

interface FilterEntryProps {
  data: MetaEntry;
  onDelete: onDeleteFunction;
  onUpdate: onUpdateFunction;
  keys?: string[];
  values?: string[];
}


export const FilterEntry = ({data, keys, values, onUpdate, onDelete}: FilterEntryProps) => {
  const selectableKeys = useMemo<SelectableValue[]>(() => {
    if (keys) {
      return keys.map((value) => ({label: value, value: value}))
    }
    return []
  }, [keys]);
  const selectableValues = useMemo<SelectableValue[]>(() => {
    if (values) {
      return values.map((value) => ({label: value, value: value}))
    }
    return []
  }, [values]);

  const currentKey = useMemo<SelectableValue>(() => {
    return {label: data.key, value: data.key}
  }, [data]);

  const currentValue = useMemo<SelectableValue>(() => {
    return {label: data.value, value: data.value}
  }, [data]);

  const onChangeKey = useCallback((event: SelectableValue) => {
    onUpdate({...data, key: event.value});
  }, [data, onUpdate]);

  const onChangeValue = useCallback((event: SelectableValue) => {
    onUpdate({...data, value: event.value});
  }, [data, onUpdate]);

  const onCreateKey = useCallback((newValue: string) => {
    onUpdate({...data, key: newValue})
  }, [data, onUpdate]);

  const onCreateValue = useCallback((newValue: string) => {
    onUpdate({...data, value: newValue})
  }, [data, onUpdate]);

  const deleteEventHandler = useCallback<MouseEventHandler<HTMLButtonElement>>((event) => {
    event.preventDefault();
    onDelete();
  }, [onDelete]);

  return (
      <div className={'gf-form-inline'}>
        <div className={'gf-form'}>
          <span className={'gf-form-label query-keyword'}>key</span>
          <Select
              width={30}
              options={selectableKeys}
              onChange={onChangeKey}
              onCreateOption={onCreateKey}
              value={currentKey}
              isSearchable={true}
              allowCustomValue={true}
              menuPlacement={'bottom'}
              placeholder={'meta key'}
          />
          <span className={'gf-form-label query-keyword'}>match</span>
          <Select
              width={30}
              options={selectableValues}
              onChange={onChangeValue}
              onCreateOption={onCreateValue}
              value={currentValue}
              isSearchable={true}
              allowCustomValue={true}
              menuPlacement={'bottom'}
              placeholder={'wildcard match'}
          />
          <Button variant={'destructive'} onClick={deleteEventHandler} icon={'trash-alt'} />
        </div>
      </div>
  )
};
