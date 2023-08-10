/** @jsx jsx */
import { jsx, DataSourceTypes, Immutable, UseDataSource, IMFieldSchema, DataSource, IMWidgetJson, JimuFieldType, WidgetInjectedProps } from "jimu-core";
import { AllWidgetSettingProps } from "jimu-for-builder";
import {
  MapWidgetSelector,
  SettingRow,
  SettingSection,
} from "jimu-ui/advanced/setting-components";
import defaultI18nMessages from "./translations/default";
import { DataSourceSelector, FieldSelector } from "jimu-ui/advanced/data-source-selector";
import { IMConfig } from "../config";
import { Label } from "jimu-ui";
import { ColorPicker } from "jimu-ui/basic/color-picker";

const dateFieldTypes = Immutable([JimuFieldType.Date]);
const stringFieldTypes = Immutable([JimuFieldType.String]);

export default function (props: AllWidgetSettingProps<IMConfig>) {
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

  const onMapWidgetSelected = (ids: string[]) => {
    props.onSettingChange({
      id: props.id,
      useMapWidgetIds: ids
    })
  }

  const updateTimelineBackgroundColor = (color: string) => {
    props.onSettingChange({
      id: props.id,
      config: props.config.set('timelineBackgroundColor', color)
    })
  }
  const updateTimelineFontColor = (color: string) => {
    props.onSettingChange({
      id: props.id,
      config: props.config.set('timelineFontColor', color)
    })
  }

  return (
    <div>
      <SettingSection
        className="data-source-selector-section"
        title={props.intl.formatMessage({
          id: "selectDataSource",
          defaultMessage: defaultI18nMessages.selectDataSource,
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
                selectedFields={props.useDataSources[0].fields || Immutable([props.config.nameField])}
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
                selectedFields={props.useDataSources[0].fields || Immutable([props.config.startDateField])}
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
                selectedFields={props.useDataSources[0].fields || Immutable([props.config.endDateField])}
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
              id: "selecMap",
              defaultMessage: defaultI18nMessages.selectMap,
            })}>
            <SettingRow>
              <MapWidgetSelector
                onSelect={onMapWidgetSelected}
                useMapWidgetIds={props.useMapWidgetIds}
              />
            </SettingRow>
          </SettingSection>
          <SettingSection
            className="data-source-selector-section"
            title={props.intl.formatMessage({
              id: "styling",
              defaultMessage: defaultI18nMessages.styling,
            })}>
            <SettingRow>
              <Label
                size="default"
              >
                {props.intl.formatMessage({
                  id: "setBackgroundColor",
                  defaultMessage: defaultI18nMessages.setBackgroundColor,
                })}
              </Label>
              <ColorPicker
                style={{ padding: '4' }} width={30} height={26}
                color={props.config.timelineBackgroundColor}
                onChange={updateTimelineBackgroundColor} />
            </SettingRow>
            <SettingRow>
              <Label
                size="default"
              >
                {props.intl.formatMessage({
                  id: "setBackgroundColor",
                  defaultMessage: defaultI18nMessages.setFontColor,
                })}
              </Label>
              <ColorPicker
                style={{ padding: '4' }} width={30} height={26}
                color={props.config.timelineFontColor}
                onChange={updateTimelineFontColor} />
            </SettingRow>
          </SettingSection>
        </div>
      }
    </div>
  );
}
