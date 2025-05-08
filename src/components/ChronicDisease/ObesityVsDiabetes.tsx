import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";

interface DataEntry {
  geography: string;
  age_level: string;
  outcome_name: string;
  Outcome_value1: number;
}

const US_STATES = new Set([
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]);

export const ObesityVsDiabetes = () => {
  const [obesityData, setObesityData] = useState<Record<string, number>>({});
  const [diabetesData, setDiabetesData] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/diabetes_obesity.csv")
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, {
          header: true,
          dynamicTyping: true,
        });
        const data = parsed.data as DataEntry[];

        const isState = (geo: string): boolean => US_STATES.has(geo);

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
      });
  }, []);

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
    return (
      <>
        <CircularProgress />
        <Typography>Loading data...</Typography>
      </>
    );
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
        style={{ width: "100%", height: "60vh" }}
      />
    </Box>
  );
};
