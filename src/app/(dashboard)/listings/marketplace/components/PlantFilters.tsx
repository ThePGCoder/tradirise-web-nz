// app/listings/marketplace/components/PlantFilters.tsx
"use client";

import React, { useState } from "react";
import {
  Grid,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Collapse,
  IconButton,
  Chip,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import Flex from "@/global/Flex";

export interface PlantFilterState {
  equipmentType: string;
  category: string;
  make: string;
  region: string;
  condition: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  searchText: string;
  sortBy: string;
}

interface PlantFiltersProps {
  filters: PlantFilterState;
  filterOptions: {
    equipmentTypes: string[];
    categories: string[];
    makes: string[];
    regions: string[];
    conditions: string[];
  };
  resultsCount: number;
  totalCount: number;
  onFilterChange: (key: keyof PlantFilterState, value: string) => void;
  onClearFilters: () => void;
}

const PlantFilters: React.FC<PlantFiltersProps> = ({
  filters,
  filterOptions,
  resultsCount,
  onFilterChange,
  onClearFilters,
}) => {
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);

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

  return (
    <CustomCard undecorated={true} sx={{ padding: 2, mt: 2 }}>
      {/* Quick Search */}
      <TextField
        size="small"
        fullWidth
        variant="outlined"
        placeholder="Search equipment by title, make, model, type, or description..."
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
                <MenuItem value="price_low">Price: Low to High</MenuItem>
                <MenuItem value="price_high">Price: High to Low</MenuItem>
                <MenuItem value="hours_low">Hours: Low to High</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Equipment Type */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Equipment Type</InputLabel>
              <Select
                value={filters.equipmentType}
                label="Equipment Type"
                onChange={(e) =>
                  onFilterChange("equipmentType", e.target.value)
                }
              >
                <MenuItem value="">All Types</MenuItem>
                {filterOptions.equipmentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Category */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => onFilterChange("category", e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {filterOptions.categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Make */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Make</InputLabel>
              <Select
                value={filters.make}
                label="Make"
                onChange={(e) => onFilterChange("make", e.target.value)}
              >
                <MenuItem value="">All Makes</MenuItem>
                {filterOptions.makes.map((make) => (
                  <MenuItem key={make} value={make}>
                    {make}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Region */}
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

          {/* Condition */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Condition</InputLabel>
              <Select
                value={filters.condition}
                label="Condition"
                onChange={(e) => onFilterChange("condition", e.target.value)}
              >
                <MenuItem value="">All Conditions</MenuItem>
                {filterOptions.conditions.map((condition) => (
                  <MenuItem key={condition} value={condition}>
                    {condition.charAt(0).toUpperCase() + condition.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Price Range */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Flex gap={1}>
              <TextField
                size="small"
                label="Min Price ($)"
                type="number"
                value={filters.minPrice}
                onChange={(e) => onFilterChange("minPrice", e.target.value)}
                fullWidth
              />
              <TextField
                size="small"
                label="Max Price ($)"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                fullWidth
              />
            </Flex>
          </Grid>

          {/* Year Range */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Flex gap={1}>
              <TextField
                size="small"
                label="Min Year"
                type="number"
                value={filters.minYear}
                onChange={(e) => onFilterChange("minYear", e.target.value)}
                fullWidth
              />
              <TextField
                size="small"
                label="Max Year"
                type="number"
                value={filters.maxYear}
                onChange={(e) => onFilterChange("maxYear", e.target.value)}
                fullWidth
              />
            </Flex>
          </Grid>
        </Grid>
      </Collapse>
    </CustomCard>
  );
};

export default PlantFilters;
