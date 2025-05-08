import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useData } from "../../../context/DataContext";
import { CircularProgress, Typography } from "@mui/material";

interface DataEntry {
  age_level: string;
  Sex: string;
  Year: number;
  Outcome_value1: number;
}

export const NationalSelfHarm = () => {
  const { datasets } = useData(); // Get the datasets from DataContext
  const datasetName = "wisqars_self_harm";

  const [data, setData] = useState<DataEntry[]>([]);

  useEffect(() => {
    if (!datasets[datasetName]) return;
    const rawData = datasets[datasetName];
    const filtered = rawData.filter((d: any) =>
      ["10 to 14", "15 to 19", "20 to 24", "25 to 29"].includes(d.age_level),
    );
    setData(filtered);
  }, [datasets, datasetName]);

  const ageLevels = ["10 to 14", "15 to 19", "20 to 24", "25 to 29"];

  const traces = ageLevels.flatMap((age, idx) => {
    const ageData = data.filter((d) => d.age_level === age);
    const sexes: ("Females" | "Males")[] = ["Females", "Males"];
    return sexes.map((sex) => {
      const group = ageData.filter((d) => d.Sex === sex);
      return {
        x: group.map((d) => d.Year),
        y: group.map((d) => d.Outcome_value1),
        name: sex,
        xaxis: `x${idx + 1}`,
        yaxis: `y${idx + 1}`,
        mode: "lines",
        legendgroup: sex,
        line: {
          color: sex === "Females" ? "#E377C2" : "#17BECF",
          dash: sex === "Females" ? "solid" : "dash",
        },
        showlegend: idx === 0, // only show legend once
        text: group.map(
          (d) =>
            `Year: ${d.Year}<br>Events: ${d.Outcome_value1}<br>Sex: ${d.Sex}`,
        ),
        hovertemplate: "%{text}<extra></extra>",
      };
    });
  });

  const layout = {
    showlegend: true,
    title: { text: "Self harm among youths (CDC/WISQARS)", x: 0.5 },
    margin: { l: 80, r: 40, t: 80, b: 80 },
    annotations: [
      {
        text: "Ages 10 to 14",
        x: 0.5,
        y: 1.1,
        showarrow: false,
        xref: "x domain",
        yref: "y domain",
      },
      {
        text: "Ages 15 to 19",
        x: 0.5,
        y: 1.1,
        showarrow: false,
        xref: "x2 domain",
        yref: "y2 domain",
      },
      {
        text: "Ages 20 to 24",
        x: 0.5,
        y: 1.1,
        showarrow: false,
        xref: "x3 domain",
        yref: "y3 domain",
      },
      {
        text: "Ages 25 to 29",
        x: 0.5,
        y: 1.1,
        showarrow: false,
        xref: "x4 domain",
        yref: "y4 domain",
      },
      {
        text: "Year",
        x: 0.5,
        y: -0.1,
        showarrow: false,
        xref: "paper",
        yref: "paper",
        font: { size: 14 },
      },
      {
        text: "Events/100,000 people",
        x: -0.13,
        y: 0.5,
        showarrow: false,
        textangle: -90,
        xref: "paper",
        yref: "paper",
        font: { size: 14 },
      },
    ],
    grid: { rows: 2, columns: 2, pattern: "independent" },
    xaxis: { domain: [0, 0.45], anchor: "y", showticklabels: false },
    yaxis: { domain: [0.55, 1], anchor: "x", range: [0, 900] },
    xaxis2: { domain: [0.55, 1], anchor: "y2", showticklabels: false },
    yaxis2: {
      domain: [0.55, 1],
      anchor: "x2",
      showticklabels: false,
      range: [0, 900],
    },
    xaxis3: {
      domain: [0, 0.45],
      anchor: "y3",
      title: "",
      showticklabels: true,
    },
    yaxis3: { domain: [0, 0.45], anchor: "x3", range: [0, 900] },
    xaxis4: {
      domain: [0.55, 1],
      anchor: "y4",
      title: "",
      showticklabels: true,
    },
    yaxis4: {
      domain: [0, 0.45],
      anchor: "x4",
      showticklabels: false,
      range: [0, 900],
    },
  };

  if (!datasets[datasetName]) {
    return (
      <>
        <CircularProgress />
        <Typography>Loading data...</Typography>
      </>
    );
  }

  return (
    <Plot
      data={traces}
      layout={layout}
      style={{ width: "90%", height: "700px" }}
    />
  );
};
