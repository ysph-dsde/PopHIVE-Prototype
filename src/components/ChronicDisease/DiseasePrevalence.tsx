import { Box, Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useData } from "../../context/DataContext";
import { DataLoading } from "../shared/DataLoading";

interface DataEntry {
  geography: string;
  age_level: string;
  outcome_name: string;
  Outcome_value1: number;
}

interface DiseasePrevalenceProps {
  disease: "obesity" | "diabetes";
}

const AGE_ORDER = [
  "<10 Years",
  "10-14 Years",
  "15-19 Years",
  "20-39 Years",
  "40-64 Years",
  "65+ Years",
  "Total",
];

const defaultGeographies = ["United States"];

export const DiseasePrevalence = ({ disease }: DiseasePrevalenceProps) => {
  const [selectedGeographies, setSelectedGeographies] =
    useState<string[]>(defaultGeographies);
  const [allGeographies, setAllGeographies] = useState<string[]>([]);
  const [data, setData] = useState<DataEntry[]>([]);
  const { datasets } = useData();
  const datasetName = "diabetes_obesity";

  useEffect(() => {
    if (!datasets[datasetName]) return;
    const data = datasets[datasetName] as DataEntry[];
    setData(
      data.filter(
        (row: DataEntry) =>
          row.outcome_name === disease && row.Outcome_value1 != null,
      ),
    );
    const geos = Array.from(
      new Set(
        data
          .map((row) => row.geography)
          .filter((g): g is string => typeof g === "string" && g.trim() !== ""),
      ),
    ).sort();
    setAllGeographies(geos);
  }, [datasets, datasetName]);

  const traces = selectedGeographies.map((geo) => {
    const dataForGeo = data.filter((row) => row.geography === geo);

    const ageToValue: Record<string, number | null> = {};
    AGE_ORDER.forEach((age) => {
      const match = dataForGeo.find((row) => row.age_level === age);
      ageToValue[age] = match ? match.Outcome_value1 : null;
    });

    return {
      x: AGE_ORDER,
      y: AGE_ORDER.map((age) => ageToValue[age]),
      mode: "markers",
      name: geo,
      text: AGE_ORDER.map((age) =>
        ageToValue[age] != null
          ? `Age: ${age}<br>Percent: ${ageToValue[age]!.toFixed(
              1,
            )}%<br>Geography: ${geo}`
          : `Age: ${age}<br>No data<br>Geography: ${geo}`,
      ),
      hovertemplate: "%{text}<extra></extra>",
      marker: { size: 10 },
    };
  });

  if (data.length === 0) {
    return <DataLoading />;
  }

  return (
    <Box>
      <Autocomplete
        multiple
        options={allGeographies}
        value={selectedGeographies}
        onChange={(_, value) => setSelectedGeographies(value)}
        isOptionEqualToValue={(option, value) => option === value}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Geography"
          />
        )}
        sx={{ mb: 2 }}
      />

      <Plot
        data={traces}
        layout={{
          title: {
            text: `Percent of population with ${disease} prevalence by state`,
          },
          xaxis: {
            title: { text: "Age" },
            categoryorder: "array",
            categoryarray: AGE_ORDER,
          },
          yaxis: {
            title: { text: `Percent with ${disease}` },
            min: 0,
            zeroline: false,
          },
          showlegend: true,
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "500px" }}
      />
    </Box>
  );
};
