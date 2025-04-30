import { Typography } from "@mui/material";
import Opioids from "./Opioids/Opioids";
import { CustomTabs } from "../shared/CustomTabs";

const InjuryAndOverdose = () => {
  const respiratoryInfectionsTabs = [
    {
      label: "Self-harm",
      content: <Typography>Self-harm coming soon</Typography>,
    },
    {
      label: "Drug overdoses",
      content: <Opioids />,
    },
    {
      label: "Road accidents",
      content: <Typography>Road accidents coming soon</Typography>,
    },
  ];

  return <CustomTabs tabs={respiratoryInfectionsTabs} />;
};

export default InjuryAndOverdose;
