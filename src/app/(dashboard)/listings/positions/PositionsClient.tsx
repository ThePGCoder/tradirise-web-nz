// components/PositionsClient.tsx
"use client";

import React, { useContext, useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Typography, Grid, Box, Snackbar, Pagination } from "@mui/material";

import Flex from "@/global/Flex";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";

import PositionsCard from "./components/PositionsCard";
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
    // Create new URLSearchParams to preserve existing params
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/positions?${params.toString()}`);
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters =
    filters.trade ||
    filters.region ||
    filters.startDate ||
    filters.searchText.trim() ||
    filters.minRate ||
    filters.maxRate;

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

        {/* Results Summary */}
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
          <Typography variant="body2" color="text.secondary">
            Page {currentPage} of {totalPages}
          </Typography>
        </Flex>

        <Grid container columnSpacing={3} rowGap={3}>
          {filteredPositions.length > 0 ? (
            filteredPositions.map((position) => (
              <Grid
                key={position.id}
                size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}
              >
                <PositionsCard
                  position={position}
                  onViewDetails={handleViewDetails}
                  onSave={handleSave}
                />
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
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
