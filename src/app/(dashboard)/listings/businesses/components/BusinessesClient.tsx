"use client";

import React, { useContext, useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Typography, Grid, Button, Box, Pagination } from "@mui/material";
import { Icon } from "@iconify/react";
import Flex from "@/global/Flex";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";
import BusinessCard from "./BusinessCard";
import BusinessMap from "./BusinessMap";

import PageHeader from "@/components/PageHeader";
import BusinessFilters, { FilterState } from "./BusinessFilters";
import { Business } from "@/types/business";
import AddButton from "@/app/(dashboard)/layout/components/AddButton";
import EmptyResult from "@/components/EmptyResult";

interface BusinessesClientProps {
  initialBusinesses: Business[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

const BusinessesClient: React.FC<BusinessesClientProps> = ({
  initialBusinesses,
  currentPage,
  totalPages,
  totalCount,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

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
    // Create new URLSearchParams to preserve existing params
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/businesses?${params.toString()}`);
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
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

      {/* View Mode Toggle */}
      <Box sx={{ my: 2, display: "flex", gap: 1 }}>
        <Button
          variant={viewMode === "list" ? "contained" : "text"}
          onClick={() => setViewMode("list")}
          startIcon={<Icon icon="mdi:view-grid" />}
          size="small"
        >
          List View
        </Button>
        <Button
          variant={viewMode === "map" ? "contained" : "text"}
          onClick={() => setViewMode("map")}
          startIcon={<Icon icon="mdi:map-marker-radius" />}
          size="small"
        >
          Map View
        </Button>
      </Box>

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
          Showing {filteredBusinesses.length} of {totalCount} businesses
          {hasActiveFilters && " (filtered)"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Page {currentPage} of {totalPages}
        </Typography>
      </Flex>

      {/* Content Area - List or Map */}
      {viewMode === "list" ? (
        <Grid container columnSpacing={4} rowGap={4}>
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business) => (
              <Grid
                key={business.id}
                size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}
              >
                <BusinessCard
                  data={business}
                  onViewDetails={handleViewDetails}
                />
              </Grid>
            ))
          ) : (
            <Grid key="no-businesses" size={12}></Grid>
          )}
        </Grid>
      ) : (
        <BusinessMap
          businesses={filteredBusinesses}
          height={600}
          onViewDetails={handleViewDetails}
          onBusinessSelect={(business) => {
            console.log("Selected business:", business);
          }}
        />
      )}

      <EmptyResult
        icon="ic:baseline-business"
        description="Add a business to see it here."
        title={
          hasActiveFilters
            ? "No businesses match your filters"
            : "No businesses registered at the moment"
        }
        showButton={true}
        buttonText={hasActiveFilters ? "Clear All Filters" : "Add A Business"}
        onButtonClick={() => {
          if (hasActiveFilters) {
            clearAllFilters();
          } else {
            router.push("/listings/businesses/add-business");
          }
        }}
        height="calc(100vh * 0.4)"
      />

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
  );
};

export default BusinessesClient;
