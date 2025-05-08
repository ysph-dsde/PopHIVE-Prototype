import { Autocomplete, Box, TextField } from "@mui/material";
import Plot from "react-plotly.js";
import Papa from "papaparse";
import { useEffect, useState } from "react";

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
  const [data, setData] = useState<Record<string, VolumeEntry[]>>({});
  const [selectedState, setSelectedState] = useState<string>("New York");

  useEffect(() => {
    fetch("/OD_search_state_recent12m.csv")
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, {
          header: true,
          dynamicTyping: true,
        }).data;

        // Filter and process the data
        const filtered = parsed.filter(
          (row: any) =>
            row.date >= "2015-01-01" && row.naloxone_search_12m != null,
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
      });
  }, []);

  const states = Object.keys(data).sort();
  const plotData = data[selectedState] || [];

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
        style={{ width: "100%" }}
      />
    </Box>
  );
};
