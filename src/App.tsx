import { Box, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { theme } from "./Theme";
import ysphLogo from "./assets/images/ysphLogo.png";
import Opioids from "./components/Opioids/Opioids";
import RSV from "./components/RespiratoryInfections/RSV/RSV";
import Documentation from "./components/Documentation";
import { useState } from "react";
import NavBar from "./components/NavBar";

const sections = [
  {
    id: "welcome-to-pophive",
    title: "Welcome to PopHive",
    component: (
      <Typography>
        This platform is designed to give you timely, clear, and useful insights
        into community health, so you can make informed decisions for yourself,
        your family, and your community. We bring together data from multiple
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
    component: <RSV />,
  },
  {
    id: "childhood-immunization",
    title: "Childhood immunization rates",
    component: <Typography>Content coming soon</Typography>,
  },
  {
    id: "youth-wellbeing",
    title: "Youth Wellbeing",
    component: <Typography>Content coming soon</Typography>,
  },
  { id: "opioids", title: "Opioids", component: <Opioids /> },
  { id: "documentation", title: "Documentation", component: <Documentation /> },
];

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <ThemeProvider theme={theme}>
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

      <NavBar
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
    </ThemeProvider>
  );
};

export default App;
