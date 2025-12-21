// app/listings/marketplace/components/PlantTab.tsx
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
  Chip,
  IconButton,
  Avatar,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Icon } from "@iconify/react";
import Flex from "@/global/Flex";
import EmptyResult from "@/components/EmptyResult";
import PlantCard from "./PlantCard";
import PlantCardCompact from "./PlantCardCompact";
import PlantFilters, { PlantFilterState } from "./PlantFilters";
import { PlantAd } from "../page";
import dayjs from "dayjs";

interface PlantTabProps {
  plant: PlantAd[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

type ViewMode = "grid" | "compact" | "table";

const PlantTab: React.FC<PlantTabProps> = ({
  plant,
  currentPage,
  totalPages,
  totalCount,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Load view mode from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("plantViewMode");
      return (saved as ViewMode) || "grid";
    }
    return "grid";
  });

  const [filters, setFilters] = useState<PlantFilterState>({
    equipmentType: "",
    category: "",
    make: "",
    region: "",
    condition: "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    searchText: "",
    sortBy: "newest",
  });

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const equipmentTypes = [
      ...new Set(plant.map((p) => p.equipment_type).filter(Boolean)),
    ];
    const categories = [
      ...new Set(plant.map((p) => p.category).filter(Boolean)),
    ];
    const makes = [
      ...new Set(
        plant.map((p) => p.make).filter((make): make is string => Boolean(make))
      ),
    ];
    const regions = [...new Set(plant.map((p) => p.region).filter(Boolean))];
    const conditions = [
      ...new Set(plant.map((p) => p.condition).filter(Boolean)),
    ];

    return {
      equipmentTypes: equipmentTypes.sort(),
      categories: categories.sort(),
      makes: makes.sort(),
      regions: regions.sort(),
      conditions: conditions.sort(),
    };
  }, [plant]);

  // Filter and sort plant
  const filteredPlant = useMemo(() => {
    let filtered = [...plant];

    // Text search
    if (filters.searchText.trim()) {
      const searchTerm = filters.searchText.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          (item.make && item.make.toLowerCase().includes(searchTerm)) ||
          (item.model && item.model.toLowerCase().includes(searchTerm)) ||
          item.equipment_type.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply filters
    if (filters.equipmentType) {
      filtered = filtered.filter(
        (p) => p.equipment_type === filters.equipmentType
      );
    }
    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    if (filters.make) {
      filtered = filtered.filter((p) => p.make === filters.make);
    }
    if (filters.region) {
      filtered = filtered.filter((p) => p.region === filters.region);
    }
    if (filters.condition) {
      filtered = filtered.filter((p) => p.condition === filters.condition);
    }

    // Price range
    if (filters.minPrice) {
      filtered = filtered.filter(
        (p) => p.sale_price && p.sale_price >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(
        (p) => p.sale_price && p.sale_price <= parseFloat(filters.maxPrice)
      );
    }

    // Year range
    if (filters.minYear) {
      filtered = filtered.filter(
        (p) => p.year && p.year >= parseInt(filters.minYear)
      );
    }
    if (filters.maxYear) {
      filtered = filtered.filter(
        (p) => p.year && p.year <= parseInt(filters.maxYear)
      );
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
        filtered.sort((a, b) => (a.sale_price || 0) - (b.sale_price || 0));
        break;
      case "price_high":
        filtered.sort((a, b) => (b.sale_price || 0) - (a.sale_price || 0));
        break;
      case "hours_low":
        filtered.sort(
          (a, b) => (a.hours_used || 999999) - (b.hours_used || 999999)
        );
        break;
    }

    return filtered;
  }, [plant, filters]);

  const handleFilterChange = (key: keyof PlantFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      equipmentType: "",
      category: "",
      make: "",
      region: "",
      condition: "",
      minPrice: "",
      maxPrice: "",
      minYear: "",
      maxYear: "",
      searchText: "",
      sortBy: "newest",
    });
  };

  const handleViewDetails = (plantId: string) => {
    router.push(`/listings/marketplace/plant/${plantId}`);
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
      // Save to localStorage
      localStorage.setItem("plantViewMode", newMode);
    }
  };

  const hasActiveFilters =
    filters.equipmentType ||
    filters.category ||
    filters.make ||
    filters.region ||
    filters.condition ||
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
          <Icon icon="mdi:excavator" width={24} />
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
      field: "equipment_type",
      headerName: "Type",
      width: 150,
    },
    {
      field: "make",
      headerName: "Make/Model",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body2" noWrap>
            {params.row.make || "N/A"}
            {params.row.model && ` ${params.row.model}`}
          </Typography>
        </Box>
      ),
    },
    {
      field: "year",
      headerName: "Year",
      width: 90,
      type: "number",
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
      field: "sale_price",
      headerName: "Price",
      width: 130,
      type: "number",
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body2" fontWeight={600} color="primary">
            {params.row.sale_price
              ? `$${params.row.sale_price.toLocaleString()}`
              : "POA"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "price_type",
      headerName: "Type",
      width: 110,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.row.price_type}
          size="small"
          variant="outlined"
          sx={{ fontSize: "0.75rem" }}
        />
      ),
    },
    {
      field: "region",
      headerName: "Location",
      width: 130,
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
      <PlantFilters
        filters={filters}
        filterOptions={filterOptions}
        resultsCount={filteredPlant.length}
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
          Showing {filteredPlant.length} of {totalCount} plant & equipment
          listings
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
            rows={filteredPlant}
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
          {filteredPlant.length > 0 ? (
            filteredPlant.map((item) => (
              <Grid
                key={item.id}
                size={
                  viewMode === "compact"
                    ? { xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }
                    : { xs: 12, sm: 6, md: 12, lg: 6, xl: 4 }
                }
              >
                {viewMode === "compact" ? (
                  <PlantCardCompact
                    plant={item}
                    onViewDetails={handleViewDetails}
                  />
                ) : (
                  <PlantCard plant={item} onViewDetails={handleViewDetails} />
                )}
              </Grid>
            ))
          ) : (
            <Grid key="no-plant" size={12}>
              <EmptyResult
                icon="mdi:excavator"
                description="Add a plant or equipment listing to see it here."
                title={
                  hasActiveFilters
                    ? "No equipment matches your filters"
                    : "No plant & equipment available"
                }
                showButton={true}
                buttonText={
                  hasActiveFilters ? "Clear All Filters" : "Add Equipment"
                }
                onButtonClick={() => {
                  if (hasActiveFilters) {
                    clearAllFilters();
                  } else {
                    router.push("/listings/marketplace/plant/add");
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

export default PlantTab;
