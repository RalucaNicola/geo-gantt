/** @jsx jsx */
import { jsx } from "jimu-core";

import { useEffect, useRef } from "react";
import {
  DataSetDataGroup,
  DataSetDataItem,
  Timeline,
} from "vis-timeline/standalone";
import { DataSet } from "vis-data/standalone";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import React from "react";

enum TimelineOptionsZoomKey {
  ctrlKey = "ctrlKey",
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function generateDataSet(records, fields, selectedId) {
  const groups = new DataSet() as DataSetDataGroup;
  const items = new DataSet() as DataSetDataItem;
  records.forEach((r) => {
    const name = r.getFieldValue(fields.nameField);
    const start = r.getFieldValue(fields.startDateField);
    const end = r.getFieldValue(fields.endDateField);
    const id = r.getId();
    const group = {
      id: id, content: name,
      selected: selectedId ? id === selectedId : false
    };
    groups.add(group);
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const timePeriod = `${new Intl.DateTimeFormat('en-US').format(startDate)} - ${new Intl.DateTimeFormat('en-US').format(endDate)}`
      items.add({
        id,
        group: id,
        content: timePeriod,
        start: new Date(start),
        end: new Date(end),
        title: timePeriod
      });
    }

  });
  return { items, groups };
}

export default function TimelineComponent({
  records,
  onGroupSelected,
  fields,
  selectedId,
  theme, backgroundColor, fontColor
}) {
  const [timeline, setTimeline] = React.useState<Timeline>(null);
  const [style, setStyle] = React.useState<string>("");
  const divRef = useRef<HTMLDivElement>();

  const Button = styled.button`
    border: 2px solid transparent;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0 3px;
    background-color: transparent;
    color: ${theme.body.color};
    text-align: left;
    max-width: 150px;
    &:hover,
    &.selected {
      border-color: ${theme.colors.primary}
    }
  `;

  useEffect(() => {
    if (timeline) {
      setStyle(`
      .vis-item {
        background-color: ${backgroundColor};
        border-color: ${backgroundColor};
        color: ${fontColor};
      };
      .vis-text {
        color: ${theme.body.color};
      };
      .group-button {
        color: ${theme.body.color};
      }
      .group-button:hover, .selected{
        border-color: ${theme.colors.primary}
      }
      `);
    }
  }, [timeline, theme, backgroundColor, fontColor])

  useEffect(() => {
    if (timeline) {
      const selectedElement = document.querySelector("button.selected") as HTMLButtonElement;
      if (selectedElement && selectedElement.dataset.id !== selectedId) {
        selectedElement.classList.remove("selected");
      }
      if (selectedId) {
        const newSelectedElement = document.querySelector(`button[data-id="${selectedId}"]`) as HTMLButtonElement;
        if (newSelectedElement) {
          newSelectedElement.classList.add("selected");
          if (!isInViewport(newSelectedElement)) {
            newSelectedElement.scrollIntoView();
          }
        }
      }

    }
  }, [timeline, selectedId]);

  useEffect(() => {
    if (divRef.current) {
      const { groups, items } = generateDataSet(records, fields, selectedId);
      const options = {
        orientation: "top",
        verticalScroll: true,
        zoomKey: TimelineOptionsZoomKey.ctrlKey,
        stack: true,
        maxHeight: "100%",
        selectable: false,
        tooltip: {
          followMouse: true
        },
        showCurrentTime: false,
        groupTemplate: (data, element) => {
          ReactDOM.render(<Button className={data.selected ? "group-button selected" : "group-button"} data-id={data.id}>{data.content}</Button>, element);
          return null;
        }
      };
      const timeline = new Timeline(divRef.current, items, groups, options);
      setTimeline(timeline);

      const selectElement = (evt) => {
        if (evt.what && evt.what === "group-label") {
          onGroupSelected(evt.group);
        }
      }

      timeline.on("click", selectElement);
      return () => {
        timeline.off("click", selectElement);
      }
    }
  }, [divRef]);
  return <div style={{ height: "100%" }} ref={divRef} css={style}></div>;
}
