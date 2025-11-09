"use client";

import React from "react";
import {
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Collapse,
  IconButton,
  Chip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import Flex from "@/global/Flex";

export interface FilterState {
  businessType: string;
  legalityType: string;
  workTypes: string[];
  employeeSize: string;
  sortBy: string;
  searchText: string;
  minYearsTrading: string;
  region: string;
}

interface FilterOptions {
  businessTypes: string[];
  legalityTypes: string[];
  workTypes: string[];
  employeeSizes: string[];
  regions: string[];
}

interface BusinessFiltersProps {
  filters: FilterState;
  filterOptions: FilterOptions;
  resultsCount: number;
  totalCount: number;
  onFilterChange: (key: keyof FilterState, value: string | string[]) => void;
  onClearFilters: () => void;
}

const BusinessFilters: React.FC<BusinessFiltersProps> = ({
  filters,
  filterOptions,
  resultsCount,

  onFilterChange,
  onClearFilters,
}) => {
  const [filtersExpanded, setFiltersExpanded] = React.useState<boolean>(false);

  const hasActiveFilters =
    filters.businessType ||
    filters.legalityType ||
    filters.workTypes.length > 0 ||
    filters.employeeSize ||
    filters.searchText.trim() ||
    filters.minYearsTrading ||
    filters.region;

  return (
    <CustomCard
      undecorated={true}
      sx={{
        padding: 2,
      }}
    >
      {/* Quick Search */}
      <TextField
        size="small"
        fullWidth
        variant="outlined"
        placeholder="Search businesses by name, type, work undertaken, or contact..."
        value={filters.searchText}
        onChange={(e) => onFilterChange("searchText", e.target.value)}
        InputProps={{
          startAdornment: (
            <Icon
              icon="mdi:magnify"
              style={{ marginRight: 8, color: "#666" }}
            />
          ),
        }}
        sx={{ mb: 2 }}
      />

      {/* Filter Toggle */}
      <Flex justifyContent="space-between" alignItems="center" mb={1}>
        <Flex alignItems="center" gap={1}>
          <Typography variant="body2" fontWeight={500}>
            Advanced Filters
          </Typography>
          {hasActiveFilters && (
            <Chip
              label={`${resultsCount} results`}
              size="small"
              color="primary"
            />
          )}
        </Flex>
        <Flex alignItems="center" gap={1}>
          {hasActiveFilters && (
            <Button
              size="small"
              variant="outlined"
              onClick={onClearFilters}
              startIcon={<Icon icon="mdi:filter-off" />}
            >
              Clear Filters
            </Button>
          )}
          <IconButton
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            size="small"
          >
            <Icon
              icon={filtersExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
            />
          </IconButton>
        </Flex>
      </Flex>

      <Collapse in={filtersExpanded}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Sort By */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                label="Sort By"
                onChange={(e) => onFilterChange("sortBy", e.target.value)}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="name_az">Name A-Z</MenuItem>
                <MenuItem value="years_trading">Most Experienced</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Business Type Filter */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Business Type</InputLabel>
              <Select
                value={filters.businessType}
                label="Business Type"
                onChange={(e) => onFilterChange("businessType", e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {filterOptions.businessTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Legality Type Filter */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Legal Structure</InputLabel>
              <Select
                value={filters.legalityType}
                label="Legal Structure"
                onChange={(e) => onFilterChange("legalityType", e.target.value)}
              >
                <MenuItem value="">All Structures</MenuItem>
                {filterOptions.legalityTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Employee Size Filter */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Company Size</InputLabel>
              <Select
                value={filters.employeeSize}
                label="Company Size"
                onChange={(e) => onFilterChange("employeeSize", e.target.value)}
              >
                <MenuItem value="">All Sizes</MenuItem>
                {filterOptions.employeeSizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Region Filter */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Region</InputLabel>
              <Select
                value={filters.region}
                label="Region"
                onChange={(e) => onFilterChange("region", e.target.value)}
              >
                <MenuItem value="">All Regions</MenuItem>
                {filterOptions.regions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Minimum Years Trading */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Min Years Trading"
              value={filters.minYearsTrading}
              onChange={(e) =>
                onFilterChange("minYearsTrading", e.target.value)
              }
              inputProps={{ min: 0 }}
            />
          </Grid>

          {/* Work Types Filter */}
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Autocomplete
              multiple
              size="small"
              options={filterOptions.workTypes}
              value={filters.workTypes}
              onChange={(_, newValue) => onFilterChange("workTypes", newValue)}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip label={option} {...tagProps} key={key} size="small" />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Types of Work"
                  placeholder="Select work types..."
                />
              )}
            />
          </Grid>
        </Grid>
      </Collapse>
    </CustomCard>
  );
};

export default BusinessFilters;
