import { Typography } from "@mui/material";
import { CustomTabs } from "../shared/CustomTabs";
import { RespiratoryInfection } from "./RespiratoryInfection";

export const RespiratoryInfections = () => {
  const respiratoryInfectionsTabs = [
    {
      label: "Respiratory Syncytial Virus (RSV)",
      content: <RespiratoryInfection disease="rsv" />,
    },
    {
      label: "Influenza (Seasonal Flu)",
      content: <RespiratoryInfection disease="flu" />,
    },
    {
      label: "Covid-19",
      content: <RespiratoryInfection disease="covid" />,
    },
    {
      label: "Pneumococcus",
      content: <Typography>Pneumococcus coming soon</Typography>,
    },
  ];

  return <CustomTabs tabs={respiratoryInfectionsTabs} />;
};