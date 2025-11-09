// app/listings/projects/components/ProjectFilters.tsx
"use client";

import React, { useState } from "react";
import {
  Grid,
  Button,
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Collapse,
  IconButton,
  Chip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import Flex from "@/global/Flex";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { Typography } from "@mui/material";

export interface FilterState {
  trade: string;
  region: string;
  startDate: string;
  sortBy: string;
  searchText: string;
  projectType: string;
  minPrice: string;
  maxPrice: string;
}

interface FilterOptions {
  trades: string[];
  regions: string[];
  projectTypes: string[];
}

interface ProjectFiltersProps {
  filters: FilterState;
  filterOptions: FilterOptions;
  resultsCount: number;
  totalCount: number;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  filters,
  filterOptions,
  resultsCount,

  onFilterChange,
  onClearFilters,
}) => {
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);

  const hasActiveFilters =
    filters.trade ||
    filters.region ||
    filters.startDate ||
    filters.searchText.trim() ||
    filters.projectType ||
    filters.minPrice ||
    filters.maxPrice;

  return (
    <CustomCard
      undecorated={true}
      sx={{
        padding: 2,
      }}
    >
      <TextField
        size="small"
        fullWidth
        variant="outlined"
        placeholder="Search projects by title, description, trade, or location..."
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
                <MenuItem value="start_date_soon">Starting Soon</MenuItem>
                <MenuItem value="title_az">Title A-Z</MenuItem>
                <MenuItem value="price_high">Highest Price</MenuItem>
                <MenuItem value="price_low">Lowest Price</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Trade</InputLabel>
              <Select
                value={filters.trade}
                label="Trade"
                onChange={(e) => onFilterChange("trade", e.target.value)}
              >
                <MenuItem value="">All Trades</MenuItem>
                {filterOptions.trades.map((trade) => (
                  <MenuItem key={trade} value={trade}>
                    {trade}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

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

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Project Type</InputLabel>
              <Select
                value={filters.projectType}
                label="Project Type"
                onChange={(e) => onFilterChange("projectType", e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {filterOptions.projectTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Starting By"
                value={filters.startDate ? dayjs(filters.startDate) : null}
                onChange={(newValue) => {
                  if (newValue && dayjs.isDayjs(newValue)) {
                    onFilterChange("startDate", newValue.format("YYYY-MM-DD"));
                  } else {
                    onFilterChange("startDate", "");
                  }
                }}
                slots={{
                  openPickerIcon: () => (
                    <Box
                      color="primary.main"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Icon icon="mdi:calendar" height={20} />
                    </Box>
                  ),
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4.5 }}>
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
        </Grid>
      </Collapse>
    </CustomCard>
  );
};

export default ProjectFilters;
