import { OverallTrends } from "./OverallTrends";
import { PositiveTests } from "./RSV/PositiveTests";
import { ByAge } from "./ByAge";
import { StateMap } from "./StateMap";
import { CountyMap } from "./CountyMap";
import { Typography } from "@mui/material";
import { CustomTabs } from "../shared/CustomTabs";

interface RespiratoryInfectionProps {
  disease: "rsv" | "flu" | "covid"; // Extend if needed
}

export const RespiratoryInfection = ({
  disease,
}: RespiratoryInfectionProps) => {
  const respiratoryInfectionTabs = [
    { label: "Overall trends", content: <OverallTrends disease={disease} /> },
    ...(disease === "rsv"
      ? [{ label: "Trends in positive tests", content: <PositiveTests /> }]
      : []),
    { label: "By age", content: <ByAge disease={disease} /> },
    {
      label: "Map of ED visits (state)",
      content: <StateMap disease={disease} />,
    },
    {
      label: "Map of ED visits (county)",
      content: <CountyMap disease={disease} />,
    },
    ...(disease === "rsv"
      ? [
          {
            label: "Map of Google searches",
            content: (
              <>
                <Typography>Coming soon.</Typography>
                <Typography>
                  People searching for information on RSV often correlates well
                  with actual clinical activity for RSV.
                </Typography>
              </>
            ),
          },
        ]
      : []),
  ];

  return <CustomTabs tabs={respiratoryInfectionTabs} />;
};
