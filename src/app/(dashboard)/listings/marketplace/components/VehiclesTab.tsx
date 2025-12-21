// app/listings/marketplace/components/VehiclesTab.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Grid,
  Typography,
  Pagination,
  Snackbar,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Icon } from "@iconify/react";
import Flex from "@/global/Flex";
import EmptyResult from "@/components/EmptyResult";
import VehicleCard from "./VehicleCard";
import VehicleCardCompact from "./VehicleCardCompact";
import VehicleFilters, { VehicleFilterState } from "./VehicleFilters";
import { VehicleAd } from "../page";
import dayjs from "dayjs";

interface VehiclesTabProps {
  vehicles: VehicleAd[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

type ViewMode = "grid" | "compact" | "table";

const VehiclesTab: React.FC<VehiclesTabProps> = ({
  vehicles,
  currentPage,
  totalPages,
  totalCount,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vehiclesViewMode");
      return (saved as ViewMode) || "grid";
    }
    return "grid";
  });

  const [filters, setFilters] = useState<VehicleFilterState>({
    vehicleType: "",
    make: "",
    region: "",
    condition: "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    transmission: "",
    fuelType: "",
    searchText: "",
    sortBy: "newest",
  });

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const vehicleTypes = [
      ...new Set(vehicles.map((v) => v.vehicle_type).filter(Boolean)),
    ];
    const makes = [...new Set(vehicles.map((v) => v.make).filter(Boolean))];
    const regions = [...new Set(vehicles.map((v) => v.region).filter(Boolean))];
    const conditions = [
      ...new Set(vehicles.map((v) => v.condition).filter(Boolean)),
    ];
    const transmissions = [
      ...new Set(
        vehicles
          .map((v) => v.transmission)
          .filter((t): t is string => Boolean(t))
      ),
    ];
    const fuelTypes = [
      ...new Set(
        vehicles.map((v) => v.fuel_type).filter((f): f is string => Boolean(f))
      ),
    ];

    return {
      vehicleTypes: vehicleTypes.sort(),
      makes: makes.sort(),
      regions: regions.sort(),
      conditions: conditions.sort(),
      transmissions: transmissions.sort(),
      fuelTypes: fuelTypes.sort(),
    };
  }, [vehicles]);

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    let filtered = [...vehicles];

    // Text search
    if (filters.searchText.trim()) {
      const searchTerm = filters.searchText.toLowerCase().trim();
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.title.toLowerCase().includes(searchTerm) ||
          vehicle.description.toLowerCase().includes(searchTerm) ||
          vehicle.make.toLowerCase().includes(searchTerm) ||
          vehicle.model.toLowerCase().includes(searchTerm) ||
          vehicle.vehicle_type.toLowerCase().includes(searchTerm)
      );
    }

    // Apply filters
    if (filters.vehicleType) {
      filtered = filtered.filter((v) => v.vehicle_type === filters.vehicleType);
    }
    if (filters.make) {
      filtered = filtered.filter((v) => v.make === filters.make);
    }
    if (filters.region) {
      filtered = filtered.filter((v) => v.region === filters.region);
    }
    if (filters.condition) {
      filtered = filtered.filter((v) => v.condition === filters.condition);
    }
    if (filters.transmission) {
      filtered = filtered.filter(
        (v) => v.transmission === filters.transmission
      );
    }
    if (filters.fuelType) {
      filtered = filtered.filter((v) => v.fuel_type === filters.fuelType);
    }

    // Price range
    if (filters.minPrice) {
      filtered = filtered.filter(
        (v) => v.price >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(
        (v) => v.price <= parseFloat(filters.maxPrice)
      );
    }

    // Year range
    if (filters.minYear) {
      filtered = filtered.filter((v) => v.year >= parseInt(filters.minYear));
    }
    if (filters.maxYear) {
      filtered = filtered.filter((v) => v.year <= parseInt(filters.maxYear));
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.posted_date).getTime() -
            new Date(a.posted_date).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.posted_date).getTime() -
            new Date(b.posted_date).getTime()
        );
        break;
      case "price_low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "year_new":
        filtered.sort((a, b) => b.year - a.year);
        break;
      case "year_old":
        filtered.sort((a, b) => a.year - b.year);
        break;
      case "mileage_low":
        filtered.sort((a, b) => (a.mileage || 999999) - (b.mileage || 999999));
        break;
    }

    return filtered;
  }, [vehicles, filters]);

  const handleFilterChange = (key: keyof VehicleFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      vehicleType: "",
      make: "",
      region: "",
      condition: "",
      minPrice: "",
      maxPrice: "",
      minYear: "",
      maxYear: "",
      transmission: "",
      fuelType: "",
      searchText: "",
      sortBy: "newest",
    });
  };

  const handleViewDetails = (vehicleId: string) => {
    router.push(`/listings/marketplace/vehicles/${vehicleId}`);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/listings/marketplace?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: ViewMode | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
      localStorage.setItem("vehiclesViewMode", newMode);
    }
  };

  const hasActiveFilters =
    filters.vehicleType ||
    filters.make ||
    filters.region ||
    filters.condition ||
    filters.transmission ||
    filters.fuelType ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minYear ||
    filters.maxYear ||
    filters.searchText.trim();

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: "",
      width: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Avatar
          src={params.row.images?.[0] || undefined}
          alt={params.row.title}
          variant="rounded"
          sx={{ width: 50, height: 50 }}
        >
          <Icon icon="mdi:car" width={24} />
        </Avatar>
      ),
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "make_model",
      headerName: "Make/Model",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body2" noWrap>
            {params.row.year} {params.row.make} {params.row.model}
          </Typography>
        </Box>
      ),
    },
    {
      field: "vehicle_type",
      headerName: "Type",
      width: 130,
    },
    {
      field: "condition",
      headerName: "Condition",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.row.condition}
          size="small"
          color={params.row.condition === "new" ? "success" : "default"}
          sx={{ fontSize: "0.75rem" }}
        />
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 130,
      type: "number",
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body2" fontWeight={600} color="primary">
            ${params.row.price.toLocaleString()}
          </Typography>
        </Box>
      ),
    },
    {
      field: "region",
      headerName: "Location",
      width: 130,
    },
    {
      field: "mileage",
      headerName: "Mileage",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {params.row.mileage?.toLocaleString() || "N/A"} km
        </Typography>
      ),
    },
    {
      field: "posted_date",
      headerName: "Posted",
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        const postedDate = dayjs(params.row.posted_date);
        const today = dayjs();
        const diff = today.diff(postedDate, "day");

        let dateText = "";
        if (diff === 0) dateText = "Today";
        else if (diff === 1) dateText = "Yesterday";
        else if (diff < 7) dateText = `${diff}d ago`;
        else if (diff < 30) dateText = `${Math.floor(diff / 7)}w ago`;
        else dateText = `${Math.floor(diff / 30)}mo ago`;

        return (
          <Typography variant="caption" color="text.secondary">
            {dateText}
          </Typography>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(params.row.id);
            }}
            title="View Details"
          >
            <Icon icon="mdi:eye" width={20} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <VehicleFilters
        filters={filters}
        filterOptions={filterOptions}
        resultsCount={filteredVehicles.length}
        totalCount={totalCount}
        onFilterChange={handleFilterChange}
        onClearFilters={clearAllFilters}
      />

      <Flex justifyContent="space-between" alignItems="center" mb={2} px={2}>
        <Typography
          sx={(theme) => ({
            fontSize: {
              xs: theme.typography.body3?.fontSize || "0.75rem",
              sm: theme.typography.body2.fontSize,
            },
          })}
          color="text.secondary"
        >
          Showing {filteredVehicles.length} of {totalCount} vehicles
          {hasActiveFilters && " (filtered)"}
        </Typography>

        <Flex alignItems="center" gap={2}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Page {currentPage} of {totalPages}
          </Typography>

          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
            aria-label="view mode"
          >
            <ToggleButton value="grid" aria-label="grid view">
              <Icon icon="mdi:view-grid" width={20} />
            </ToggleButton>
            <ToggleButton value="compact" aria-label="compact view">
              <Icon icon="mdi:view-module" width={20} />
            </ToggleButton>
            <ToggleButton value="table" aria-label="table view">
              <Icon icon="mdi:table" width={20} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Flex>
      </Flex>

      {/* Table View */}
      {viewMode === "table" ? (
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredVehicles}
            columns={columns}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25, page: 0 },
              },
            }}
            disableRowSelectionOnClick
            onRowClick={(params) => handleViewDetails(params.row.id)}
            sx={{
              "& .MuiDataGrid-row": {
                cursor: "pointer",
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "action.hover",
              },
            }}
          />
        </Box>
      ) : (
        /* Grid/Compact View */
        <Grid container columnSpacing={3} rowGap={3}>
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <Grid
                key={vehicle.id}
                size={
                  viewMode === "compact"
                    ? { xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }
                    : { xs: 12, sm: 6, md: 12, lg: 6, xl: 4 }
                }
              >
                {viewMode === "compact" ? (
                  <VehicleCardCompact
                    vehicle={vehicle}
                    onViewDetails={handleViewDetails}
                  />
                ) : (
                  <VehicleCard
                    vehicle={vehicle}
                    onViewDetails={handleViewDetails}
                  />
                )}
              </Grid>
            ))
          ) : (
            <Grid key="no-vehicles" size={12}>
              <EmptyResult
                icon="mdi:car"
                description="Add a vehicle listing to see it here."
                title={
                  hasActiveFilters
                    ? "No vehicles match your filters"
                    : "No vehicles available"
                }
                showButton={true}
                buttonText={
                  hasActiveFilters ? "Clear All Filters" : "Add A Vehicle"
                }
                onButtonClick={() => {
                  if (hasActiveFilters) {
                    clearAllFilters();
                  } else {
                    router.push("/listings/marketplace/vehicles/add");
                  }
                }}
                height="calc(100vh * 0.5)"
              />
            </Grid>
          )}
        </Grid>
      )}

      {totalPages > 1 && viewMode !== "table" && (
        <Flex justifyContent="center" mt={4} mb={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Flex>
      )}

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        message={success}
      />
    </>
  );
};

export default VehiclesTab;
