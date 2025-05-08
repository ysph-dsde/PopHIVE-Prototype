import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useData } from "../../context/DataContext";
import { stateList } from "../../constants/geo";
import { DataLoading } from "../shared/DataLoading";

interface DataEntry {
  geography: string;
  age_level: string;
  outcome_name: string;
  Outcome_value1: number;
}

export const ObesityVsDiabetes = () => {
  const [obesityData, setObesityData] = useState<Record<string, number>>({});
  const [diabetesData, setDiabetesData] = useState<Record<string, number>>({});
  const { datasets } = useData();
  const datasetName = "diabetes_obesity";

  useEffect(() => {
    if (!datasets[datasetName]) return;
    const data = datasets[datasetName] as DataEntry[];

    const isState = (geo: string): boolean => stateList.has(geo);

    const filtered = data.filter(
      (row) =>
        row.age_level === "Total" &&
        row.Outcome_value1 != null &&
        isState(row.geography),
    );

    const obesity: Record<string, number> = {};
    const diabetes: Record<string, number> = {};

    filtered.forEach((row) => {
      const geo = row.geography;
      if (row.outcome_name === "obesity") {
        obesity[geo] = row.Outcome_value1;
      } else if (row.outcome_name === "diabetes") {
        diabetes[geo] = row.Outcome_value1;
      }
    });

    setObesityData(obesity);
    setDiabetesData(diabetes);
  }, [datasets, datasetName]);

  const sharedStates = Object.keys(obesityData).filter((state) =>
    diabetesData.hasOwnProperty(state),
  );

  const trace = {
    x: sharedStates.map((state) => obesityData[state]),
    y: sharedStates.map((state) => diabetesData[state]),
    mode: "markers",
    type: "scatter",
    marker: { color: "black", size: 8 },
    text: sharedStates.map(
      (state) =>
        `Obesity: ${obesityData[state].toFixed(1)}%<br>Diabetes: ${diabetesData[
          state
        ].toFixed(1)}%<br>${state}`,
    ),
    hovertemplate: "%{text}<extra></extra>",
  };

  if (obesityData.length === 0 || diabetesData.length === 0) {
    return <DataLoading />;
  }

  return (
    <Box>
      <Plot
        data={[trace]}
        layout={{
          title: {
            text: "Comparison of obesity vs diabetes rates by state",
          },
          xaxis: {
            title: { text: "Percent with obesity" },
          },
          yaxis: {
            title: { text: "Percent with diabetes" },
          },
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "500px" }}
      />
    </Box>
  );
};
