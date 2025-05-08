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
import { useData } from "../../../context/DataContext";

interface DataEntry {
  level: string;
  x: string;
  scaled_cases: number;
  epiyr: number;
  epiwk: number;
  mmwrweek_end: string;
}

export const PositiveTests = () => {
  const { datasets } = useData(); // Get the datasets from DataContext
  const datasetName = "rsv_ts_nrevss_test_rsv"; // Dataset name in DataContext
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [filteredData, setFilteredData] = useState<DataEntry[]>([]);

  useEffect(() => {
    if (!datasets[datasetName]) return;

    // Set default region when data is loaded
    setSelectedRegion("CT,ME,MA,NH,RI,VT");
  }, [datasets, datasetName]);

  useEffect(() => {
    if (!datasets[datasetName]) return;

    if (selectedRegion && datasets[datasetName]) {
      // Filter data based on selected region
      setFilteredData(
        datasets[datasetName].filter((row) => row.x === selectedRegion),
      );
    }
  }, [selectedRegion, datasets, datasetName]);

  const regions = [...new Set(datasets[datasetName]?.map((row) => row.x))];

  const traceData = [...new Set(filteredData.map((row) => row.epiyr))];

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
        <InputLabel>Region</InputLabel>
        <Select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          label="Region"
        >
          {regions.map((region, index) => (
            <MenuItem
              key={index}
              value={region}
            >
              {region}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedRegion && (
        <Plot
          data={traceData.map((epiyr, index) => ({
            x: filteredData
              .filter((row) => row.epiyr === epiyr)
              .map((row) => row.epiwk),
            y: filteredData
              .filter((row) => row.epiyr === epiyr)
              .map((row) => row.scaled_cases),
            customdata: filteredData
              .filter((row) => row.epiyr === epiyr)
              .map((row) => [row.mmwrweek_end]),
            type: "scatter",
            mode: "lines",
            name: `${epiyr}`,
            hovertemplate:
              "epiwk: %{x}<br>Scaled cases: %{y}<br>Week ending in %{customdata}<extra></extra>",
          }))}
          layout={{
            xaxis: {
              title: { text: "Weeks since July" },
            },
            yaxis: {
              title: { text: "RSV positive tests" },
            },
            autosize: true,
            legend: {
              title: {
                text: "Season starting:",
              },
            },
          }}
          config={{ responsive: true }}
          style={{ width: "100%", height: "500px" }}
        />
      )}

      <Typography
        variant="caption"
        sx={{ marginTop: "1rem" }}
      >
        These data come from the NREVSS surveillance system, which is comprised
        of laboratories around the US.
      </Typography>
    </Box>
  );
};