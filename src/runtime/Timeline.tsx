/** @jsx jsx */
import { jsx } from "jimu-core";
//@ts-ignore
import * as d3 from "./lib/d3/d3.min.js";

export default function Timeline({ relatedRecords, id }) {
  if (relatedRecords.hasOwnProperty(id)) {
    const features = relatedRecords[id].features;
    return (
      <p>
        {features.map((feature) => {
          return (
            <span>
              {feature.attributes.StartDate} - {feature.attributes.EndDate}
            </span>
          );
        })}
      </p>
    );
  } else {
    return null;
  }
}
