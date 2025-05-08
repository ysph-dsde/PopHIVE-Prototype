import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useData } from "../../context/DataContext";
import { stateList } from "../../constants/geo";

interface DataEntry {
  geography: string;
  outcome_label1: string;
  date: string;
  Outcome_value1: number;
  source: string;
}

interface TrendPlotProps {
  datasetName: string;
  labelMapping: Record<string, string>;
  yAxisTitle: string;
  description: React.ReactNode;
}

export const TrendsPlot = ({
  datasetName,
  labelMapping,
  yAxisTitle,
  description,
}: TrendPlotProps) => {
  const { datasets } = useData();
  const [selectedGeography, setSelectedGeography] = useState("");
  const [filteredData, setFilteredData] = useState<DataEntry[]>([]);

  useEffect(() => {
    // Set the selected geography once the data is loaded
    setSelectedGeography("New York");
  }, [datasets, datasetName]);

  // Filter data based on selected geography
  useEffect(() => {
    if (selectedGeography && datasets[datasetName]) {
      setFilteredData(
        datasets[datasetName].filter(
          (row) => row.geography === selectedGeography,
        ),
      );
    }
  }, [selectedGeography, datasets, datasetName]);

  const geographies = [
    ...new Set(datasets[datasetName]?.map((row) => row.geography) || []),
  ].filter((geo) => stateList.has(geo));
  const outcomeLabels = [
    ...new Set(datasets[datasetName]?.map((row) => row.outcome_label1) || []),
  ];

  const maxValues: Record<string, number> = {};
  const validData = filteredData.filter(
    (row) => row.outcome_label1 && !isNaN(row.Outcome_value1), // Only keep valid data
  );
  outcomeLabels.forEach((label) => {
    // Get all the values for the current label
    const values = validData
      .filter((row) => row.outcome_label1 === label)
      .map((row) => row.Outcome_value1);

    // Calculate the maximum value for the current label
    // Use 1 as a fallback if no valid values are found for that label
    maxValues[label] = values.length > 0 ? Math.max(...values) : 1;
  });

  const colorList = [
    "#8dd3c7",
    "#ffffb3",
    "#bebada",
    "#fb8072",
    "#80b1d3",
    "#fdb462",
    "#b3de69",
    "#fccde5",
    "#d9d9d9",
    "#bc80bd",
  ];

  const lineStyles = [
    "solid",
    "dash",
    "dot",
    "dashdot",
    "longdash",
    "longdashdot",
  ];

  if (!datasets[datasetName]) {
    return (
      <>
        <CircularProgress />
        <Typography>Loading data...</Typography>
      </>
    );
  }

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel>State</InputLabel>
        <Select
          value={selectedGeography}
          onChange={(e) => setSelectedGeography(e.target.value)}
          label="Age"
        >
          {geographies.map((geo) => (
            <MenuItem
              key={geo}
              value={geo}
            >
              {geo}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedGeography && (
        <Plot
          data={outcomeLabels
            .sort((a, b) => {
              const labelA = labelMapping[a];
              const labelB = labelMapping[b];
              return labelA.localeCompare(labelB);
            })
            .map((label, index) => {
              const filtered = filteredData.filter(
                (row) => row.outcome_label1 === label,
              );
              return {
                x: filtered.map((row) => row.date),
                y: filtered.map(
                  (row) => (row.Outcome_value1 / maxValues[label]) * 100,
                ), // Scale to 0-100
                customdata: filteredData
                  .filter((row) => row.outcome_label1 === label)
                  .map((row) => [
                    row.geography,
                    row.source,
                    row.outcome_label1,
                    row.Outcome_value1,
                  ]),
                type: "scatter",
                mode: "lines",
                name: labelMapping[label],
                line: {
                  // color: colorList[index % colorList.length],
                  dash: lineStyles[index % lineStyles.length],
                },
                hovertemplate:
                  "State: %{customdata[0]}<br>Data source: %{customdata[1]}<br>Outcome: %{customdata[2]}<br>Value: %{customdata[3]}<br>Date: %{x} <extra></extra>",
              };
            })}
          layout={{
            xaxis: {
              title: {
                text: "Date",
              },
            },
            yaxis: {
              title: {
                text: yAxisTitle,
              },
            },
            autosize: true,
          }}
          config={{ responsive: true }}
          style={{ width: "100%", height: "500px" }}
        />
      )}
      <Typography
        variant="caption"
        sx={{ marginTop: "1rem" }}
      >
        {description}
      </Typography>
    </Box>
  );
};
