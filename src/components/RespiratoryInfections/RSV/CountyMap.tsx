// import { Box } from "@mui/material";
// import { useEffect, useState } from "react";
// import Papa from "papaparse";
// import Plot from "react-plotly.js";

// const stateAbbreviations: { [key: string]: string } = {
//   Alabama: "AL",
//   Alaska: "AK",
//   Arizona: "AZ",
//   Arkansas: "AR",
//   California: "CA",
//   Colorado: "CO",
//   Connecticut: "CT",
//   Delaware: "DE",
//   Florida: "FL",
//   Georgia: "GA",
//   Hawaii: "HI",
//   Idaho: "ID",
//   Illinois: "IL",
//   Indiana: "IN",
//   Iowa: "IA",
//   Kansas: "KS",
//   Kentucky: "KY",
//   Louisiana: "LA",
//   Maine: "ME",
//   Maryland: "MD",
//   Massachusetts: "MA",
//   Michigan: "MI",
//   Minnesota: "MN",
//   Mississippi: "MS",
//   Missouri: "MO",
//   Montana: "MT",
//   Nebraska: "NE",
//   Nevada: "NV",
//   "New Hampshire": "NH",
//   "New Jersey": "NJ",
//   "New Mexico": "NM",
//   "New York": "NY",
//   "North Carolina": "NC",
//   "North Dakota": "ND",
//   Ohio: "OH",
//   Oklahoma: "OK",
//   Oregon: "OR",
//   Pennsylvania: "PA",
//   "Rhode Island": "RI",
//   "South Carolina": "SC",
//   "South Dakota": "SD",
//   Tennessee: "TN",
//   Texas: "TX",
//   Utah: "UT",
//   Vermont: "VT",
//   Virginia: "VA",
//   Washington: "WA",
//   "West Virginia": "WV",
//   Wisconsin: "WI",
//   Wyoming: "WY",
// };

// const abbreviationToState = Object.fromEntries(
//   Object.entries(stateAbbreviations).map(([full, abbr]) => [abbr, full]),
// );

// const US_STATES = Object.values(stateAbbreviations);

// interface DataEntry {
//   fips: string;
//   state: string;
//   county: string;
//   percent_visits_rsv: number | null;
// }

// const COUNTY_GEOJSON_URL =
//   "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json";

// const CountyMap = () => {
//   const [data, setData] = useState<DataEntry[]>([]);
//   const [geoJson, setGeoJson] = useState(null);

//   useEffect(() => {
//     fetch(COUNTY_GEOJSON_URL)
//       .then((response) => response.json())
//       .then(setGeoJson);

//     fetch("/rsvByCounty.csv")
//       .then((response) => response.text())
//       .then((csvData) => {
//         const parsedData = Papa.parse(csvData, { header: true }).data;

//         const mappedData: DataEntry[] = parsedData.map((row: any) => ({
//           fips: row.fips ? String(row.fips).padStart(5, "0") : null,
//           state: row.state,
//           county: row.county,
//           percent_visits_rsv: row.percent_visits_rsv
//             ? parseFloat(row.percent_visits_rsv)
//             : null,
//         }));

//         setData(mappedData);
//       });
//   }, []);

//   console.log("Data for choropleth map:", data);

//   return (
//     <Box>
//       <Plot
//         data={[
//           {
//             type: "choropleth",
//             geojson: geoJson,
//             locations: data
//               .filter((entry) => entry.percent_visits_rsv !== null)
//               .map((entry) => entry.fips),
//             z: data
//               .filter((entry) => entry.percent_visits_rsv !== null)
//               .map((entry) => entry.percent_visits_rsv!),
//             colorscale: "Blues",
//             colorbar: { title: { text: "Percent" } },
//             text: data
//               .filter((entry) => entry.percent_visits_rsv !== null)
//               .map(
//                 (entry) =>
//                   `County: ${entry.county}, ${
//                     entry.state
//                   }<br>RSV Visits: ${entry.percent_visits_rsv?.toFixed(2)}%`,
//               ),
//             hoverinfo: "text",
//           },
//         ]}
//         layout={{
//           title: { text: "RSV ED visits by jurisdiction 2025-03-22" },
//           geo: { scope: "usa" },
//           autosize: true,

//           margin: { t: 50, b: 50, l: 50, r: 50 },
//         }}
//         config={{ responsive: true }}
//         style={{ width: "100%" }}
//       />
//     </Box>
//   );
// };

// export default CountyMap;

import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import Plot from "react-plotly.js";

const COUNTY_GEOJSON_URL =
  "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json";

interface DataEntry {
  fips: string;
  state: string;
  county: string;
  percent_visits_rsv: number | null;
}

const CountyMap = () => {
  const [data, setData] = useState<DataEntry[]>([]);
  const [geoJson, setGeoJson] = useState(null);

  useEffect(() => {
    // Fetch county GeoJSON
    fetch(COUNTY_GEOJSON_URL)
      .then((response) => response.json())
      .then(setGeoJson);

    // Fetch CSV data
    fetch("/rsvByCounty.csv")
      .then((response) => response.text())
      .then((csvData) => {
        const parsedData = Papa.parse(csvData, { header: true }).data;

        const mappedData: DataEntry[] = parsedData.map((row: any) => ({
          fips: row.fips ? String(row.fips).padStart(5, "0") : null,
          state: row.state,
          county: row.county,
          percent_visits_rsv: row.percent_visits_rsv
            ? parseFloat(row.percent_visits_rsv)
            : null,
        }));

        setData(mappedData);
      });
  }, []);

  console.log("Data for choropleth map:", data);

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
              zmax: 1,
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
