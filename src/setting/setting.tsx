/** @jsx jsx */
import { jsx, DataSourceTypes, Immutable, UseDataSource, IMFieldSchema, DataSource, IMWidgetJson, JimuFieldType, WidgetInjectedProps } from "jimu-core";
import { AllWidgetSettingProps, WidgetSettingProps } from "jimu-for-builder";
import {
  SettingRow,
  SettingSection,
} from "jimu-ui/advanced/setting-components";
import defaultI18nMessages from "./translations/default";
import { DataSourceSelector, FieldSelector } from "jimu-ui/advanced/data-source-selector";
import { Config } from "../config";

const dateFieldTypes = Immutable([JimuFieldType.Date]);
const stringFieldTypes = Immutable([JimuFieldType.String]);

export default function (props: AllWidgetSettingProps<WidgetSettingProps & WidgetInjectedProps<Config>>) {
  const supportedTypes = Immutable([DataSourceTypes.FeatureLayer]);

  const onDataSourceChange = (useDataSources: UseDataSource[]) => {
    if (!useDataSources) {
      return;
    }
    props.onSettingChange({
      id: props.id,
      useDataSources,
    });
  };

  const onFieldChange = (allSelectedFields: IMFieldSchema[], fieldName) => {
    if (allSelectedFields && allSelectedFields.length === 1) {
      const field = allSelectedFields[0].name;
      props.onSettingChange({
        id: props.id,
        config: props.config.set(fieldName, field)
      })
    } else {
      props.onSettingChange({
        id: props.id,
        config: props.config.set(fieldName, null)
      })
    }
  }

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
      {props.useDataSources && props.useDataSources.length > 0 &&
        <div>
          <SettingSection
            className="data-source-selector-section"
            title={props.intl.formatMessage({
              id: "selectNameField",
              defaultMessage: defaultI18nMessages.selectNameField,
            })}>
            <SettingRow>
              <FieldSelector
                useDataSources={props.useDataSources}
                onChange={(allSelectedFields: IMFieldSchema[]) => onFieldChange(allSelectedFields, "nameField")}
                selectedFields={props.useDataSources[0].fields || Immutable([props.config["nameField"]])}
                isDataSourceDropDownHidden={true}
                useDropdown={true}
                widgetId={props.id}
                types={stringFieldTypes}
              />
            </SettingRow>
          </SettingSection>
          <SettingSection
            className="data-source-selector-section"
            title={props.intl.formatMessage({
              id: "selectStartDateField",
              defaultMessage: defaultI18nMessages.selectStartDateField,
            })}>
            <SettingRow>
              <FieldSelector
                useDataSources={props.useDataSources}
                onChange={(allSelectedFields: IMFieldSchema[]) => onFieldChange(allSelectedFields, "startDateField")}
                selectedFields={props.useDataSources[0].fields || Immutable([props.config["startDateField"]])}
                isDataSourceDropDownHidden={true}
                useDropdown={true}
                widgetId={props.id}
                types={dateFieldTypes}
              />
            </SettingRow>
          </SettingSection>
          <SettingSection
            className="data-source-selector-section"
            title={props.intl.formatMessage({
              id: "selectEndDateField",
              defaultMessage: defaultI18nMessages.selectEndDateField,
            })}>
            <SettingRow>
              <FieldSelector
                useDataSources={props.useDataSources}
                onChange={(allSelectedFields: IMFieldSchema[]) => onFieldChange(allSelectedFields, "endDateField")}
                selectedFields={props.useDataSources[0].fields || Immutable([props.config["endDateField"]])}
                isDataSourceDropDownHidden={true}
                useDropdown={true}
                widgetId={props.id}
                types={dateFieldTypes}
              />
            </SettingRow>
          </SettingSection>
        </div>
      }
    </div>
  );
}
