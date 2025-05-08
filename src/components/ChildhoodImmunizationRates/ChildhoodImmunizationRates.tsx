import { Link, Typography } from "@mui/material";
import { CustomTabs } from "../shared/CustomTabs";
import { UptakeByState } from "./UptakeByState";
import { UptakeByDimension } from "./UptakeByDimension";

export const ChildhoodImmunizationRates = () => {
  const childhoodImmunizationTabs = [
    {
      label: "Uptake by state",
      content: <UptakeByState />,
    },
    {
      label: "Uptake by urbanicity",
      content: <UptakeByDimension dimension="Urbanicity" />,
    },
    {
      label: "Uptake based on insurance status",
      content: <UptakeByDimension dimension="Insurance" />,
    },
  ];

  return (
    <>
      <Typography>
        Vaccination of children across the US, by state and vaccine. These data
        come from the{" "}
        <Link href="https://data.cdc.gov/Child-Vaccinations/Vaccination-Coverage-among-Young-Children-0-35-Mon/fhky-rtsk/about_data">
          National Immunization Survey
        </Link>
        {". "}
        The size of the circle is proportional to the number of children
        participating in the survey. Caution should be used when interpreting
        these survey data.
      </Typography>
      <CustomTabs tabs={childhoodImmunizationTabs} />
    </>
  );
};
