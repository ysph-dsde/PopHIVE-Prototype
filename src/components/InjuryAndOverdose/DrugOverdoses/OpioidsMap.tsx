import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import Plot from "react-plotly.js";
import { useData } from "../../../context/DataContext";

const stateAbbreviations: { [key: string]: string } = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

const abbreviationToState = Object.fromEntries(
  Object.entries(stateAbbreviations).map(([full, abbr]) => [abbr, full]),
);

const US_STATES = Object.values(stateAbbreviations);

interface DataEntry {
  state: string;
  abv: string;
  count: number | null;
}

interface ChoroplethMapProps {
  datasetName: string;
  title: string;
}

const ChoroplethMap = ({ datasetName, title }: ChoroplethMapProps) => {
  const { datasets } = useData(); // Get the datasets from DataContext
  const [data, setData] = useState<DataEntry[]>([]);

  useEffect(() => {
    if (!datasets[datasetName]) return; // Ensure dataset is loaded

    const stateDataMap: Record<string, number> = {};

    datasets[datasetName].forEach((row: any) => {
      const stateAbbreviation = stateAbbreviations[row.state]; // Convert full name to abbreviation
      const count = parseInt(row.count, 10);

      if (stateAbbreviation && !isNaN(count)) {
        stateDataMap[stateAbbreviation] = count;
      }
    });

    const mappedData = US_STATES.map((abv) => ({
      state: abbreviationToState[abv],
      abv: abv,
      count: stateDataMap[abv] ?? null, // Use null for missing values
    }));

    setData(mappedData);
    // });
  }, [datasets, datasetName]);

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
        data={[
          // Main trace for states with valid data
          {
            type: "choropleth",
            locationmode: "USA-states",
            locations: data
              .filter((entry) => entry.count !== null)
              .map((entry) => entry.abv),
            z: data
              .filter((entry) => entry.count !== null)
              .map((entry) => entry.count!),
            colorscale: [
              [0, "#DDDDDD"],
              [0.25, "#C4DDFC"],
              [0.5, "#63AAFF"],
              [0.75, "#286DC0"],
              [1, "#00356B"],
            ],
            colorbar: { title: { text: "Count (2022)" } },
            text: data
              .filter((entry) => entry.count !== null)
              .map(
                (entry) =>
                  `State: ${
                    entry.state
                  }<br>Count: ${entry.count?.toLocaleString()}`,
              ),
            hoverinfo: "text",
          },
          // Separate trace for NA states
          {
            type: "choropleth",
            locationmode: "USA-states",
            locations: data
              .filter((entry) => entry.count === null)
              .map((entry) => entry.abv),
            z: data.filter((entry) => entry.count === null).map(() => -1), // Assign -1 for NA states
            colorscale: [
              [0, "gray"],
              [1, "gray"],
            ], // Gray color for NA
            showscale: false, // Hide colorbar for NA states
            text: data
              .filter((entry) => entry.count === null)
              .map((entry) => `State: ${entry.state}<br>Count: NA`),
            hoverinfo: "text",
          },
        ]}
        layout={{
          title: { text: title },
          geo: { scope: "usa" },
          autosize: true,
          margin: { t: 50, b: 50, l: 50, r: 50 },
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "300px" }}
      />
    </Box>
  );
};

export default ChoroplethMap;
