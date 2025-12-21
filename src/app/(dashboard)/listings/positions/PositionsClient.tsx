// components/PositionsClient.tsx
"use client";

import React, { useContext, useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Typography,
  Grid,
  Box,
  Snackbar,
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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";

import PositionsCard from "./components/PositionsCard";
import PositionsCardCompact from "./components/PositionsCardCompact";
import PositionFilters, { FilterState } from "./components/PositionFilters";

import { Position } from "@/types/positions";
import PageHeader from "@/components/PageHeader";
import AddButton from "../../layout/components/AddButton";
import EmptyResult from "@/components/EmptyResult";

// Add dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);

interface PositionsClientProps {
  initialPositions: Position[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

type ViewMode = "grid" | "compact" | "table";

const PositionsClient: React.FC<PositionsClientProps> = ({
  initialPositions,
  currentPage,
  totalPages,
  totalCount,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("positionsViewMode");
      return (saved as ViewMode) || "grid";
    }
    return "grid";
  });

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    trade: "",
    region: "",
    startDate: "",
    sortBy: "newest",
    searchText: "",
    minRate: "",
    maxRate: "",
  });

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const trades = [
      ...new Set(initialPositions.map((p) => p.trade).filter(Boolean)),
    ];
    const regions = [
      ...new Set(initialPositions.map((p) => p.region).filter(Boolean)),
    ];

    return {
      trades: trades.sort(),
      regions: regions.sort(),
    };
  }, [initialPositions]);

  // Helper function to extract numeric value from rate string
  const extractNumericRate = (rate: string): number => {
    const match = rate.match(/\$?(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Filter and sort positions based on current filters
  const filteredPositions = useMemo(() => {
    let filtered = [...initialPositions];

    // Text search
    if (filters.searchText.trim()) {
      const searchTerm = filters.searchText.toLowerCase().trim();
      filtered = filtered.filter(
        (position) =>
          position.title.toLowerCase().includes(searchTerm) ||
          position.trade.toLowerCase().includes(searchTerm) ||
          position.description.toLowerCase().includes(searchTerm) ||
          position.region.toLowerCase().includes(searchTerm) ||
          position.remuneration.toLowerCase().includes(searchTerm)
      );
    }

    // Trade filter
    if (filters.trade) {
      filtered = filtered.filter(
        (position) => position.trade === filters.trade
      );
    }

    // Region filter
    if (filters.region) {
      filtered = filtered.filter(
        (position) => position.region === filters.region
      );
    }

    // Start date filter
    if (filters.startDate) {
      const filterDate = dayjs(filters.startDate);
      filtered = filtered.filter((position) =>
        dayjs(position.start_date).isSameOrBefore(filterDate, "day")
      );
    }

    // Rate range filters
    if (filters.minRate) {
      const minRate = parseFloat(filters.minRate);
      filtered = filtered.filter((position) => {
        const positionRate = extractNumericRate(position.rate);
        return positionRate >= minRate;
      });
    }

    if (filters.maxRate) {
      const maxRate = parseFloat(filters.maxRate);
      filtered = filtered.filter((position) => {
        const positionRate = extractNumericRate(position.rate);
        return positionRate <= maxRate;
      });
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            dayjs(b.posted_date).valueOf() - dayjs(a.posted_date).valueOf()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            dayjs(a.posted_date).valueOf() - dayjs(b.posted_date).valueOf()
        );
        break;
      case "start_date_soon":
        filtered.sort(
          (a, b) =>
            dayjs(a.start_date).valueOf() - dayjs(b.start_date).valueOf()
        );
        break;
      case "title_az":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "rate_high":
        filtered.sort(
          (a, b) => extractNumericRate(b.rate) - extractNumericRate(a.rate)
        );
        break;
      case "rate_low":
        filtered.sort(
          (a, b) => extractNumericRate(a.rate) - extractNumericRate(b.rate)
        );
        break;
    }

    return filtered;
  }, [initialPositions, filters]);

  useEffect(() => {
    changeActiveRoute("Positions");
  }, [changeActiveRoute]);

  const handleViewDetails = (positionId: string) => {
    router.push(`/listings/positions/${positionId}`);
  };

  const handleSave = (positionId: string) => {
    console.log(`Saving position ID: ${positionId}`);
    setSuccess("Position saved to your favorites!");
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      trade: "",
      region: "",
      startDate: "",
      sortBy: "newest",
      searchText: "",
      minRate: "",
      maxRate: "",
    });
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/positions?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: ViewMode | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
      localStorage.setItem("positionsViewMode", newMode);
    }
  };

  const hasActiveFilters =
    filters.trade ||
    filters.region ||
    filters.startDate ||
    filters.searchText.trim() ||
    filters.minRate ||
    filters.maxRate;

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      width: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const isBusinessListing = params.row.is_business_listing;
        const avatarUrl = isBusinessListing
          ? params.row.businesses?.logo_url
          : params.row.profiles?.avatar_url;
        const fallbackInitial = isBusinessListing
          ? params.row.businesses?.business_name?.[0] ||
            params.row.posted_by?.[0] ||
            "B"
          : params.row.profiles?.first_name?.[0] ||
            params.row.posted_by?.[0] ||
            "P";

        return (
          <Box display="flex" alignItems="center" height="100%">
            <Avatar
              src={avatarUrl || undefined}
              variant={isBusinessListing ? "rounded" : "circular"}
              sx={{ width: 35, height: 35 }}
            >
              {fallbackInitial}
            </Avatar>
          </Box>
        );
      },
    },
    {
      field: "title",
      headerName: "Position",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "trade",
      headerName: "Trade",
      width: 130,
    },
    {
      field: "rate",
      headerName: "Rate",
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body2" fontWeight={600} color="primary">
            {params.row.rate}
          </Typography>
        </Box>
      ),
    },
    {
      field: "remuneration",
      headerName: "Type",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.row.remuneration}
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
      field: "start_date",
      headerName: "Start Date",
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body2">
            {dayjs(params.row.start_date).format("MMM D, YYYY")}
          </Typography>
        </Box>
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
      <Box margin="auto" width="100%" maxWidth={1400} px={2} pb={6}>
        <PageHeader
          title={"Available Positions"}
          description="Find your next opportunity in the construction industry"
        />

        {/* Search and Filter Section */}
        <PositionFilters
          filters={filters}
          filterOptions={filterOptions}
          resultsCount={filteredPositions.length}
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
            Showing {filteredPositions.length} of {totalCount} positions
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
            </ToggleButtonGroup>
          </Flex>
        </Flex>

        {/* Table View */}
        {viewMode === "table" ? (
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={filteredPositions}
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
            {filteredPositions.length > 0 ? (
              filteredPositions.map((position) => (
                <Grid
                  key={position.id}
                  size={
                    viewMode === "compact"
                      ? { xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }
                      : { xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }
                  }
                >
                  {viewMode === "compact" ? (
                    <PositionsCardCompact
                      position={position}
                      onViewDetails={handleViewDetails}
                    />
                  ) : (
                    <PositionsCard
                      position={position}
                      onViewDetails={handleViewDetails}
                      onSave={handleSave}
                    />
                  )}
                </Grid>
              ))
            ) : (
              <Grid key="no-positions" size={12}>
                <EmptyResult
                  icon="fluent:person-star-16-filled"
                  description="Add a position to see it here."
                  title={
                    hasActiveFilters
                      ? "No positions match your filters"
                      : "No positions available at the moment"
                  }
                  showButton={true}
                  buttonText={
                    hasActiveFilters ? "Clear All Filters" : "Add A Position"
                  }
                  onButtonClick={() => {
                    if (hasActiveFilters) {
                      clearAllFilters();
                    } else {
                      router.push("/listings/positions/add-position");
                    }
                  }}
                  height="calc(100vh * 0.5)"
                />
              </Grid>
            )}
          </Grid>
        )}

        {/* Pagination Controls */}
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

        <AddButton />
      </Box>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        message={success}
      />
    </>
  );
};

export default PositionsClient;
