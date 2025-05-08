import { CustomTabs } from "../shared/CustomTabs";
import { ChronicDisease } from "./ChronicDisease";

export const ChronicDiseases = () => {
  const chronicDiseasesTabs = [
    {
      label: "Obesity",
      content: <ChronicDisease disease="obesity" />,
    },
    {
      label: "Diabetes",
      content: <ChronicDisease disease="diabetes" />,
    },
  ];

  return <CustomTabs tabs={chronicDiseasesTabs} />;
};
