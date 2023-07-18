/** @jsx jsx */
import { jsx, DataSourceTypes, Immutable, UseDataSource } from "jimu-core";
import { AllWidgetSettingProps, WidgetSettingProps } from "jimu-for-builder";
import {
  SettingRow,
  SettingSection,
} from "jimu-ui/advanced/setting-components";
import defaultI18nMessages from "./translations/default";
import { DataSourceSelector } from "jimu-ui/advanced/data-source-selector";

export default function (props: AllWidgetSettingProps<WidgetSettingProps>) {
  const supportedTypes = Immutable([DataSourceTypes.FeatureLayer]);

  const onDataSourceChange = (useDataSources: UseDataSource[]) => {
    props.onSettingChange({
      id: props.id,
      useDataSources,
    });
  };

  return (
    <div>
      <SettingSection
        className="data-source-selector-section"
        title={props.intl.formatMessage({
          id: "dataSourceTitle",
          defaultMessage: defaultI18nMessages.dataSourceTitle,
        })}
      >
        <SettingRow>
          {props.intl.formatMessage({
            id: "selectDataSource",
            defaultMessage: defaultI18nMessages.selectDataSource,
          })}
        </SettingRow>
        <SettingRow>
          <DataSourceSelector
            types={supportedTypes}
            useDataSourcesEnabled
            mustUseDataSource
            useDataSources={props.useDataSources}
            onChange={onDataSourceChange}
            widgetId={props.id}
          />
        </SettingRow>
      </SettingSection>
    </div>
  );
}
