import {
  Box,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import Plot from "react-plotly.js";

interface DataEntry {
  geography: string;
  outcome_label1: string;
  date: string;
  Outcome_value1: number;
  source: string;
}

const OverallTrends = () => {
  const [data, setData] = useState<DataEntry[]>([]);
  const [selectedGeography, setSelectedGeography] = useState("");
  const [filteredData, setFilteredData] = useState<DataEntry[]>([]);

  useEffect(() => {
    fetch("/dwh_combined_plot1_long.csv")
      .then((response) => response.text())
      .then((csvData) => {
        const parsedData: DataEntry[] = Papa.parse(csvData, {
          header: true,
          dynamicTyping: true, // Automatically convert numeric values
        }).data;
        setData(parsedData);
        setSelectedGeography("New York");
      });
  }, []);

  useEffect(() => {
    if (selectedGeography) {
      setFilteredData(
        data.filter((row) => row.geography === selectedGeography),
      );
    }
  }, [selectedGeography]);

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

  const geographies = [...new Set(data.map((row) => row.geography))].filter(
    (geo) => US_STATES.has(geo),
  );
  const outcomeLabels = [...new Set(data.map((row) => row.outcome_label1))];

  const maxValues: Record<string, number> = {};
  outcomeLabels.forEach((label) => {
    const values = filteredData
      .filter(
        (row) => row.outcome_label1 === label && !isNaN(row.Outcome_value1),
      )
      .map((row) => row.Outcome_value1);

    maxValues[label] = values.length > 0 ? Math.max(...values, 1) : 1; // Avoid zero division
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

  const labelMapping: Record<string, string> = {
    "ED (N)": "ED visits (Epic cosmos)",
    "Pct of ED visits": "ED visits (CDC/NSSP)",
    "Google Searches 1": "Google 1",
    "Google Searches 2": "Google 2",
    "Waste Water": "Waste Water",
    "Hospitalization Rate": "Hospitalization Rate",
  };

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
            title: selectedGeography,
            xaxis: {
              title: {
                text: "Date",
              },
            },
            yaxis: {
              title: {
                text: "RSV activity (sacled to 100)",
              },
            },
            autosize: true,
          }}
          config={{ responsive: true }}
          style={{ width: "100%", height: "800px" }}
        />
      )}
      <Typography
        variant="caption"
        sx={{ marginTop: "1rem" }}
      >
        Viral levels in the community can be measured in different ways, which
        is important because no measure is perfect. By triangulating data from
        sources like emergency department (ED) visits, hospitalizations, and
        wastewater surveillance, we can get a more complete picture of how and
        when a virus is spreading, which can help you make better-informed
        decisions. Epic data come from the{" "}
        <Link href="https://www.epicresearch.org/about-us">
          Epic Cosmos platform
        </Link>
        . The Google Trends data are obtained from the Google Health Trends API
        (volume of searches for ‘rsv’, subtracting volume of searches for
        category “respiratory syncytial virus vaccine” (Knowledge graph:
        /g/11j30ybfx6) ).
      </Typography>
    </Box>
  );
};

export default OverallTrends;
