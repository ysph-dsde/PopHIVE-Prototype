import OpioidOverdosePlot from "./OpioidsOverdose";
import ChoroplethMap from "./OpioidsMap";
// import OpioidWafflePlot from "./OpioidsWaffle";
import { CustomTabs } from "../../shared/CustomTabs";

const Opioids = () => {
  const respiratoryInfectionsTabs = [
    {
      label: "National trends in opioid hospitalizations and deaths",
      content: <OpioidOverdosePlot />,
    },
    {
      label: "Map of opioid overdose hospitalizations and deaths",
      content: (
        <>
          <ChoroplethMap
            csvPath="/opioid_ahrq_map.csv"
            title="AHRQ"
          />
          <ChoroplethMap
            csvPath="/opioid_wonder_map.csv"
            title="CDC Wonder"
          />
        </>
      ),
    },
    // {
    //   label: "Type of opioid",
    //   content: <OpioidWafflePlot />,
    // },
  ];

  return <CustomTabs tabs={respiratoryInfectionsTabs} />;
};

export default Opioids;
