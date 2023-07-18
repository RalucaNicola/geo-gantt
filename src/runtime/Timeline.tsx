/** @jsx jsx */
import { jsx } from "jimu-core";
import { useEffect, useState } from "react";

export default function Timeline({ layer, id }) {
  const [records, setRecords] = useState([]);
  const relationshipId = layer.relationships[0].id;
  const relationshipQuery = {
    objectIds: [id], // Object ID of the related record
    outFields: ["*"], // Specify the fields you want to retrieve
    relationshipId: relationshipId, // Relationship ID or name of the related table
  };

  useEffect(() => {
    layer.queryRelatedFeatures(relationshipQuery).then((results) => {
      console.log(results);
      if (results.hasOwnProperty(id)) {
        setRecords(results[id].features);
      }
    });
  }, []);

  return (
    <p>
      {records.map((record) => {
        return (
          <span>
            {record.attributes.StartDate} - {record.attributes.EndDate}
          </span>
        );
      })}
    </p>
  );
}
