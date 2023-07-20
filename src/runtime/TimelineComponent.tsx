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

enum TimelineOptionsZoomKey {
  ctrlKey = "ctrlKey",
}

const Button = styled.button`
  border: none;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0 3px;
  &:hover,
  &.selected {
    background-color: #ccc;
  }
`;

function generateDataSet(records, relatedRecords) {
  const groups = new DataSet() as DataSetDataGroup;
  const items = new DataSet() as DataSetDataItem;
  records.forEach((r) => {
    const name = r.getFieldValue("Name");
    const id = r.getId();
    const group = { id: id, content: name };
    groups.add(group);
    if (relatedRecords.hasOwnProperty(id)) {
      const features = relatedRecords[id].features;
      features.forEach((f) => {
        items.add({
          id: f.attributes.OBJECTID,
          group: id,
          content: f.attributes.Vessel,
          start: new Date(f.attributes.StartDate),
          end: new Date(f.attributes.EndDate),
        });
      });
    }
  });
  return { items, groups };
}

export default function TimelineComponent({
  records,
  relatedRecords,
  onGroupSelected,
}) {
  const divRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (divRef.current) {
      const { groups, items } = generateDataSet(records, relatedRecords);
      const options = {
        orientation: "top",
        verticalScroll: true,
        zoomKey: TimelineOptionsZoomKey.ctrlKey,
        stack: true,
        maxHeight: "100%",
        selectable: false,
        groupTemplate: (data, element) => {
          ReactDOM.render(<Button>{data.content}</Button>, element);
          return null;
        },
      };
      const timeline = new Timeline(divRef.current, items, groups, options);
      timeline.on("click", (evt) => {
        if (evt.what && evt.what === "group-label") {
          document.querySelectorAll(".selected").forEach((el) => {
            el.classList.remove("selected");
          });
          evt.event.target.classList.add("selected");
          onGroupSelected(evt.group);
        }
      });
    }
  }, [divRef]);
  return <div style={{ height: "100%" }} ref={divRef}></div>;
}
