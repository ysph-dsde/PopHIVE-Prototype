import { Box, Tab, Tabs, Typography } from "@mui/material";
import { ReactNode, SyntheticEvent, useState } from "react";
import OverallTrends from "./OverallTrends";
import PositiveTests from "./PositiveTests";
import CountyMap from "./CountyMap";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const RSV = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="Overall trends"
            {...a11yProps(0)}
          />
          <Tab
            label="Trends in positive tests"
            {...a11yProps(1)}
          />
          <Tab
            label="By age"
            {...a11yProps(2)}
          />
          <Tab
            label="Map of ED visits (state)"
            {...a11yProps(3)}
          />
          <Tab
            label="Map of ED visits (county)"
            {...a11yProps(4)}
          />
          <Tab
            label="Map of Google searches"
            {...a11yProps(5)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel
        value={value}
        index={0}
      >
        <OverallTrends />
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={1}
      >
        <PositiveTests />
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={2}
      >
        <Typography>Coming soon.</Typography>
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={3}
      >
        <Typography>Coming soon.</Typography>
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={4}
      >
        <CountyMap/>
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={5}
      >
        <Typography>Coming soon.</Typography>
        <Typography>
          People searching for information on RSV often correlates well with
          actual clinical activity for RSV.
        </Typography>
      </CustomTabPanel>
    </Box>
  );
};

export default RSV;
