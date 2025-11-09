// components/MyListingsClient.tsx (Client Component)
"use client";

import {
  Box,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState, useCallback } from "react";
import PersonnelTab from "./tabs/PersonnelTab";
import PositionsTab from "./tabs/PositionsTab";
import ProjectsTab from "./tabs/ProjectsTab";
import BusinessesTab from "./tabs/BusinessesTab";

import {
  ProjectWithProfiles,
  PositionWithProfiles,
  PersonnelWithProfile,
} from "../page";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";
import PageHeader from "@/components/PageHeader";
import InnerCustomCard from "@/components/InnerCustomCard";
import { Business } from "@/types/business";

interface MyListingsClientProps {
  initialData: {
    personnel: PersonnelWithProfile[];
    businesses: Business[];
    positions: PositionWithProfiles[];
    projects: ProjectWithProfiles[];
  };
}

const tabs = ["Personnel", "Positions", "Projects", "Businesses"];

// Red Circle Badge Component
const TabLabelWithBadge = ({
  label,
  count,
}: {
  label: string;
  count: number;
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography component="span">{label}</Typography>
      {count > 0 && (
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.error.contrastText,
            borderRadius: "50%",
            minWidth: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.7rem",
            fontWeight: 600,
            pr: 0.1,
          }}
        >
          <span>{count > 99 ? "99+" : count}</span>
        </Box>
      )}
    </Box>
  );
};

const MyListingsClient: React.FC<MyListingsClientProps> = ({ initialData }) => {
  const [activeTab, setActiveTab] = useState("Personnel");
  const [counts, setCounts] = useState({
    personnel: initialData.personnel.length,
    businesses: initialData.businesses.length,
    positions: initialData.positions.length,
    projects: initialData.projects.length,
  });

  const { changeActiveRoute } = useContext(ActiveRouteContext);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("sm"));

  // Use useCallback to prevent function recreation on every render
  const handleCountChange = useCallback((tabName: string, count: number) => {
    setCounts((prev) => ({
      ...prev,
      [tabName.toLowerCase()]: count,
    }));
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Personnel":
        return (
          <PersonnelTab
            initialPersonnel={initialData.personnel}
            onCountChange={(count) => handleCountChange("Personnel", count)}
          />
        );
      case "Positions":
        return (
          <PositionsTab
            initialPositions={initialData.positions}
            onCountChange={(count) => handleCountChange("Positions", count)}
          />
        );
      case "Projects":
        return (
          <ProjectsTab
            initialProjects={initialData.projects}
            onCountChange={(count) => handleCountChange("Projects", count)}
          />
        );
      case "Businesses":
        return (
          <BusinessesTab
            initialBusinesses={initialData.businesses}
            onCountChange={(count) => handleCountChange("Businesses", count)}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    changeActiveRoute("My Listings");
  }, [changeActiveRoute]);

  const getTabLabel = (tabName: string) => {
    const count = counts[tabName.toLowerCase() as keyof typeof counts];
    return <TabLabelWithBadge label={tabName} count={count} />;
  };

  return (
    <Box margin="auto" width="100%" maxWidth={1400} px={2} pb={6}>
      <PageHeader title="My Listings" />

      <InnerCustomCard>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          variant={isMdUp ? "fullWidth" : "scrollable"}
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-flexContainer": {
              justifyContent: isMdUp ? "space-between" : "center",
            },
            "& .MuiTab-root": {
              textTransform: "none", // Add this line
            },
          }}
        >
          {tabs.map((item) => (
            <Tab key={item} label={getTabLabel(item)} value={item} />
          ))}
        </Tabs>
      </InnerCustomCard>

      <Box pt={3}>{renderTabContent()}</Box>
    </Box>
  );
};

export default MyListingsClient;
