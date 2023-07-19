/** @jsx jsx */
import {
  AllWidgetProps,
  DataRecord,
  DataRecordsSelectionChangeMessage,
  DataSourceComponent,
  DataSourceStatus,
  FeatureLayerDataSource,
  FeatureLayerQueryParams,
  IMDataSourceInfo,
  MessageManager,
  React,
  WidgetProps,
  jsx,
} from "jimu-core";
import "./styles.css";

import defaultI18nMessages from "./translations/default";
import styled from "@emotion/styled";

import { useEffect } from "react";
import TimelineComponent from "./TimelineComponent";

const query = {
  where: "1=1",
  outFields: ["*"],
  returnGeometry: true,
} as FeatureLayerQueryParams;

export default function Widget(props: AllWidgetProps<WidgetProps>) {
  const dsConfigured = props.useDataSources && props.useDataSources.length > 0;
  const [dataSource, setDataSource] =
    React.useState<FeatureLayerDataSource>(null);
  const [dataSourceStatus, setDataSourceStatus] =
    React.useState<DataSourceStatus>(null);
  const [records, setRecords] = React.useState<DataRecord[]>(null);
  const [relatedRecords, setRelatedRecords] = React.useState(null);

  const Container = styled.div`
    overflow: auto;
    display: flex;
    flex-direction: column;
  `;

  const Header = styled.div`
    font-size: ${props.theme.sizes[3]};
  `;

  useEffect(() => {
    if (dataSource && dataSourceStatus === DataSourceStatus.Loaded) {
      const records = dataSource.getRecords();
      setRecords(records);
      const ids = records.map((record) => record.getId());
      const relationshipId = dataSource.layer.relationships[0].id;
      const relationshipQuery = {
        objectIds: ids,
        outFields: ["*"],
        relationshipId: relationshipId,
      };
      dataSource.layer
        .queryRelatedFeatures(relationshipQuery)
        .then((results) => {
          setRelatedRecords(results);
        });
    }
  }, [dataSource, dataSourceStatus]);

  return (
    <Container className="jimu-widget p-3">
      <Header>
        {props.intl.formatMessage({
          id: "header",
          defaultMessage: defaultI18nMessages.header,
        })}
      </Header>
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
          {records && relatedRecords ? (
            <TimelineComponent
              records={records}
              relatedRecords={relatedRecords}
              onGroupSelected={(id) => {
                MessageManager.getInstance().publishMessage(
                  new DataRecordsSelectionChangeMessage(props.id, [
                    dataSource.getRecordById(id),
                  ])
                );
                dataSource.selectRecordById(id);
              }}
              selectedId={
                dataSource.getSelectedRecordIds().length > 0
                  ? dataSource.getSelectedRecordIds()[0]
                  : null
              }
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
