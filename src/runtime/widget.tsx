/** @jsx jsx */
import {
  AllWidgetProps,
  DataRecord,
  DataRecordsSelectionChangeMessage,
  DataSourceComponent,
  DataSourceStatus,
  FeatureLayerDataSource,
  FeatureLayerQueryParams,
  IMConfig,
  IMDataSourceInfo,
  IMWidgetJson,
  MessageManager,
  React,
  WidgetInjectedProps,
  WidgetProps,
  jsx,
} from "jimu-core";
import "./styles.css";

import defaultI18nMessages from "./translations/default";
import styled from "@emotion/styled";

import { useEffect } from "react";
import TimelineComponent from "./TimelineComponent";
import { Config } from "../config";

const query = {
  where: "1=1",
  outFields: ["*"],
  returnGeometry: true,
} as FeatureLayerQueryParams;

export default function Widget(props: AllWidgetProps<WidgetProps & WidgetInjectedProps<Config>>) {

  const { endDateField, startDateField, nameField } = props.config as unknown as Config;
  const [dataSource, setDataSource] =
    React.useState<FeatureLayerDataSource>(null);
  const [dataSourceStatus, setDataSourceStatus] =
    React.useState<DataSourceStatus>(null);
  const [records, setRecords] = React.useState<DataRecord[]>(null);
  const dsConfigured = props.useDataSources && props.useDataSources.length > 0 && endDateField && startDateField && nameField;
  const Container = styled.div`
    overflow: auto;
    display: flex;
    flex-direction: column;
  `;

  useEffect(() => {
    if (dataSource && dataSourceStatus === DataSourceStatus.Loaded && endDateField && startDateField && nameField) {
      const records = dataSource.getRecords();
      setRecords(records);
      console.log(records);
    }
  }, [dataSource, dataSourceStatus, endDateField, startDateField, nameField]);

  return (
    <Container className="jimu-widget p-3">
      {dsConfigured ? (
        <div style={{ flex: 1, overflow: "auto" }}>
          <DataSourceComponent
            useDataSource={props.useDataSources[0]}
            query={query}
            widgetId={props.id}
            onDataSourceCreated={(ds: FeatureLayerDataSource) => {
              setDataSource(ds);
            }}
            onDataSourceInfoChange={(info: IMDataSourceInfo) => {
              setDataSourceStatus(info.status);
            }}
          ></DataSourceComponent>
          {records ? (
            <TimelineComponent
              records={records}
              onGroupSelected={(id) => {
                MessageManager.getInstance().publishMessage(
                  new DataRecordsSelectionChangeMessage(props.id, [
                    dataSource.getRecordById(id),
                  ])
                );
                dataSource.selectRecordById(id);
              }}
              fields={props.config}
            ></TimelineComponent>
          ) : (
            <div>
              {props.intl.formatMessage({
                id: "loading",
                defaultMessage: defaultI18nMessages.loading,
              })}
            </div>
          )}
        </div>
      ) : (
        <p>
          {props.intl.formatMessage({
            id: "configureDataSource",
            defaultMessage: defaultI18nMessages.configureDataSource,
          })}
        </p>
      )}
    </Container>
  );
}
