// components/shared/Tabs.tsx

import { Box, Tab, Tabs as MuiTabs } from "@mui/material";
import { SyntheticEvent, useState, ReactNode } from "react";

interface TabConfig {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabConfig[];
}

export const CustomTabs = ({ tabs }: TabsProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <MuiTabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab.label}
              label={tab.label}
              id={`simple-tab-${index}`}
              aria-controls={`simple-tabpanel-${index}`}
            />
          ))}
        </MuiTabs>
      </Box>
      {tabs.map((tab, index) => (
        <div
          key={tab.label}
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
        >
          {value === index && <Box sx={{ p: 3 }}>{tab.content}</Box>}
        </div>
      ))}
    </Box>
  );
};
