/** @jsx jsx */
import {
  AllWidgetProps,
  DataRecordsSelectionChangeMessage,
  DataSource,
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
//@ts-ignore
import * as d3 from "./lib/d3/d3.min.js";
import defaultI18nMessages from "./translations/default";
import styled from "@emotion/styled";
import { Button } from "jimu-ui";
import Timeline from "./Timeline";

const query = {
  where: "1=1",
  outFields: ["*"],
  returnGeometry: true,
} as FeatureLayerQueryParams;

export default function Widget(props: AllWidgetProps<WidgetProps>) {
  const dsConfigured = props.useDataSources && props.useDataSources.length > 0;

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

  const renderData = (ds: FeatureLayerDataSource) => {
    if (ds && ds.getStatus() === DataSourceStatus.Loaded) {
      const records = ds.getRecords();
      return (
        <div className="d-flex flex-column">
          {records.map((r, i) => {
            const { Name: name, OBJECTID: id } = r.getData();
            const selected = ds.getSelectedRecordIds().includes(id.toString());
            return (
              <Item className="d-flex">
                <Button
                  key={i}
                  aria-pressed={selected}
                  size="sm"
                  className="flex-grow-0 flex-shrink-0 w-25"
                  type={selected ? "primary" : "secondary"}
                  onClick={() => {
                    const record = ds.getRecordById(id.toString());
                    MessageManager.getInstance().publishMessage(
                      new DataRecordsSelectionChangeMessage(props.id, [record])
                    );
                    ds.selectRecordById(id.toString());
                  }}
                >
                  {name}
                </Button>
                <Timeline layer={ds.layer} id={id}></Timeline>
              </Item>
            );
          })}
        </div>
      );
    } else {
      return (
        <div>
          {props.intl.formatMessage({
            id: "loading",
            defaultMessage: defaultI18nMessages.loading,
          })}
        </div>
      );
    }
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
            // onDataSourceCreated={(ds: FeatureLayerDataSource) => {
            //   console.log(ds);
            //   // setDataSource(ds);
            // }}
            // onDataSourceInfoChange={(info) => {
            //   console.log(info);
            //   // setDataSourceStatus(ds.getStatus());
            // }}
          >
            {renderData}
          </DataSourceComponent>
          {/* <div ref={mainRef}></div> */}
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
