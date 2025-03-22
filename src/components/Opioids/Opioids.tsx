import { Box, Tab, Tabs } from "@mui/material";
import OpioidOverdosePlot from "./OpioidsOverdose";
import { ReactNode, SyntheticEvent, useState } from "react";

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

const Opioids = () => {
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
            label="Trends in national healthcare incidents"
            {...a11yProps(0)}
          />
          <Tab
            label="Map of opioid overdoses"
            {...a11yProps(1)}
          />
          <Tab
            label="Type of opioid"
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel
        value={value}
        index={0}
      >
        <OpioidOverdosePlot />
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={1}
      >
        Coming soon!
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={2}
      >
        Coming soon!
      </CustomTabPanel>
    </Box>
  );
};

export default Opioids;
