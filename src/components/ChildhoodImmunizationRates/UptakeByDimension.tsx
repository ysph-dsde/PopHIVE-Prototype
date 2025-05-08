import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useData } from "../../context/DataContext";

interface DataEntry {
  Vaccine: string;
  Geography: string;
  Dose: string;
  dim1: string;
  Outcome_value1: number;
  age: string;
  birth_year: string;
  Dimension: string;
}

const dimensionLabels: Record<string, Record<string, string>> = {
  Urbanicity: {
    "Living In a Non-MSA": "Rural",
    "Living In a MSA Non-Principal City": "Smaller City",
    "Living In a MSA Principal City": "Larger City",
  },
  Insurance: {
    Uninsured: "Uninsured",
    "Any Medicaid": "Medicaid",
    "Private Insurance Only": "Private",
    Other: "Other",
  },
};

const dimensionDescriptions: Record<string, string> = {
  Urbanicity:
    "Variation in vaccine uptake based on how urban an area is. Uptake in non-urban, smaller urban, larger urban locations.",
  Insurance: "Variation in vaccine uptake rates based on insurance status.",
};

const validVaccineDosePairs = [
  { Vaccine: "≥1 Dose MMR" },
  { Vaccine: "≥1 Dose Varicella" },
  { Vaccine: "DTaP", Dose: "≥4 Doses" },
  { Vaccine: "Hep A", Dose: "≥2 Doses" },
  { Vaccine: "Hep B", Dose: "≥3 Doses" },
  { Vaccine: "Hib", Dose: "Full Series" },
  { Vaccine: "PCV", Dose: "≥4 Doses" },
];

const stateList = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
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
];

interface UptakeByDimensionProps {
  dimension: "Urbanicity" | "Insurance";
}

const dimensionKeyMap: Record<string, string> = {
  Urbanicity: "Urbanicity",
  Insurance: "Insurance Coverage",
};

export const UptakeByDimension = ({ dimension }: UptakeByDimensionProps) => {
  const [data, setData] = useState<DataEntry[]>([]);
  const [selectedVaccine, setSelectedVaccine] = useState("PCV");
  const [filteredData, setFilteredData] = useState<DataEntry[]>([]);
  const { datasets } = useData(); // Get the datasets from DataContext
  const datasetName = "vax_age_nis";

  useEffect(() => {
    if (!datasets[datasetName]) return;

    const cleaned = (datasets[datasetName] as DataEntry[])
      .filter(
        (d: any) =>
          d.birth_year === "2016-2019" &&
          d.dim1 === dimensionKeyMap[dimension] &&
          stateList.includes(d.Geography) &&
          d.Vaccine &&
          d.Outcome_value1 != null &&
          validVaccineDosePairs.some(
            (pair) =>
              pair.Vaccine === d.Vaccine &&
              (!pair.Dose || pair.Dose === d.Dose),
          ),
      )
      .map((d: any) => ({
        ...d,
        Dimension: dimensionLabels[dimension][d.age],
      }));

    setData(cleaned);
    setSelectedVaccine("PCV");
  }, [datasets, datasetName]);

  useEffect(() => {
    setFilteredData(data.filter((d) => d.Vaccine === selectedVaccine));
  }, [data, selectedVaccine]);

  const jitterAmount = 0.1;
  const yLabels = Object.values(dimensionLabels[dimension]);

  const traces = [
    {
      x: filteredData.map((d) => d.Outcome_value1),
      y: filteredData.map(
        (d) =>
          yLabels.indexOf(d.Dimension) + (Math.random() - 0.5) * jitterAmount,
      ),
      type: "scatter",
      mode: "markers",
      marker: {
        color: filteredData.map((d) => d.Outcome_value1),
        colorscale: "Viridis",
        reversescale: true,
        showscale: false,
        size: 8,
        opacity: 0.7,
      },
      text: filteredData.map(
        (d) =>
          `${d.Geography}<br>${d.Vaccine} ${d.Dose || ""}<br>${
            d.Outcome_value1
          }%`,
      ),
      hovertemplate: "%{text}<extra></extra>",
    },
  ];

  const vaccineOptions = [
    ...new Set(data.map((d) => d.Vaccine).filter((v) => v)),
  ];

  if (filteredData.length === 0) {
    return (
      <>
        <CircularProgress />
        <Typography>Loading data...</Typography>
      </>
    );
  }

  return (
    <Box>
      <FormControl
        fullWidth
        sx={{ mb: 2 }}
      >
        <InputLabel>Vaccine</InputLabel>
        <Select
          value={selectedVaccine}
          label="Vaccine"
          onChange={(e) => setSelectedVaccine(e.target.value)}
        >
          {vaccineOptions.map((vaccine) => (
            <MenuItem
              key={vaccine}
              value={vaccine}
            >
              {vaccine}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Plot
        data={traces}
        layout={{
          title: "Vaccination Rates by State, 35 months of age",
          xaxis: { title: { text: "Vaccination Rate (%)" } },
          yaxis: {
            tickmode: "array",
            tickvals: Array.from({ length: yLabels.length }, (_, i) => i),
            ticktext: yLabels,
            automargin: true,
            zeroline: false,
          },
          showlegend: false,
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "500px" }}
      />
      <Typography
        variant="caption"
        sx={{ mt: 2 }}
      >
        {dimensionDescriptions[dimension]}
      </Typography>
    </Box>
  );
};
