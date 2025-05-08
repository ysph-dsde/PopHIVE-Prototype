import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useData } from "../../context/DataContext";
import Papa from "papaparse";

interface DataEntry {
  geography: string;
  age_level: string;
  outcome_name: string;
  Outcome_value1: number;
}

interface MapOfDiseasePrevalenceProps {
  disease: "obesity" | "diabetes";
}

const stateAbbreviations: Record<string, string> = {
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

export const MapOfDiseasePrevalence = ({
  disease,
}: MapOfDiseasePrevalenceProps) => {
  const [data, setData] = useState<DataEntry[]>([]);

  useEffect(() => {
    fetch("/diabetes_obesity.csv")
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, {
          header: true,
          dynamicTyping: true,
        });
        setData(
          parsed.data.filter(
            (row: DataEntry) =>
              row.age_level === "Total" && row.outcome_name === disease,
          ),
        );
        // setData(parsed.data);
      });
  }, []);

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
        style={{ width: "100%", height: "60vh" }}
      />
    </Box>
  );
};
