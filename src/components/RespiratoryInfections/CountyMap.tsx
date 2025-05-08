import { Box, CircularProgress, Typography } from "@mui/material";
import { useMemo } from "react";
import Plot from "react-plotly.js";
import { useData } from "../../context/DataContext";

interface CountyMapProps {
  disease: "rsv" | "flu" | "covid";
}

const diseaseFieldMap: Record<string, string> = {
  rsv: "percent_visits_rsv",
  flu: "percent_visits_flu",
  covid: "percent_visits_covid",
};

const CountyMap = ({ disease }: CountyMapProps) => {
  const { datasets, geoJson } = useData();
  const datasetName = "rsv_flu_covid_county_filled_map_nssp";

  const data = useMemo(() => {
    if (!datasets[datasetName]) return [];
    const fieldName = diseaseFieldMap[disease];

    return datasets[datasetName].map((row) => ({
      fips: row.fips ? row.fips.toString().padStart(5, "0") : null,
      state: row.state,
      county: row.county,
      percent: row[fieldName] ? parseFloat(row[fieldName]) : null,
    }));
  }, [datasets, datasetName]);

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
      {geoJson && (
        <Plot
          data={[
            {
              type: "choropleth",
              geojson: geoJson,
              locations: data
                .filter((entry) => entry.percent !== null)
                .map((entry) => entry.fips),
              z: data
                .filter((entry) => entry.percent !== null)
                .map((entry) => entry.percent!),
              colorscale: "Viridis",
              colorbar: { title: { text: "Percent" } },
              text: data
                .filter((entry) => entry.percent !== null)
                .map(
                  (entry) =>
                    `County: ${entry.county}, ${
                      entry.state
                    }<br>${disease.toUpperCase()} Visits: ${entry.percent?.toFixed(
                      2,
                    )}%`,
                ),
              hoverinfo: "text",
              zmin: 0,
              zmax: 2,
            },
          ]}
          layout={{
            title: {
              text: `${disease.toUpperCase()} ED visits by jurisdiction 2025-03-22`,
            },
            geo: {
              scope: "usa",
            },
            autosize: true,
            margin: { t: 50, b: 50, l: 50, r: 50 },
          }}
          config={{ responsive: true }}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </Box>
  );
};

export default CountyMap;
