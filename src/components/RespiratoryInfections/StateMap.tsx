import { Box, CircularProgress, Slider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useData } from "../../context/DataContext";
import { stateAbbreviations } from "../../constants/geo";

interface DataEntry {
  geography: string;
  age_level: string;
  date: string;
  outcome_name: string;
  Outcome_value2: number;
}

interface StateMapProps {
  disease: "rsv" | "flu" | "covid";
}

export const StateMap = ({ disease }: StateMapProps) => {
  const { datasets, loadData } = useData(); // Access data context
  const datasetName = "rsv_flu_covid_epic_cosmos_age_state"; // Name of the dataset we want to use
  const [selectedDate, setSelectedDate] = useState<string>(""); // Date state
  const [filteredData, setFilteredData] = useState<DataEntry[]>([]);
  const [dateRange, setDateRange] = useState<string[]>([]); // Range of dates for the slider

  useEffect(() => {
    if (!datasets[datasetName]) return;
    const data = datasets[datasetName];
    const dates = [...new Set(data.map((row) => row.date))].filter(Boolean);
    setDateRange(dates);
    setSelectedDate(dates[0]); // Default to the first date
  }, [datasets, datasetName, loadData]);

  useEffect(() => {
    if (selectedDate) {
      const filtered = datasets[datasetName]?.filter(
        (row) =>
          row.age_level === "<1 Years" &&
          row.date === selectedDate &&
          row.outcome_name === disease.toUpperCase(),
      );
      setFilteredData(filtered || []);
    }
  }, [selectedDate, datasets, datasetName]);

  const trace = {
    type: "choropleth",
    locations: filteredData.map((row) => stateAbbreviations[row.geography]),
    z: filteredData.map((row) => {
      // Check for null, undefined, or any falsy value and set to 0 if found
      if (isNaN(row.Outcome_value2)) {
        return 0;
      }
      return row.Outcome_value2;
    }),
    locationmode: "USA-states", // States for US map
    colorscale: "Viridis",
    colorbar: {
      title: { text: `${disease.toUpperCase()} % in ED visits` },
    },
    text: filteredData.map((row, index) => {
      // Use the same logic applied to 'z' for the text values
      const zValue: Number = isNaN(row.Outcome_value2) ? 0 : row.Outcome_value2; // Get the z value for the current index
      return `State: ${
        row.geography
      }<br>Percent ${disease.toUpperCase()}: ${zValue.toFixed(2)}%`;
    }),
    hovertemplate: "%{text}<extra></extra>",
    zmin: 0,
    zmax: 10,
    marker: {
      line: {
        color: "white", // State line color
        width: 2, // State line width in pixels
      },
    },
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
      <Plot
        data={[trace]}
        layout={{
          geo: {
            scope: "usa",
            autosize: true,
            margin: { t: 50, b: 50, l: 50, r: 50 },
          },
          title: {
            text: `${disease.toUpperCase()} ED Visit Percentage (< 1 year old) on ${selectedDate}`,
          },
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "500px" }}
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
