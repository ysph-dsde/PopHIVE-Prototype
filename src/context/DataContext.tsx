import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Papa from "papaparse";

// Predefined dataset URLs
const predefinedDatasets = {
  rsv_flu_covid_epic_cosmos_age_state:
    "https://raw.githubusercontent.com/ysph-dsde/PopHIVE_DataHub/refs/heads/main/Data/Plot%20Files/Cosmos%20ED/rsv_flu_covid_epic_cosmos_age_state.csv",
  rsv_combined_all_outcomes_state:
    "https://raw.githubusercontent.com/ysph-dsde/PopHIVE_DataHub/refs/heads/main/Data/Plot%20Files/Comparisons/rsv_combined_all_outcomes_state.csv",
  flu_combined_all_outcomes_state:
    "https://raw.githubusercontent.com/ysph-dsde/PopHIVE_DataHub/refs/heads/main/Data/Plot%20Files/Comparisons/flu_combined_all_outcomes_state.csv",
  covid_combined_all_outcomes_state:
    "https://raw.githubusercontent.com/ysph-dsde/PopHIVE_DataHub/refs/heads/main/Data/Plot%20Files/Comparisons/covid_combined_all_outcomes_state.csv",
  rsv_ts_nrevss_test_rsv:
    "https://raw.githubusercontent.com/ysph-dsde/PopHIVE_DataHub/refs/heads/main/Data/Plot%20Files/NREVSS/rsv_ts_nrevss_test_rsv.csv",
  rsv_hosp_age_respnet:
    "https://raw.githubusercontent.com/ysph-dsde/PopHIVE_DataHub/refs/heads/main/Data/Plot%20Files/RESP-NET%20Programs/rsv_hosp_age_respnet.csv",
  rsv_flu_covid_county_filled_map_nssp:
    "https://raw.githubusercontent.com/ysph-dsde/PopHIVE_DataHub/refs/heads/main/Data/Plot%20Files/Cosmos%20ED/rsv_flu_covid_county_filled_map_nssp.csv",
  county_geojson:
    "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json",
  // vax_age_nis:
  //   "https://github.com/ysph-dsde/PopHIVE_DataHub/raw/refs/heads/main/Data/Plot%20Files/vax_age_nis.parquet",
  wisqars_self_harm:
    "https://github.com/ysph-dsde/PopHIVE_DataHub/raw/refs/heads/main/Data/Plot%20Files/wisqars/wisqars_self_harm.csv",

  // Add other predefined dataset URLs here
};

interface DataProviderProps {
  children: ReactNode; // Typing the children prop
}

interface DataContextType {
  datasets: { [key: string]: any[] }; // key is dataset name, value is the data
  geoJson: any | null; // Store GeoJSON data here
  loadData: (datasetName: string, url: string) => void; // Function to load datasets
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: DataProviderProps) => {
  const [datasets, setDatasets] = useState<{ [key: string]: any[] }>({});
  const [geoJson, setGeoJson] = useState<any | null>(null);

  // Function to load data if not already present in context
  const loadData = (datasetName: string, url: string) => {
    if (datasets[datasetName]) {
      return; // Dataset already loaded, no need to fetch it again
    }

    fetch(url)
      .then((response) => response.text())
      .then((csvData) => {
        const parsedData = Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
        }).data;
        setDatasets((prev) => ({
          ...prev,
          [datasetName]: parsedData,
        }));
      });
  };

  const loadGeoJson = (url: string) => {
    if (geoJson) return; // GeoJSON is already loaded, no need to fetch again

    fetch(url)
      .then((response) => response.json())
      .then(setGeoJson);
  };

  // Preload predefined datasets on component mount
  useEffect(() => {
    Object.entries(predefinedDatasets).forEach(([datasetName, url]) => {
      if (datasetName === "county_geojson") {
        loadGeoJson(url); // Special case for GeoJSON
      } else {
        loadData(datasetName, url); // Load other datasets
      }
    });
  }, []);

  return (
    <DataContext.Provider value={{ datasets, geoJson, loadData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
