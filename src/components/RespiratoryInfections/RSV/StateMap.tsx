import { Box, Slider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import Plot from "react-plotly.js";

interface DataEntry {
  geography: string;
  Level: string;
  date: string;
  N_ED_epic: number;
  N_RSV_ED_epic: number;
  N_flu_ED_epic: number;
  N_covid_ED_epic: number;
  pct_RSV_ED_epic: number;
  pct_flu_ED_epic: number;
  pct_covid_ED_epic: number;
  ED_epic_scale_RSV: number;
  ED_epic_scale_flu: number;
  ED_epic_scale_covid: number;
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

const StateMap = () => {
  const [data, setData] = useState<DataEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(""); // Date state
  const [filteredData, setFilteredData] = useState<DataEntry[]>([]);
  const [dateRange, setDateRange] = useState<string[]>([]); // Range of dates for the slider

  useEffect(() => {
    fetch("/epic_ed_combo_rsv_flu_covid.csv")
      .then((response) => response.text())
      .then((csvData) => {
        const parsedData: DataEntry[] = Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
        }).data;
        setData(parsedData);

        const dates = [...new Set(parsedData.map((row) => row.date))].filter(
          Boolean,
        );
        setDateRange(dates); // Set the dateRange without undefined values
        setSelectedDate(dates[0]); // Default to the first date if available
      });
  }, []);

  useEffect(() => {
    if (selectedDate) {
      // Filter data for Level < 1 year old and the selected date
      const filtered = data.filter(
        (row) => row.Level === "<1 Years" && row.date === selectedDate,
      );
      setFilteredData(filtered);
    }
  }, [selectedDate, data]);

  const trace = {
    type: "choropleth",
    locations: filteredData.map((row) => stateAbbreviations[row.geography]),
    z: filteredData.map((row) => row.pct_RSV_ED_epic),
    locationmode: "USA-states", // States for US map
    colorscale: "Viridis",
    colorbar: {
      title: { text: "RSV % in ED visits" },
    },
    text: filteredData.map(
      (row) =>
        `State: ${row.geography}<br>Percent RSV: ${(
          row.pct_RSV_ED_epic * 1
        ).toFixed(2)}%`,
    ),
    hovertemplate: "%{text}<extra></extra>",
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const newIndex = newValue as number;
    if (newIndex >= 0 && newIndex < dateRange.length) {
      setSelectedDate(dateRange[newIndex]);
    }
  };

  const marks = [
    {
      value: 0,
      label: dateRange[0],
    },
    {
      value: Math.floor(dateRange.length / 4),
      label: dateRange[Math.floor(dateRange.length / 4)],
    },
    {
      value: Math.floor(dateRange.length / 2),
      label: dateRange[Math.floor(dateRange.length / 2)],
    },
    {
      value: Math.floor(dateRange.length * (3 / 4)),
      label: dateRange[Math.floor(dateRange.length * (3 / 4))],
    },
    {
      value: dateRange.length - 1,
      label: dateRange[dateRange.length - 1],
    },
  ];

  return (
    <Box>
      <Plot
        data={[trace]}
        layout={{
          geo: {
            scope: "usa",
            autosize: true,
            margin: { t: 50, b: 50, l: 50, r: 50 },
          },
          title: {
            text: `RSV ED Visit Percentage (< 1 year old) on ${selectedDate}`,
          },
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "600px" }}
      />
      <Typography variant="h6">Date</Typography>
      <Slider
        value={dateRange.indexOf(selectedDate)}
        min={0}
        max={dateRange.length - 1}
        step={1}
        marks={marks}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => dateRange[value as number]}
        onChange={handleSliderChange}
        sx={{ marginTop: "1rem" }}
      />
    </Box>
  );
};

export default StateMap;
