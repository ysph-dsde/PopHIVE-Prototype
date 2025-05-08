import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import Plot from "react-plotly.js";
import { useEffect, useState } from "react";
import { useData } from "../../../context/DataContext";

interface DataEntry {
  date: string;
  state: string;
  naloxone_search_12m: number;
}

interface VolumeEntry {
  date: string;
  volume: number;
}

export const NaloxoneSearch = () => {
  const { datasets } = useData(); // Get the datasets from DataContext
  const datasetName = "OD_search_state_recent12m";
  const [data, setData] = useState<Record<string, VolumeEntry[]>>({});
  const [selectedState, setSelectedState] = useState<string>("New York");

  useEffect(() => {
    // Filter and process the data
    const filtered = datasets[datasetName].filter(
      (row: any) => row.date >= "2015-01-01" && row.naloxone_search_12m != null,
    );

    const grouped: Record<string, VolumeEntry[]> = {};
    filtered.forEach((row: any) => {
      if (!grouped[row.state]) grouped[row.state] = [];
      grouped[row.state].push({
        date: row.date,
        volume: row.naloxone_search_12m,
      });
    });

    // Normalize volume to 0-100 scale per state
    for (const state in grouped) {
      const max = Math.max(...grouped[state].map((d) => d.volume));
      grouped[state] = grouped[state].map((d) => ({
        date: d.date,
        volume: Math.round((d.volume / max) * 100),
      }));
    }

    setData(grouped);
  }, []);

  const states = Object.keys(data).sort();
  const plotData = data[selectedState] || [];

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
      <Autocomplete
        options={states}
        value={selectedState}
        onChange={(_, value) => setSelectedState(value ?? selectedState)}
        isOptionEqualToValue={(option, value) => option === value}
        renderInput={(params) => (
          <TextField
            {...params}
            label="State"
          />
        )}
        sx={{ mb: 2 }}
      />

      <Plot
        data={[
          {
            x: plotData.map((d) => d.date),
            y: plotData.map((d) => d.volume),
            type: "scatter",
            mode: "markers",
            marker: { color: "black", size: 6 },
          },
        ]}
        layout={{
          title: {
            text: `Search volume for "overdose" over previous 12m in ${selectedState}`,
          },
          xaxis: { title: { text: "Date" } },
          yaxis: {
            title: { text: 'Search Volume for "Naloxone"' },
          },
          margin: { t: 40 },
          height: 450,
          showlegend: false,
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "500px" }}
      />
    </Box>
  );
};
