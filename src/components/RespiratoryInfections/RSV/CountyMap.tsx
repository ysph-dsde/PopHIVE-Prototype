import { Box } from "@mui/material";
import { useMemo } from "react";
import Plot from "react-plotly.js";
import { useData } from "../../../context/DataContext";

const CountyMap = () => {
  const { datasets, geoJson } = useData();
  const datasetName = "rsv_flu_covid_county_filled_map_nssp";

  const data = useMemo(() => {
    return datasets[datasetName].map((row) => ({
      fips: row.fips ? row.fips.toString().padStart(5, "0") : null,
      state: row.state,
      county: row.county,
      percent_visits_rsv: row.percent_visits_rsv
        ? parseFloat(row.percent_visits_rsv)
        : null,
    }));
  }, [datasets, datasetName]);

  return (
    <Box>
      {geoJson && (
        <Plot
          data={[
            {
              type: "choropleth",
              geojson: geoJson,
              locations: data
                .filter((entry) => entry.percent_visits_rsv !== null)
                .map((entry) => entry.fips),
              z: data
                .filter((entry) => entry.percent_visits_rsv !== null)
                .map((entry) => entry.percent_visits_rsv!),
              colorscale: "Viridis",
              colorbar: { title: { text: "Percent" } },
              text: data
                .filter((entry) => entry.percent_visits_rsv !== null)
                .map(
                  (entry) =>
                    `County: ${entry.county}, ${
                      entry.state
                    }<br>RSV Visits: ${entry.percent_visits_rsv?.toFixed(2)}%`,
                ),
              hoverinfo: "text",
              zmin: 0,
              zmax: 2,
            },
          ]}
          layout={{
            title: { text: "RSV ED visits by jurisdiction 2025-03-22" },
            geo: {
              scope: "usa",
            },
            autosize: true,
            margin: { t: 50, b: 50, l: 50, r: 50 },
          }}
          config={{ responsive: true }}
          style={{ width: "100%", height: "500px" }}
        />
      )}
    </Box>
  );
};

export default CountyMap;
