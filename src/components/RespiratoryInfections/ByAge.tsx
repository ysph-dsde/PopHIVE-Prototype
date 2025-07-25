import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useData } from "../../context/DataContext";
import { stateList } from "../../constants/geo";
import { DataLoading } from "../shared/DataLoading";

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

interface ByAgeProps {
  disease: "rsv" | "flu" | "covid";
}

export const ByAge = ({ disease }: ByAgeProps) => {
  const { datasets } = useData(); // Get the datasets from DataContext
  const epicDatasetName = "rsv_flu_covid_epic_cosmos_age_state";

  const hospDatasetName = "rsv_hosp_age_respnet"; // Dataset for Hospital data

  const [selectedState, setSelectedState] = useState<string>("New York");
  const [filteredData, setFilteredData] = useState<DataEntry[]>([]);
  const [filteredHospitalData, setFilteredHospitalData] = useState<
    HospitalData[]
  >([]);
  const [useRescaledData, setUseRescaledData] = useState<boolean>(true);

  useEffect(() => {
    if (!datasets[hospDatasetName] || !datasets[epicDatasetName]) return;
    if (selectedState) {
      setFilteredData(
        datasets[epicDatasetName].filter(
          (row) =>
            row.outcome_name === disease.toUpperCase() &&
            row.geography === selectedState,
        ),
      );

      setFilteredHospitalData(
        datasets[hospDatasetName].filter(
          (row: HospitalData) => row.state === selectedState,
        ),
      );
    }
  }, [selectedState, datasets, hospDatasetName]);

  const states = [
    ...new Set(
      datasets[epicDatasetName]?.map((row: DataEntry) => row.geography),
    ),
  ].filter((geo) => stateList.has(geo));

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

  const colorScale = [
    "#440154",
    "#482878",
    "#3e4a89",
    "#31688e",
    "#26828e",
    "#1f9e89",
  ]; // Viridis colors

  // Prepare traces
  const traces = ageOrder
    .filter((level) => filteredData.some((row) => row.age_level === level)) // Filter out 'total' and any missing age levels
    .map((level, index) => {
      const levelData = filteredData.filter((row) => row.age_level === level);
      const hoverTemplate = `Date: %{x}<br>${
        useRescaledData ? "Rescaled" : "Percent"
      } ${disease.toUpperCase()}: %{y}<br>Age: %{text} <extra></extra>`;
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
        line: {
          color: colorScale[index], // Assigning the color from the colorScale based on index
        },
      };
    });

  const hospitalTraces = ageOrder
    .filter((level) => filteredHospitalData.some((row) => row.Level === level)) // Filter out 'total' and any missing levels
    .map((level, index) => {
      const levelData = filteredHospitalData.filter(
        (row) => row.Level === level,
      );
      const hoverTemplate = `Date: %{x}<br>Rescaled RSV: %{y}<br>Age: %{text} <extra></extra>`;
      return {
        x: levelData.map((row) => row.date),
        y: levelData.map((row) => row.scale_age),
        type: "scatter",
        mode: "lines",
        name: level,
        text: levelData.map((row) => row.Level), // Level (age) as text
        hovertemplate: hoverTemplate,
        line: {
          color: colorScale[index], // Assigning the color from the colorScale based on index
        },
      };
    });

  if (!datasets[epicDatasetName] && !datasets[hospDatasetName]) {
    return <DataLoading />;
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
              text: `ED visits for ${disease.toUpperCase()} in ${selectedState}`,
            },
            xaxis: {
              title: "Date",
            },
            yaxis: {
              title: {
                text: useRescaledData
                  ? `Rescaled ED visits for ${disease.toUpperCase()} (Epic Cosmos)`
                  : `Percent of ED visits for ${disease.toUpperCase()} (Epic Cosmos)`,
              },
            },
            legend: { title: { text: "Age group" } },
            autosize: true,
          }}
          config={{ responsive: true }}
          style={{ width: "100%", height: "400px" }}
        />
      )}

      {disease === "rsv" && filteredHospitalData.length > 0 && (
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
          style={{ width: "100%", height: "400px" }}
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
