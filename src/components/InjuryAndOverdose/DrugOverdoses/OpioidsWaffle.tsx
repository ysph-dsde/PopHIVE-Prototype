import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import Plot from "react-plotly.js";

const OpioidWafflePlot = () => {
  const [data, setData] = useState<any[]>([]);
  const [datasets, setDatasets] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    fetch("/opioid_waffle.csv") // Ensure correct file path
      .then((response) => response.text())
      .then((csvData) => {
        const parsedData = Papa.parse(csvData, { header: true }).data;
        processData(parsedData);
      });
  }, []);

  const processData = (rawData: any[]) => {
    const uniqueDatasets = [...new Set(rawData.map((d) => d.dataset))];
    const uniqueYears = [...new Set(rawData.map((d) => Number(d.year)))].sort();
    setDatasets(uniqueDatasets);
    setYears(uniqueYears);

    let waffleData: any[] = [];

    uniqueDatasets.forEach((dataset) => {
      uniqueYears.forEach((year) => {
        const filteredData = rawData.filter(
          (d) => d.dataset === dataset && Number(d.year) === year,
        );
        waffleData.push(...generateWaffleData(filteredData, dataset, year));
      });
    });

    setData(waffleData);
  };

  const generateWaffleData = (
    filteredData: any[],
    dataset: string,
    year: number,
  ) => {
    if (!filteredData.length) return [];

    const totalCount = filteredData.reduce(
      (sum, d) => sum + Number(d.count),
      0,
    );
    let squares: { x: number; y: number; color: string; label: string }[] = [];
    let currentIndex = 0;

    const COLORS: Record<string, string> = {
      "All Opioids + Depressant": "green",
      "All Opioids + Stimulant": "orange",
      Benzodiazepines: "red",
      Cocaine: "pink",
      Heroin: "brown",
      "Illegally-Made Fentanyls": "purple",
      Methadone: "blue",
      "Other opioids": "gray",
      "Other synthetic narc": "yellow",
    };

    filteredData.forEach((entry) => {
      const percentage = (Number(entry.count) / totalCount) * 100;
      const numSquares = Math.round(percentage);

      for (let i = 0; i < numSquares; i++) {
        squares.push({
          x: currentIndex % 10,
          y: Math.floor(currentIndex / 10),
          color: COLORS[entry.drug] || "gray",
          label: entry.drug,
        });
        currentIndex++;
      }
    });

    return [
      {
        x: squares.map((s) => s.x),
        y: squares.map((s) => s.y),
        type: "scatter",
        mode: "markers",
        marker: {
          symbol: "square",
          size: 20,
          color: squares.map((s) => s.color),
        },
        text: squares.map((s) => s.label),
        hoverinfo: "text",
        name: `${dataset} ${year}`,
      },
    ];
  };

  return (
    <Box>
      {data.length > 0 && (
        <Plot
          data={data}
          layout={{
            title: "Opioid Overdose Waffle Chart",
            grid: {
              rows: datasets.length,
              columns: years.length,
              pattern: "independent",
            },
            xaxis: { showgrid: false, zeroline: false, showticklabels: false },
            yaxis: { showgrid: false, zeroline: false, showticklabels: false },
          }}
          useResizeHandler
          style={{ width: "100%", height: "500px" }}
        />
      )}
    </Box>
  );
};

export default OpioidWafflePlot;
