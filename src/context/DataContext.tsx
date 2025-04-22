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
    "https://raw.githubusercontent.com/ysph-dsde/PopHIVE_DataHub/refs/heads/main/Data/Plot%20Files/rsv_flu_covid_epic_cosmos_age_state.csv",
  rsv_combined_all_outcomes_state:
    "https://raw.githubusercontent.com/ysph-dsde/PopHIVE_DataHub/refs/heads/main/Data/Plot%20Files/rsv_combined_all_outcomes_state.csv",
  rsv_ts_nrevss_test_rsv:
    "https://raw.githubusercontent.com/ysph-dsde/PopHIVE_DataHub/refs/heads/main/Data/Plot%20Files/rsv_ts_nrevss_test_rsv.csv",
  rsv_hosp_age_respnet:
    "https://raw.githubusercontent.com/ysph-dsde/PopHIVE_DataHub/refs/heads/main/Data/Plot%20Files/rsv_hosp_age_respnet.csv",

  // Add other predefined dataset URLs here
};

interface DataProviderProps {
  children: ReactNode; // Typing the children prop
}

interface DataContextType {
  datasets: { [key: string]: any[] }; // key is dataset name, value is the data
  loadData: (datasetName: string, url: string) => void; // Function to load datasets
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: DataProviderProps) => {
  const [datasets, setDatasets] = useState<{ [key: string]: any[] }>({});

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

  // Preload predefined datasets on component mount
  useEffect(() => {
    Object.entries(predefinedDatasets).forEach(([datasetName, url]) => {
      loadData(datasetName, url); // Load each predefined dataset
    });
  }, []);

  return (
    <DataContext.Provider value={{ datasets, loadData }}>
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
