// app/listings/businesses/BusinessesClient.tsx
"use client";

import React, { useContext, useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Typography,
  Grid,
  Box,
  Pagination,
  ToggleButtonGroup,
  ToggleButton,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Flex from "@/global/Flex";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";
import BusinessCard from "./BusinessCard";
import BusinessMap from "./BusinessMap";
import PageHeader from "@/components/PageHeader";
import BusinessFilters, { FilterState } from "./BusinessFilters";
import { Business } from "@/types/business";
import AddButton from "@/app/(dashboard)/layout/components/AddButton";
import EmptyResult from "@/components/EmptyResult";
import BusinessCardCompact from "./BusinessCardCompact";
import dayjs from "dayjs";

interface BusinessesClientProps {
  initialBusinesses: Business[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

type ViewMode = "grid" | "compact" | "map" | "table";

const BusinessesClient: React.FC<BusinessesClientProps> = ({
  initialBusinesses,
  currentPage,
  totalPages,
  totalCount,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("businessesViewMode");
      return (saved as ViewMode) || "grid";
    }
    return "grid";
  });

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    businessType: "",
    legalityType: "",
    workTypes: [],
    employeeSize: "",
    sortBy: "newest",
    searchText: "",
    minYearsTrading: "",
    region: "",
  });

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const businessTypes = [
      ...new Set(initialBusinesses.map((b) => b.business_type).filter(Boolean)),
    ];
    const legalityTypes = [
      ...new Set(initialBusinesses.map((b) => b.legality_type).filter(Boolean)),
    ];
    const workTypes = [
      ...new Set(
        initialBusinesses.flatMap((b) => b.types_of_work_undertaken || [])
      ),
    ];
    const employeeSizes = [
      ...new Set(initialBusinesses.map((b) => b.employees).filter(Boolean)),
    ];
    const regions = [
      ...new Set(initialBusinesses.map((b) => b.region).filter(Boolean)),
    ];

    return {
      businessTypes: businessTypes.sort(),
      legalityTypes: legalityTypes.sort(),
      workTypes: workTypes.sort(),
      employeeSizes: employeeSizes.sort(),
      regions: regions.sort(),
    };
  }, [initialBusinesses]);

  // Filter and sort businesses based on current filters
  const filteredBusinesses = useMemo(() => {
    let filtered = [...initialBusinesses];

    // Text search
    if (filters.searchText.trim()) {
      const searchTerm = filters.searchText.toLowerCase().trim();
      filtered = filtered.filter(
        (business) =>
          business.business_name.toLowerCase().includes(searchTerm) ||
          business.business_type.toLowerCase().includes(searchTerm) ||
          (business.types_of_work_undertaken || []).some((work) =>
            work.toLowerCase().includes(searchTerm)
          ) ||
          business.contact_email.toLowerCase().includes(searchTerm) ||
          (business.description || "").toLowerCase().includes(searchTerm)
      );
    }

    // Business type filter
    if (filters.businessType) {
      filtered = filtered.filter(
        (business) => business.business_type === filters.businessType
      );
    }

    // Legality type filter
    if (filters.legalityType) {
      filtered = filtered.filter(
        (business) => business.legality_type === filters.legalityType
      );
    }

    // Employee size filter
    if (filters.employeeSize) {
      filtered = filtered.filter(
        (business) => business.employees === filters.employeeSize
      );
    }

    // Region filter
    if (filters.region) {
      filtered = filtered.filter(
        (business) => business.region === filters.region
      );
    }

    // Work types filter
    if (filters.workTypes.length > 0) {
      filtered = filtered.filter(
        (business) =>
          business.types_of_work_undertaken &&
          filters.workTypes.some((workType) =>
            business.types_of_work_undertaken.includes(workType)
          )
      );
    }

    // Minimum years trading filter
    if (filters.minYearsTrading) {
      const minYears = parseInt(filters.minYearsTrading);
      filtered = filtered.filter(
        (business) => business.years_in_trading >= minYears
      );
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "name_az":
        filtered.sort((a, b) => a.business_name.localeCompare(b.business_name));
        break;
      case "years_trading":
        filtered.sort((a, b) => b.years_in_trading - a.years_in_trading);
        break;
    }

    return filtered;
  }, [initialBusinesses, filters]);

  useEffect(() => {
    changeActiveRoute("Businesses");
  }, [changeActiveRoute]);

  // Event handlers
  const handleViewDetails = (businessId: string) => {
    router.push(`/listings/businesses/${businessId}`);
  };

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | string[]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      businessType: "",
      legalityType: "",
      workTypes: [],
      employeeSize: "",
      sortBy: "newest",
      searchText: "",
      minYearsTrading: "",
      region: "",
    });
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/businesses?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: ViewMode | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
      localStorage.setItem("businessesViewMode", newMode);
    }
  };

  const hasActiveFilters = Boolean(
    filters.businessType ||
      filters.legalityType ||
      filters.workTypes.length > 0 ||
      filters.employeeSize ||
      filters.searchText.trim() ||
      filters.minYearsTrading ||
      filters.region
  );

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: "logo",
      headerName: "",
      width: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Avatar
            src={params.row.logo_url || undefined}
            variant="rounded"
            sx={{ width: 35, height: 35 }}
          >
            {params.row.business_name?.[0] || "B"}
          </Avatar>
        </Box>
      ),
    },
    {
      field: "business_name",
      headerName: "Business Name",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "business_type",
      headerName: "Type",
      width: 150,
    },
    {
      field: "legality_type",
      headerName: "Legal Status",
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.row.legality_type}
          size="small"
          color="primary"
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
      field: "years_in_trading",
      headerName: "Years",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body2">
            {params.row.years_in_trading}y
          </Typography>
        </Box>
      ),
    },
    {
      field: "employees",
      headerName: "Employees",
      width: 120,
    },
    {
      field: "types_of_work_undertaken",
      headerName: "Work Types",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.row.types_of_work_undertaken?.length || 0}
          size="small"
          variant="outlined"
          sx={{ fontSize: "0.75rem" }}
        />
      ),
    },
    {
      field: "created_at",
      headerName: "Registered",
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        const postedDate = dayjs(params.row.created_at);
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
    <Box margin="auto" width="100%" maxWidth={1400} px={2} pb={6}>
      <PageHeader
        title="Registered Businesses"
        description="Discover verified construction businesses and service providers"
      />

      {/* Search and Filter Section */}
      <BusinessFilters
        filters={filters}
        filterOptions={filterOptions}
        resultsCount={filteredBusinesses.length}
        totalCount={totalCount}
        onFilterChange={handleFilterChange}
        onClearFilters={clearAllFilters}
      />

      {/* Results Summary with View Mode Toggle */}
      <Flex justifyContent="space-between" alignItems="center" mb={2} px={2}>
        <Typography
          sx={(theme) => ({
            fontSize: {
              xs: theme.typography.body3?.fontSize || "0.75rem",
              sm: theme.typography.body2.fontSize,
            },
            lineHeight: {
              xs: theme.typography.body3?.lineHeight || 1.2,
              sm: theme.typography.body2.lineHeight,
            },
          })}
          color="text.secondary"
        >
          Showing {filteredBusinesses.length} of {totalCount} businesses
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
            sx={{ pt: 1 }}
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
            <ToggleButton value="map" aria-label="map view">
              <Icon icon="mdi:map-marker-radius" width={20} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Flex>
      </Flex>

      {/* Content Area - Table, List, or Map */}
      {viewMode === "table" ? (
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredBusinesses}
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
      ) : viewMode === "map" ? (
        <BusinessMap
          businesses={filteredBusinesses}
          height={600}
          onViewDetails={handleViewDetails}
          onBusinessSelect={(business) => {
            console.log("Selected business:", business);
          }}
        />
      ) : (
        <Grid container columnSpacing={3} rowGap={3}>
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business) => (
              <Grid
                key={business.id}
                size={
                  viewMode === "compact"
                    ? { xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }
                    : { xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }
                }
              >
                {viewMode === "compact" ? (
                  <BusinessCardCompact
                    data={business}
                    onViewDetails={handleViewDetails}
                  />
                ) : (
                  <BusinessCard
                    data={business}
                    onViewDetails={handleViewDetails}
                  />
                )}
              </Grid>
            ))
          ) : (
            <Grid key="no-businesses" size={12}>
              <EmptyResult
                icon="ic:baseline-business"
                description="Add a business to see it here."
                title={
                  hasActiveFilters
                    ? "No businesses match your filters"
                    : "No businesses registered at the moment"
                }
                showButton={true}
                buttonText={
                  hasActiveFilters ? "Clear All Filters" : "Add A Business"
                }
                onButtonClick={() => {
                  if (hasActiveFilters) {
                    clearAllFilters();
                  } else {
                    router.push("/listings/businesses/add-business");
                  }
                }}
                height="calc(100vh * 0.4)"
              />
            </Grid>
          )}
        </Grid>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && viewMode !== "map" && viewMode !== "table" && (
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
      <AddButton />
    </Box>
  );
};

export default BusinessesClient;
