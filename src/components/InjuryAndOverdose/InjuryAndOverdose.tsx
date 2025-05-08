import { Typography } from "@mui/material";
import { DrugOverdoses } from "./DrugOverdoses/DrugOverdoses";
import { CustomTabs } from "../shared/CustomTabs";
import { SelfHarm } from "./SelfHarm/SelfHarm";

const InjuryAndOverdose = () => {
  const injuryAndOverdoseTabs = [
    {
      label: "Self-harm",
      content: <SelfHarm />,
    },
    {
      label: "Drug overdoses",
      content: <DrugOverdoses />,
    },
    {
      label: "Road accidents",
      content: <Typography>Coming soon</Typography>,
    },
  ];

  return <CustomTabs tabs={injuryAndOverdoseTabs} />;
};

export default InjuryAndOverdose;
