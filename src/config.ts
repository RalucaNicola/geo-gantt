import { IMWidgetJson } from 'jimu-core';
import { type ImmutableObject } from 'seamless-immutable'

export interface Config {
  nameField: string;
  startDateField: Date;
  endDateField: Date;
}

export type IMConfig = ImmutableObject<Config>
