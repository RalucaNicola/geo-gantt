/** @jsx jsx */
import { jsx } from "jimu-core";

import { useEffect, useRef } from "react";
import {
  DataSetDataGroup,
  DataSetDataItem,
  Timeline,
} from "vis-timeline/standalone";
import { DataSet } from "vis-data/standalone";

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

export default function TimelineComponent({ records, relatedRecords }) {
  const divRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (divRef.current) {
      const { groups, items } = generateDataSet(records, relatedRecords);
      console.log(groups.getDataSet(), items.getDataSet());

      // Configuration for the Timeline
      const options = {
        orientation: "top",
      };
      const timeline = new Timeline(divRef.current, items, groups, options);
    }
  }, [divRef]);
  return <div ref={divRef}></div>;
}
