import { Box, Tab, Tabs, Typography } from "@mui/material";
import { ReactNode, SyntheticEvent, useState } from "react";
import Opioids from "./Opioids/Opioids";

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

const InjuryAndOverdose = () => {
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
            label="Self-harm"
            {...a11yProps(0)}
          />
          <Tab
            label="Drug overdoses"
            {...a11yProps(1)}
          />
          <Tab
            label="Road accidents"
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel
        value={value}
        index={0}
      >
        <Typography>Self-harm coming soon</Typography>
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={1}
      >
        <Opioids />
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={2}
      >
        <Typography>Road accidents coming soon</Typography>
      </CustomTabPanel>
    </Box>
  );
};

export default InjuryAndOverdose;
