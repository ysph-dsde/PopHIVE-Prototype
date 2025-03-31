import { Box, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { theme } from "./Theme";
import ysphLogo from "./assets/images/ysphLogo.png";
import Opioids from "./components/Opioids/Opioids";
import RSV from "./components/RespiratoryInfections/RSV/RSV";

const App = () => {
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
          sx={{ color: "white", margin: "auto 0" }}
        >
          PopHIVE: Population Health Information and Visualization Exchange
        </Typography>
        <img
          src={ysphLogo}
          alt="Yale School of Public Health Logo"
          style={{ width: "10rem", height: "10rem" }}
        />
      </Box>
      <Box
        sx={{
          padding: "1rem 2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h4">Welcome to PopHive</Typography>
          <Typography>
            This platform is designed to give you timely, clear, and useful
            insights into community health, so you can make informed decisions
            for yourself, your family, and your community. We bring together
            data from multiple sources—like public health reports, electronic
            health records, sewage testing, online search trends, surveys, and
            predictive models—to help paint a fuller picture of health trends.
            We're just getting started and will be adding even more data and
            disease insights in the coming months. This project is led by the
            Yale School of Public Health.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4">Respiratory infections</Typography>
          <Typography>
            <RSV />
          </Typography>
        </Box>
        {/* <Box>
          <Typography variant="h4">Childhood immunization rates</Typography>
          <Typography>Content coming soon</Typography>
        </Box> */}
        {/* <Box>
          <Typography variant="h4">Youth Wellbeing</Typography>
          <Typography>Content coming soon</Typography>
        </Box> */}
        <Box>
          <Typography variant="h4">Opioids</Typography>
          <Opioids />
        </Box>
        {/* <Box>
          <Typography variant="h4">Documentation</Typography>
          <Typography variant="h5">Notes on data sources</Typography>
          <Typography>Coming soon!</Typography>
          <Typography variant="h5">Acknowledgements</Typography>
          <Typography>
            We thank all of the organizations and individuals who make their
            data available for health monitoring and research.
          </Typography>
          <Typography>
            Some data used in this platform come from Epic Cosmos, a dataset
            created in collaboration with a community of Epic health systems
            representing more than 295 million patient records from over 1633
            hospitals and 37,900 clinics from all 50 states, D.C., Lebanon, and
            Saudi Arabia. Epic data were obtained using the SlicerDicer tool
            in&nbsp;
            <Link href="https://www.epicresearch.org/about-us">
              Epic Cosmos
            </Link>
            . and are presented here for non-commercial purposes.
          </Typography>
          <Typography>
            Google Trends data, representing search volume by week and state or
            metropolitan area, are obtained from the&nbsp;
            <Link href="https://developers.google.com/terms/">
              Google Trends API
            </Link>
            &nbsp;for non-commercial purposes.
          </Typography>
          <Typography>
            Contributors include:
            <Typography>
              Data wrangling, code, visualization: Shelby Golden, Howard Baik,
              Micah Iserman, Maurice Dalton, Deus Thindwa, Stephanie Perniciaro,
              Dan Weinberger
            </Typography>
            <Typography>
              Project Leadership and Partners: Megan Ranney, Bhramar Mukherjee,
              Katelyn Jetelina, Ron Borzekowski, Anne Zink, and Dan Weinberger
            </Typography>
          </Typography>
          <Typography>
            Feedback or suggestions?{" "}
            <Link href="https://docs.google.com/forms/d/e/1FAIpQLSchAasiq7ovCCNz9ussb7C2ntkZ-8Rjc7-tNSglkf5boS-A0w/viewform?usp=dialog">
              Let us know!
            </Link>
          </Typography>
        </Box> */}
      </Box>
    </ThemeProvider>
  );
};

export default App;
