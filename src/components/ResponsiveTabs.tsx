// components/ResponsiveTabs.tsx
"use client";

import {
  Box,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ReactNode } from "react";
import InnerCustomCard from "./InnerCustomCard";

export interface TabItem {
  label: string;
  value: string;
  content: ReactNode;
  count?: number; // Optional badge count
}

interface ResponsiveTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

// Tab Label with Badge Component
const TabLabelWithBadge = ({
  label,
  count,
}: {
  label: string;
  count?: number;
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography component="span">{label}</Typography>
      {count !== undefined && count > 0 && (
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderRadius: "50%",
            minWidth: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: 600,
            px: 0.5,
          }}
        >
          <span>{count > 99 ? "99+" : count}</span>
        </Box>
      )}
    </Box>
  );
};

export const ResponsiveTabs: React.FC<ResponsiveTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    onTabChange(newValue);
  };

  const activeTabContent = tabs.find((tab) => tab.value === activeTab)?.content;

  return (
    <Box>
      <InnerCustomCard>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          variant={isLgUp ? "fullWidth" : isMdUp ? "standard" : "scrollable"}
          scrollButtons="auto"
          allowScrollButtonsMobile
          centered={isMdUp && !isLgUp}
          sx={{
            "& .MuiTabs-flexContainer": {
              justifyContent: "space-between",
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              label={<TabLabelWithBadge label={tab.label} count={tab.count} />}
              value={tab.value}
              sx={{ textTransform: "none" }}
            />
          ))}
        </Tabs>
      </InnerCustomCard>

      <Box>{activeTabContent}</Box>
    </Box>
  );
};
