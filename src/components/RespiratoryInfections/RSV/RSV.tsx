import { Box, Tab, Tabs } from "@mui/material";
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
      ></CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={1}
      ></CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={2}
      ></CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={3}
      ></CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={4}
      ></CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={5}
      ></CustomTabPanel>
    </Box>
  );
};

export default RSV;
