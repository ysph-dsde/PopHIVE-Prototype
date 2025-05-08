import { Typography } from "@mui/material";
import { CustomTabs } from "../shared/CustomTabs";
import { MapOfDiseasePrevalence } from "./MapOfDiseasePrevalence";
import { DiseasePrevalence } from "./DiseasePrevalence";
import { ObesityVsDiabetes } from "./ObesityVsDiabetes";

interface ChronicDiseaseProps {
  disease: "obesity" | "diabetes"; // Extend if needed
}

export const ChronicDisease = ({ disease }: ChronicDiseaseProps) => {
  const chronicDiseaseTabs = [
    {
      label: `Map of ${disease} prevalence (all ages)`,
      content: <MapOfDiseasePrevalence disease={disease} />,
    },

    {
      label: `${disease} prevalence by state and age`,
      content: <DiseasePrevalence disease={disease} />,
    },
    {
      label: "Obesity vs diabetes prevalence (all ages)",
      content: <ObesityVsDiabetes />,
    },
  ];

  return (
    <>
      <CustomTabs tabs={chronicDiseaseTabs} />{" "}
      <Typography
        variant="caption"
        sx={{ mt: 2 }}
      >
        Data are from Epic Cosmos.
      </Typography>
    </>
  );
};
