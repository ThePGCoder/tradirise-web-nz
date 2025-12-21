// components/MyListingsClient.tsx (Client Component)
"use client";

import { Box, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { useContext, useEffect, useState, useCallback } from "react";
import PersonnelTab from "./tabs/PersonnelTab";
import PositionsTab from "./tabs/PositionsTab";
import ProjectsTab from "./tabs/ProjectsTab";
import BusinessesTab from "./tabs/BusinessesTab";

import {
  ProjectWithProfiles,
  PositionWithProfiles,
  PersonnelWithProfile,
  MaterialWithProfile,
  PlantWithProfile,
  VehicleWithProfile,
} from "../page";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";
import PageHeader from "@/components/PageHeader";
import InnerCustomCard from "@/components/InnerCustomCard";
import { Business } from "@/types/business";
import MaterialsTab from "./tabs/MaterialsTab";
import PlantTab from "./tabs/PlantTab";
import VehiclesTab from "./tabs/VehiclesTab";

interface MyListingsClientProps {
  initialData: {
    personnel: PersonnelWithProfile[];
    businesses: Business[];
    positions: PositionWithProfiles[];
    projects: ProjectWithProfiles[];
    materials: MaterialWithProfile[];
    plant: PlantWithProfile[];
    vehicles: VehicleWithProfile[];
  };
}

const tabs = [
  "Personnel",
  "Positions",
  "Projects",
  "Businesses",
  "Materials",
  "Plant",
  "Vehicles",
];

// Compact Badge Component to match MyFavourites
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

const MyListingsClient: React.FC<MyListingsClientProps> = ({ initialData }) => {
  const [activeTab, setActiveTab] = useState("Personnel");
  const [counts, setCounts] = useState({
    personnel: initialData.personnel.length,
    businesses: initialData.businesses.length,
    positions: initialData.positions.length,
    projects: initialData.projects.length,
    materials: initialData.materials.length,
    plant: initialData.plant.length,
    vehicles: initialData.vehicles.length,
  });

  const { changeActiveRoute } = useContext(ActiveRouteContext);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

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
      case "Materials":
        return (
          <MaterialsTab
            initialMaterials={initialData.materials}
            onCountChange={(count) => handleCountChange("Materials", count)}
          />
        );
      case "Plant":
        return (
          <PlantTab
            initialPlant={initialData.plant}
            onCountChange={(count) => handleCountChange("Plant", count)}
          />
        );
      case "Vehicles":
        return (
          <VehiclesTab
            initialVehicles={initialData.vehicles}
            onCountChange={(count) => handleCountChange("Vehicles", count)}
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
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {tabs.map((item) => (
            <Tab
              key={item}
              label={getTabLabel(item)}
              value={item}
              sx={{
                textTransform: "none",
                minWidth: { xs: 100, sm: 120 },
                flex: { xs: "0 0 auto", md: 1 },
              }}
            />
          ))}
        </Tabs>
      </InnerCustomCard>

      <Box pt={3}>{renderTabContent()}</Box>
    </Box>
  );
};

export default MyListingsClient;
