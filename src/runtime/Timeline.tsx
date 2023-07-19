/** @jsx jsx */
import { jsx } from "jimu-core";
//@ts-ignore
import * as d3 from "./lib/d3/d3.min.js";
import { useEffect, useRef } from "react";

export default function Timeline({ features }) {
  const canvasRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (canvasRef.current) {
      const svg = d3.create("svg");
      svg.attr("width", 500).attr("height", 20);
      const dataRectangles = svg.selectAll("rect").data(features).enter();
      dataRectangles
        .append("rect")
        .attr("x", (d, i) => i * 70)
        .attr("y", 0)
        .attr("width", 65)
        .attr("height", 20)
        .attr("fill", "#9868ed");
      canvasRef.current.appendChild(svg.node());
    }
  }, [canvasRef]);
  return <div ref={canvasRef}></div>;
}
