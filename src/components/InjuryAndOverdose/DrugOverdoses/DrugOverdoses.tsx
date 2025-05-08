import { OpioidOverdosePlot } from "./OpioidsOverdose";
import { ChoroplethMap } from "./OpioidsMap";
import { CustomTabs } from "../../shared/CustomTabs";
import { Typography } from "@mui/material";
import { NaloxoneSearch } from "./NaloxoneSearch";

export const DrugOverdoses = () => {
  const drugOverdosesTabs = [
    {
      label: "National trends in opioid hospitalizations and deaths",
      content: <OpioidOverdosePlot />,
    },
    {
      label: "Trends in searches for naloxone by state",
      content: <NaloxoneSearch />,
    },
    {
      label: "ED visits for overdose attempts by state",
      content: <Typography>Coming soon</Typography>,
    },
    {
      label: "Map of opioid overdose hospitalizations and deaths",
      content: (
        <>
          <ChoroplethMap
            datasetName="opioid_ahrq_map"
            title="AHRQ"
          />
          <ChoroplethMap
            datasetName="opioid_wonder_map"
            title="CDC Wonder"
          />
        </>
      ),
    },
    {
      label: "Type of opioid",
      content: <Typography>Coming soon</Typography>,
    },
  ];

  return <CustomTabs tabs={drugOverdosesTabs} />;
};
