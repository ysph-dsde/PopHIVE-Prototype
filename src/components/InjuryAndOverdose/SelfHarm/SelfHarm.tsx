import { Typography } from "@mui/material";
import { CustomTabs } from "../../shared/CustomTabs";
import { NationalSelfHarm } from "./National";

export const SelfHarm = () => {
  const selfHarmTabs = [
    {
      label: "National (WISQARS)",
      content: <NationalSelfHarm />,
    },
    {
      label: "State (Epic Cosmos)",
      content: <Typography>Coming soon</Typography>,
    },
  ];

  return <CustomTabs tabs={selfHarmTabs} />;
};
