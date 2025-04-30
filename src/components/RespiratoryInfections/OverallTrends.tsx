import { Link } from "@mui/material";
import { TrendsPlot } from "./TrendsPlot";

interface OverallTrendsProps {
  disease: "rsv" | "flu" | "covid";
}

export const OverallTrends = ({ disease }: OverallTrendsProps) => {
  const labelMappings = {
    rsv: {
      "Pct of ED visits (Epic)": "ED visits (Epic cosmos)",
      "Pct of ED visits": "ED visits (CDC/NSSP)",
      "Google Searches 1": "Google 1",
      "Google Searches 2": "Google 2",
      "Waste Water wval (RSV)": "Waste Water wval (RSV)",
      "Hospitalization Rate": "Hospitalization Rate",
    },
    flu: {
      "Pct of ED visits (Epic)": "ED visits (Epic cosmos)",
      "Pct of ED visits": "ED visits (CDC/NSSP)",
      "Waste Water wval (Influenza)": "Waste Water wval (Influenza)",
      "Hospitalization Rate": "Hospitalization Rate",
    },
    covid: {
      "Pct of ED visits (Epic)": "ED visits (Epic cosmos)",
      "Pct of ED visits": "ED visits (CDC/NSSP)",
      "Hospitalization Rate": "Hospitalization Rate",
      "Waste Water wval (SARS-CoV-2)": "Waste Water wval (SARS-CoV-2)",
    },
  };

  const yAxisTitles = {
    rsv: "RSV activity (scaled to 100)",
    flu: "Flu activity (scaled to 100)",
    covid: "COVID-19 activity (scaled to 100)",
  };

  const datasetNames = {
    rsv: "rsv_combined_all_outcomes_state",
    flu: "flu_combined_all_outcomes_state",
    covid: "covid_combined_all_outcomes_state",
  };

  const descriptions = {
    rsv: (
      <>
        Viral levels in the community can be measured in different ways, which
        is important because no measure is perfect. By triangulating data from
        sources like emergency department (ED) visits, hospitalizations, and
        wastewater surveillance, we can get a more complete picture of how and
        when a virus is spreading, which can help you make better-informed
        decisions. Epic data come from the{" "}
        <Link href="https://www.epicresearch.org/about-us">
          Epic Cosmos platform
        </Link>
        . The Google Trends data are obtained from the Google Health Trends API
        (volume of searches for ‘rsv’, subtracting volume of searches for
        category “respiratory syncytial virus vaccine” (Knowledge graph:
        /g/11j30ybfx6) ).
      </>
    ),
    flu: <>Filler text for flu.</>,
    covid: <>Filler text for covid.</>,
  };

  return (
    <TrendsPlot
      datasetName={datasetNames[disease]}
      labelMapping={labelMappings[disease]}
      yAxisTitle={yAxisTitles[disease]}
      description={descriptions[disease]}
    />
  );
};
