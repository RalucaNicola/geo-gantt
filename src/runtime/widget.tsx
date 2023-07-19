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

import defaultI18nMessages from "./translations/default";
import styled from "@emotion/styled";
import { Button } from "jimu-ui";
import Timeline from "./Timeline";
import { useEffect } from "react";

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
    background-color: ${props.theme.colors.palette.light[100]};
    box-shadow: ${props.theme.arcgis.boxShadow};
    overflow: auto;
  `;

  const Item = styled.div`
    margin-top: ${props.theme.sizes[2]};
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

  const renderData = () => {
    return (
      <div className="d-flex flex-column">
        {records.map((r, i) => {
          const name = r.getFieldValue("Name");
          const id = r.getId();
          const isSelected = dataSource
            .getSelectedRecordIds()
            .includes(id.toString());
          return (
            <Item className="d-flex">
              <Button
                key={i}
                aria-pressed={isSelected}
                size="sm"
                className="flex-grow-0 flex-shrink-0 w-25"
                type={isSelected ? "primary" : "secondary"}
                onClick={() => {
                  MessageManager.getInstance().publishMessage(
                    new DataRecordsSelectionChangeMessage(props.id, [r])
                  );
                  dataSource.selectRecordById(id.toString());
                }}
              >
                {name}
              </Button>
              {relatedRecords.hasOwnProperty(id) ? (
                <Timeline features={relatedRecords[id].features}></Timeline>
              ) : null}
            </Item>
          );
        })}
      </div>
    );
  };

  return (
    <Container className="jimu-widget p-3">
      <Header>
        {props.intl.formatMessage({
          id: "_widgetLabel",
          defaultMessage: defaultI18nMessages._widgetLabel,
        })}
      </Header>
      {dsConfigured ? (
        <div>
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
            renderData()
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
