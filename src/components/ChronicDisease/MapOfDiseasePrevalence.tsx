import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useData } from "../../context/DataContext";
import { stateAbbreviations } from "../../constants/geo";

interface DataEntry {
  geography: string;
  age_level: string;
  outcome_name: string;
  Outcome_value1: number;
}

interface MapOfDiseasePrevalenceProps {
  disease: "obesity" | "diabetes";
}

export const MapOfDiseasePrevalence = ({
  disease,
}: MapOfDiseasePrevalenceProps) => {
  const [data, setData] = useState<DataEntry[]>([]);
  const { datasets } = useData();
  const datasetName = "diabetes_obesity";

  useEffect(() => {
    if (!datasets[datasetName]) return;
    setData(
      datasets[datasetName].filter(
        (row: DataEntry) =>
          row.age_level === "Total" && row.outcome_name === disease,
      ),
    );
  }, [datasets, datasetName]);

  const trace = {
    type: "choropleth",
    locations: data.map((row) => stateAbbreviations[row.geography]),
    z: data.map((row) => (isNaN(row.Outcome_value1) ? 0 : row.Outcome_value1)),
    locationmode: "USA-states",
    colorscale: "Viridis",
    colorbar: {
      title: {
        text: `${
          disease.charAt(0).toUpperCase() + disease.slice(1)
        } Prevalence (%)`,
      },
    },
    text: data.map((row) => {
      const zValue = isNaN(row.Outcome_value1) ? 0 : row.Outcome_value1;
      return `State: ${row.geography}<br>Prevalence: ${zValue.toFixed(1)}%`;
    }),
    hovertemplate: "%{text}<extra></extra>",
    marker: {
      line: {
        color: "white",
        width: 2,
      },
    },
  };

  if (data.length === 0) {
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
          geo: {
            scope: "usa",
          },
          title: {
            text: `${
              disease.charAt(0).toUpperCase() + disease.slice(1)
            } Prevalence by State`,
          },
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "500px" }}
      />
    </Box>
  );
};
