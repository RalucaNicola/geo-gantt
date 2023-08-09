import { type ImmutableObject } from 'seamless-immutable'

export interface Config {
  nameField: string;
  startDateField: string;
  endDateField: string;
  timelineBackgroundColor: string;
  timelineFontColor: string;
}

export type IMConfig = ImmutableObject<Config>
