import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useData } from "../../../context/DataContext";
import { DataLoading } from "../../shared/DataLoading";

interface DataEntry {
  dataset: string;
  year_quarter: string;
  level: string;
  count: number;
}

export const OpioidOverdosePlot = () => {
  const { datasets } = useData(); // Get the datasets from DataContext
  const datasetName = "opioid_time_series";
  const [data, setData] = useState<any[] | null>(null);

  const [timePoints, setTimePoints] = useState<string[]>([]);

  useEffect(() => {
    if (!datasets[datasetName]) return;

    // Extract unique sorted time points
    const timePoints = [
      ...new Set(datasets[datasetName].map((d) => d.year_quarter)),
    ].sort();

    setTimePoints(timePoints);

    // Generate traces
    const generateTraces = (filteredData: any[], dataset: string) => {
      const levels = ["Male", "Female"];
      const isAHRQ = dataset === "AHRQ"; // Check which dataset
      const COLORS = ["#286dc0", "#00356b"]; // Colors for Male and Female

      return levels.map((level, i) => {
        const levelData = filteredData.filter((d) => d.level === level);
        return {
          x: timePoints,
          y: timePoints.map((t) => {
            const entry = levelData.find((d) => d.year_quarter === t);
            return entry ? entry.count : null; // Use `null` for missing values
          }),
          type: "scatter",
          mode: "lines",
          name: level,
          line: { color: COLORS[i] },
          xaxis: isAHRQ ? "x1" : "x2",
          yaxis: isAHRQ ? "y1" : "y2",
          legendgroup: level,
          showlegend: isAHRQ, // Show legend only for AHRQ
          hovertemplate: "Quarter: %{x}<br>Count: %{y}",
          connectgaps: false, // Ensure missing data isn't connected
        };
      });
    };

    setData([
      ...generateTraces(
        datasets[datasetName].filter((d: any) => d.dataset === "AHRQ"),
        "AHRQ",
      ),
      ...generateTraces(
        datasets[datasetName].filter((d: any) => d.dataset === "CDC WONDER"),
        "CDC WONDER",
      ),
    ]);
  }, [datasets, datasetName]); // Run once on mount

  const filteredTickVals = timePoints.filter((_, i) => i % 4 === 0);

  if (data === null) {
    return <DataLoading />;
  }

  return (
    <Box>
      <Plot
        data={data}
        layout={{
          title: { text: "National Opioid Overdose Count" },
          grid: { rows: 1, columns: 2, pattern: "independent" },
          colorway: ["red", "green"],
          xaxis: {
            domain: [0, 0.45],
            tickvals: filteredTickVals,
            ticktext: filteredTickVals,
          },
          xaxis2: {
            title: "CDC WONDER",
            domain: [0.55, 1],
            tickvals: filteredTickVals,
            ticktext: filteredTickVals,
          },
          yaxis: {
            title: {
              text: "Count",
              standoff: 15,
            },
            tickformat: ",",
            range: [0, 250000],
          },
          yaxis2: {
            tickformat: ",",
            range: [0, 40000],
          },
          legend: { x: 1, y: 1 },
          annotations: [
            {
              text: "Hospitalization (AHRQ)",
              showarrow: false,
              font: { size: 16 },
              x: 0.5,
              y: 1.1,
              xref: "x domain",
              yref: "y domain",
            },
            {
              text: "Deaths (CDC Wonder)",
              showarrow: false,
              font: { size: 16 },
              x: 0.5,
              y: 1.1,
              xref: "x2 domain",
              yref: "y2 domain",
            },
          ],
        }}
        useResizeHandler
        style={{ width: "100%", height: "500px" }}
      />
    </Box>
  );
};
