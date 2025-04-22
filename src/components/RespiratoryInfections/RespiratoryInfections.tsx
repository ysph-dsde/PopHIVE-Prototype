import { Box, Tab, Tabs, Typography } from "@mui/material";
import { ReactNode, SyntheticEvent, useState } from "react";
import RSV from "./RSV/RSV";

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

const RespiratoryInfections = () => {
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
            label="Respiratory Syncytial Virus (RSV)"
            {...a11yProps(0)}
          />
          <Tab
            label="Influenza (Seasonal Flu)"
            {...a11yProps(1)}
          />
          <Tab
            label="Covid-19"
            {...a11yProps(3)}
          />
          <Tab
            label="Pneumococcus"
            {...a11yProps(4)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel
        value={value}
        index={0}
      >
        <RSV />
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={1}
      >
        <Typography>Flu coming soon</Typography>
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={2}
      >
        <Typography>Covid coming soon</Typography>
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={3}
      >
        <Typography>Pneumococcus coming soon</Typography>
      </CustomTabPanel>
    </Box>
  );
};

export default RespiratoryInfections;
