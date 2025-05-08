import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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

export const UptakeByState = () => {
  const [data, setData] = useState<any[]>([]);
  const [filtered, setFilteredData] = useState<any[]>([]);
  const [selectedAge, setSelectedAge] = useState("24 Months");

  useEffect(() => {
    fetch("/vax_age_nis.csv")
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, {
          header: true,
          dynamicTyping: true,
        });
        setData(parsed.data);
      });
  }, []);

  useEffect(() => {
    const filtered = data.filter(
      (d) =>
        d.age === selectedAge &&
        d.birth_year === 2021 &&
        stateList.includes(d.Geography) &&
        d.Outcome_value1 != null,
    );
    setFilteredData(filtered);
  }, [data, selectedAge]);

  const yLabels = [
    ...new Set(
      filtered.map((d) => `${d.Vaccine} ${d.Dose ? d.Dose : ""}`.trim()),
    ),
  ].sort();

  const labelIndexMap = Object.fromEntries(
    yLabels.map((label, idx) => [label, idx]),
  );

  const jitterAmount = 0.3;

  const traces = [
    {
      x: filtered.map((d) => d.Outcome_value1),
      y: filtered.map((d) => {
        const base = `${d.Vaccine} ${d.Dose ? d.Dose : ""}`.trim();
        const jitter = (Math.random() - 0.5) * jitterAmount;
        return labelIndexMap[base] + jitter;
      }),
      mode: "markers",
      type: "scatter",
      marker: {
        color: filtered.map((d) => d.Outcome_value1),
        colorscale: "Viridis",
        reversescale: true,
        showscale: false,
        size: 8,
        opacity: 0.7,
      },
      text: filtered.map(
        (d) =>
          `${d.Geography}<br>${d.Vaccine} ${d.Dose ? d.Dose : ""}<br>Age: ${
            d.age
          }<br>${d.Outcome_value1}%`,
      ),
      hovertemplate: "%{text}<extra></extra>",
    },
  ];

  return (
    <Box>
      <FormControl
        fullWidth
        sx={{ mb: 2 }}
      >
        <InputLabel>Age</InputLabel>
        <Select
          value={selectedAge}
          label="Age"
          onChange={(e) => setSelectedAge(e.target.value)}
        >
          {["13 Months", "24 Months", "35 Months"].map((age) => (
            <MenuItem
              key={age}
              value={age}
            >
              {age}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Plot
        data={traces}
        layout={{
          title: { text: `Vaccination Rates by State, ${selectedAge}` },
          xaxis: { title: { text: "Vaccination Rate (%)" } },
          yaxis: {
            tickmode: "array",
            tickvals: yLabels.map((_, idx) => idx),
            ticktext: yLabels,
            automargin: true,
            zeroline: false,
          },
          showlegend: false,
          height: 500,
        }}
        config={{ responsive: true }}
        style={{ width: "100%" }}
      />
    </Box>
  );
};

export default UptakeByState;
