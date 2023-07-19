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

const Button = styled.button`
  border: none;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0 3px;
  &:hover,
  &.selected {
    background-color: #cfb6f0;
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
  selectedId,
}) {
  const divRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (divRef.current) {
      const { groups, items } = generateDataSet(records, relatedRecords);
      const options = {
        orientation: "top",
        verticalScroll: true,
        zoomKey: "ctrlKey",
        stack: true,
        maxHeight: "100%",
        groupTemplate: (data, element) => {
          ReactDOM.render(
            <Button
              onClick={(evt) => {
                onGroupSelected(data.id);
              }}
            >
              {data.content}
            </Button>,
            element
          );
          return null;
        },
      };

      new Timeline(divRef.current, items, groups, options);
    }
  }, [divRef]);
  return <div style={{ height: "100%" }} ref={divRef}></div>;
}
