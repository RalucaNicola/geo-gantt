/** @jsx jsx */
import {
  AllWidgetProps,
  DataRecordsSelectionChangeMessage,
  DataSourceComponent,
  DataSourceStatus,
  FeatureLayerDataSource,
  FeatureLayerQueryParams,
  IMDataSourceInfo,
  MessageManager,
  React,
  WidgetInjectedProps,
  WidgetProps,
  jsx,
} from "jimu-core";
import "./styles.css";

import defaultI18nMessages from "./translations/default";
import styled from "@emotion/styled";

import TimelineComponent from "./TimelineComponent";
import { Config } from "../config";
import { FeatureDataRecord, JimuMapViewComponent } from "jimu-arcgis";
import { Loading } from "jimu-ui";

const query = {
  where: "1=1",
  outFields: ["*"],
  returnGeometry: true,
} as FeatureLayerQueryParams;

const Container = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

export default function Widget(props: AllWidgetProps<WidgetProps & WidgetInjectedProps<Config>>) {
  const [view, setView] = React.useState(null);
  const useMapWidgetId = props.useMapWidgetIds?.[0];
  const { endDateField, startDateField, nameField, timelineBackgroundColor, timelineFontColor } = props.config as unknown as Config;
  const dsConfigured = props.useDataSources && props.useDataSources.length > 0 && endDateField && startDateField && nameField && useMapWidgetId;

  const onActiveMapViewChange = (jimuMapView) => {
    setView(jimuMapView.view);
  }

  function renderTimeline(dataSource: FeatureLayerDataSource, info: IMDataSourceInfo) {
    if (dataSource && info.status === DataSourceStatus.Loaded && view) {
      const records = dataSource.getRecords();
      const [selectedId] = info.selectedIds;
      return (<TimelineComponent
        records={records}
        onGroupSelected={(id) => {
          const record = dataSource.getRecordById(id) as FeatureDataRecord;
          const { feature } = record;
          MessageManager.getInstance().publishMessage(
            new DataRecordsSelectionChangeMessage(props.id, [
              record,
            ])
          );
          dataSource.selectRecordById(id);
          const layer = view.map.findLayerById(feature.layer.id);
          feature.layer = layer;
          view.openPopup({ features: [feature], location: feature.geometry.centroid });
        }}
        fields={props.config}
        selectedId={selectedId}
        theme={props.theme}
        backgroundColor={timelineBackgroundColor}
        fontColor={timelineFontColor}
      ></TimelineComponent>)
    } else {
      return (
        <Loading type="SECONDARY" />
      )
    }
  }

  return (
    <Container className="jimu-widget p-3">
      {dsConfigured ? (
        <div style={{ flex: 1, overflow: "auto" }}>
          <DataSourceComponent
            useDataSource={props.useDataSources[0]}
            query={query}
            widgetId={props.id}
          >{renderTimeline}</DataSourceComponent>
          <JimuMapViewComponent useMapWidgetId={useMapWidgetId} onActiveViewChange={onActiveMapViewChange} />
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
