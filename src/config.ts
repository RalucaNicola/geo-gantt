import { type ImmutableObject } from 'seamless-immutable'

export interface Config {
  nameField: string;
  startDateField: Date;
  endDateField: Date;
  timelineBackgroundColor: string;
  timelineFontColor: string;
}

export type IMConfig = ImmutableObject<Config>
