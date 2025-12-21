// app/listings/marketplace/MarketplaceClient.tsx
"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box } from "@mui/material";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";
import PageHeader from "@/components/PageHeader";

import { ResponsiveTabs, TabItem } from "@/components/ResponsiveTabs";
import VehiclesTab from "./components/VehiclesTab";
import PlantTab from "./components/PlantTab";
import MaterialsTab from "./components/MaterialsTab";
import { VehicleAd, PlantAd, MaterialAd } from "./page";
import AddButton from "../../layout/components/AddButton";

interface MarketplaceClientProps {
  initialVehicles: VehicleAd[];
  initialPlant: PlantAd[];
  initialMaterials: MaterialAd[];
  currentPage: number;
  totalVehiclePages: number;
  totalPlantPages: number;
  totalMaterialPages: number;
  vehicleCount: number;
  plantCount: number;
  materialCount: number;
  activeTab: string;
}

const MarketplaceClient: React.FC<MarketplaceClientProps> = ({
  initialVehicles,
  initialPlant,
  initialMaterials,
  currentPage,
  totalVehiclePages,
  totalPlantPages,
  totalMaterialPages,
  vehicleCount,
  plantCount,
  materialCount,
  activeTab: initialTab,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    changeActiveRoute("Marketplace");
  }, [changeActiveRoute]);

  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newValue);
    params.set("page", "1"); // Reset to page 1 when changing tabs
    router.push(`/listings/marketplace?${params.toString()}`);
  };

  const tabs: TabItem[] = [
    {
      label: "Vehicles",
      value: "vehicles",
      count: vehicleCount,
      content: (
        <VehiclesTab
          vehicles={initialVehicles}
          currentPage={currentPage}
          totalPages={totalVehiclePages}
          totalCount={vehicleCount}
        />
      ),
    },
    {
      label: "Plant & Equipment",
      value: "plant",
      count: plantCount,
      content: (
        <PlantTab
          plant={initialPlant}
          currentPage={currentPage}
          totalPages={totalPlantPages}
          totalCount={plantCount}
        />
      ),
    },
    {
      label: "Materials",
      value: "materials",
      count: materialCount,
      content: (
        <MaterialsTab
          materials={initialMaterials}
          currentPage={currentPage}
          totalPages={totalMaterialPages}
          totalCount={materialCount}
        />
      ),
    },
  ];

  return (
    <Box margin="auto" width="100%" maxWidth={1400} px={2} pb={6}>
      <PageHeader
        title="Marketplace"
        description="Buy, sell, and hire construction vehicles, equipment, and materials"
      />

      <ResponsiveTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <AddButton />
    </Box>
  );
};

export default MarketplaceClient;
