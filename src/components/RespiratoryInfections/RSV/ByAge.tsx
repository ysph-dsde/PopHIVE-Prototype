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

interface HospitalData {
  state: string;
  date: string;
  hosp_rate: number;
  Level: string;
  hosp_rate_3m: number;
  scale_age: number;
}

const ByAge = () => {
  const [data, setData] = useState<DataEntry[]>([]);
  const [hospitalData, setHospitalData] = useState<HospitalData[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [filteredData, setFilteredData] = useState<DataEntry[]>([]);
  const [filteredHospitalData, setFilteredHospitalData] = useState<
    HospitalData[]
  >([]);
  const [useRescaledData, setUseRescaledData] = useState<boolean>(false);

  useEffect(() => {
    fetch("/epic_ed_combo_rsv_flu_covid.csv")
      .then((response) => response.text())
      .then((csvData) => {
        const parsedData: DataEntry[] = Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
        }).data;
        setData(parsedData);
        setSelectedState("New York");
      });
  }, []);

  useEffect(() => {
    fetch("/h1.age_rsv_hosp.csv")
      .then((response) => response.text())
      .then((csvData) => {
        const parsedHospitalData: HospitalData[] = Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
        }).data;
        setHospitalData(parsedHospitalData);
      });
  }, []);

  useEffect(() => {
    if (selectedState) {
      setFilteredData(data.filter((row) => row.geography === selectedState));
      setFilteredHospitalData(
        hospitalData.filter((row) => row.state === selectedState),
      );
    }
  }, [selectedState, data, hospitalData]);

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

  const states = [...new Set(data.map((row) => row.geography))].filter((geo) =>
    US_STATES.has(geo),
  );

  const toggleRescale = () => {
    setUseRescaledData(!useRescaledData);
  };

  // Prepare traces
  const traces = [...new Set(filteredData.map((row) => row.Level))].map(
    (level) => {
      const levelData = filteredData.filter((row) => row.Level === level);
      const hoverTemplate = useRescaledData
        ? "Date: %{x}<br>Rescaled RSV: %{y}<br>Age: %{text} <extra></extra>"
        : "Date: %{x}<br>Percent RSV: %{y}<br>Age: %{text} <extra></extra>";
      return {
        x: levelData.map((row) => row.date),
        y: levelData.map((row) =>
          useRescaledData ? row.ED_epic_scale_RSV : row.pct_RSV_ED_epic,
        ),
        type: "scatter",
        mode: "lines",
        name: level,
        text: levelData.map((row) => row.Level), // Level (age) as text
        hovertemplate: hoverTemplate,
      };
    },
  );

  const hospitalTraces = [
    ...new Set(filteredHospitalData.map((row) => row.Level)),
  ].map((level) => {
    const levelData = filteredHospitalData.filter((row) => row.Level === level);
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
