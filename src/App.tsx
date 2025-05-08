import { Box, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { theme } from "./Theme";
import ysphLogo from "./assets/images/ysphLogo.png";
import { Documentation } from "./components/Documentation";
import { useState } from "react";
import { NavigationBar } from "./components/NavBar";
import { DataProvider } from "./context/DataContext";
import { RespiratoryInfections } from "./components/RespiratoryInfections/RespiratoryInfections";
import { InjuryAndOverdose } from "./components/InjuryAndOverdose/InjuryAndOverdose";
import { ChildhoodImmunizationRates } from "./components/ChildhoodImmunizationRates/ChildhoodImmunizationRates";
import { ChronicDiseases } from "./components/ChronicDisease/ChronicDiseases";

const sections = [
  {
    id: "welcome-to-pophive",
    title: "Welcome to PopHive",
    component: (
      <Typography>
        This platform is designed to give its users timely, clear, and useful
        insights into community health. We bring together data from multiple
        sources—like public health reports, electronic health records, sewage
        testing, online search trends, surveys, and predictive models—to help
        paint a fuller picture of health trends. We're just getting started and
        will be adding even more data and disease insights in the coming months.
        This project is led by the Yale School of Public Health.
      </Typography>
    ),
  },
  {
    id: "respiratory-infections",
    title: "Respiratory infections",
    component: <RespiratoryInfections />,
  },
  {
    id: "childhood-immunization",
    title: "Childhood immunization rates",
    component: <ChildhoodImmunizationRates />,
  },
  {
    id: "chronic-disease",
    title: "Chronic disease",
    component: <ChronicDiseases />,
  },
  // {
  //   id: "youth-wellbeing",
  //   title: "Youth Wellbeing",
  //   component: <Typography>Content coming soon</Typography>,
  // },
  {
    id: "injury-and-overdose",
    title: "Injury and overdose",
    component: <InjuryAndOverdose />,
  },
  { id: "documentation", title: "Documentation", component: <Documentation /> },
];

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <DataProvider>
        <CssBaseline />
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            padding: "1rem 2rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h2"
            fontSize={"3rem"}
            sx={{ color: "white", margin: "auto 0" }}
          >
            PopHIVE: Population Health Information and Visualization Exchange
          </Typography>
          <img
            src={ysphLogo}
            alt="Yale School of Public Health Logo"
            style={{ width: "7rem", height: "7rem" }}
          />
        </Box>

        <NavigationBar
          sections={sections}
          drawerOpen={drawerOpen}
          handleDrawerToggle={handleDrawerToggle}
        />

        <Box sx={{ padding: "1rem 2rem", margin: " 0 50px" }}>
          {sections.map((section, index) => (
            <Box
              key={index}
              id={section.id}
              sx={{ paddingBottom: "30px" }}
            >
              <Typography variant="h4">{section.title}</Typography>
              {section.component}
            </Box>
          ))}
        </Box>
      </DataProvider>
    </ThemeProvider>
  );
};

export default App;
