import { Typography } from "@mui/material";
import { CustomTabs } from "../shared/CustomTabs";
import { RespiratoryInfection } from "./RSV/RespiratoryInfection";

const RespiratoryInfections = () => {
  const respiratoryInfectionsTabs = [
    {
      label: "Respiratory Syncytial Virus (RSV)",
      content: <RespiratoryInfection disease="rsv" />,
    },
    {
      label: "Influenza (Seasonal Flu)",
      // content: <Typography>Flu coming soon</Typography>,
      content: <RespiratoryInfection disease="flu" />,
    },
    {
      label: "Covid-19",
      // content: <Typography>Covid coming soon</Typography>,
      content: <RespiratoryInfection disease="covid" />,
    },
    {
      label: "Pneumococcus",
      content: <Typography>Pneumococcus coming soon</Typography>,
    },
  ];

  return <CustomTabs tabs={respiratoryInfectionsTabs} />;
};

export default RespiratoryInfections;
