import {
  Box,
  Button,
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
  geography: string;
  age_level: string;
  date: string;
  Outcome_value2: number;
  Outcome_value3: number;
  outcome_name: string;
}

interface HospitalData {
  state: string;
  date: string;
  hosp_rate: number;
  Level: string;
  hosp_rate_3m: number;
  scale_age: number;
}

const ByAge = () => {
  const { datasets } = useData(); // Get the datasets from DataContext
  const rsvDatasetName = "rsv_flu_covid_epic_cosmos_age_state"; // Dataset for RSV data
  const hospDatasetName = "rsv_hosp_age_respnet"; // Dataset for Hospital data

  const [selectedState, setSelectedState] = useState<string>("New York");
  const [rsvData, setRsvData] = useState<DataEntry[]>([]);
  const [filteredData, setFilteredData] = useState<DataEntry[]>([]);
  const [filteredHospitalData, setFilteredHospitalData] = useState<
    HospitalData[]
  >([]);
  const [useRescaledData, setUseRescaledData] = useState<boolean>(true);

  useEffect(() => {
    setRsvData(
      datasets[rsvDatasetName].filter((row) => row.outcome_name === "RSV"),
    );
  }, [datasets]);

  useEffect(() => {
    if (selectedState) {
      setFilteredData(rsvData.filter((row) => row.geography === selectedState));

      setFilteredHospitalData(
        datasets[hospDatasetName].filter(
          (row: HospitalData) => row.state === selectedState,
        ),
      );
    }
  }, [selectedState, datasets, rsvDatasetName, hospDatasetName, rsvData]);

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

  const states = [
    ...new Set(
      datasets[rsvDatasetName]?.map((row: DataEntry) => row.geography),
    ),
  ].filter((geo) => US_STATES.has(geo));

  const toggleRescale = () => {
    setUseRescaledData(!useRescaledData);
  };

  // Define the custom order for age groups
  const ageOrder = [
    "<1 Years",
    "1-4 Years",
    "5-17 Years",
    "18-49 Years",
    "50-64 Years",
    "65+ Years",
  ];

  // Prepare traces
  const traces = ageOrder
    .filter((level) => filteredData.some((row) => row.age_level === level)) // Filter out 'total' and any missing age levels
    .map((level) => {
      const levelData = filteredData.filter((row) => row.age_level === level);
      const hoverTemplate = useRescaledData
        ? "Date: %{x}<br>Rescaled RSV: %{y}<br>Age: %{text} <extra></extra>"
        : "Date: %{x}<br>Percent RSV: %{y}<br>Age: %{text} <extra></extra>";
      return {
        x: levelData.map((row) => row.date),
        y: levelData.map((row) =>
          useRescaledData ? row.Outcome_value3 : row.Outcome_value2,
        ),
        type: "scatter",
        mode: "lines",
        name: level,
        text: levelData.map((row) => row.age_level), // Level (age) as text
        hovertemplate: hoverTemplate,
      };
    });

  const hospitalTraces = ageOrder
    .filter((level) => filteredHospitalData.some((row) => row.Level === level)) // Filter out 'total' and any missing levels
    .map((level) => {
      const levelData = filteredHospitalData.filter(
        (row) => row.Level === level,
      );
      const hoverTemplate =
        "Date: %{x}<br>Rescaled RSV: %{y}<br>Age: %{text} <extra></extra>";
      return {
        x: levelData.map((row) => row.date),
        y: levelData.map((row) => row.scale_age),
        type: "scatter",
        mode: "lines",
        name: level,
        text: levelData.map((row) => row.Level), // Level (age) as text
        hovertemplate: hoverTemplate,
      };
    });

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel>State</InputLabel>
        <Select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          label="State"
        >
          {states.map((state) => (
            <MenuItem
              key={state}
              value={state}
            >
              {state}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        onClick={toggleRescale}
        sx={{ marginTop: "1rem" }}
      >
        {useRescaledData ? "Show Percent" : "Show Rescaled"}
      </Button>

      {selectedState && (
        <Plot
          data={traces}
          layout={{
            title: {
              text: `ED visits for RSV in ${selectedState}`,
            },
            xaxis: {
              title: "Date",
            },
            yaxis: {
              title: {
                text: useRescaledData
                  ? "Rescaled ED visits for RSV (Epic Cosmos)"
                  : "Percent of ED visits for RSV (Epic Cosmos)",
              },
            },
            legend: { title: { text: "Age group" } },
            autosize: true,
          }}
          config={{ responsive: true }}
          style={{ width: "100%", height: "600px" }}
        />
      )}

      {filteredHospitalData.length > 0 && (
        <Plot
          data={hospitalTraces}
          layout={{
            title: { text: `${selectedState} CDC hospital surveillance` },
            xaxis: {
              title: { text: "Date" },
            },
            yaxis: {
              title: { text: "RSV activity (CDC surveillance)" },
            },
            legend: { title: { text: "Age group" } },
            autosize: true,
          }}
          config={{ responsive: true }}
          style={{ width: "100%", height: "600px" }}
        />
      )}

      <Typography
        variant="caption"
        sx={{ marginTop: "1rem" }}
      >
        The hospitalization data comes from the RSV-NET, a CDC-supported network
        of sites around the US that tracks hospitalizations from RSV, influenza,
        and COVID-19. Data are smoothed with a 3 week average for vizualization.
      </Typography>
    </Box>
  );
};

export default ByAge;
