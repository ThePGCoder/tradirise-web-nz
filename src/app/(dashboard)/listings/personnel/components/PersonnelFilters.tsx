"use client";

import React from "react";
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Collapse,
  IconButton,
  Chip,
  Grid,
  Button,
  Box,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CustomCard from "@/components/CustomCard";
import Flex from "@/global/Flex";
import { Typography } from "@mui/material";

export interface FilterState {
  trade: string;
  accreditations: string[];
  availableFrom: string;
  sortBy: string;
  region: string;
  searchText: string;
}

interface FilterOptions {
  trades: string[];
  accreditations: string[];
  regions: string[];
}

interface PersonnelFiltersProps {
  filters: FilterState;
  filterOptions: FilterOptions;
  filtersExpanded: boolean;
  hasActiveFilters: boolean;
  resultsCount: number;
  onFilterChange: (key: keyof FilterState, value: string | string[]) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
}

const PersonnelFilters: React.FC<PersonnelFiltersProps> = ({
  filters,
  filterOptions,
  filtersExpanded,
  hasActiveFilters,
  resultsCount,
  onFilterChange,
  onToggleFilters,
  onClearFilters,
}) => {
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
        placeholder="Search personnel by name, trade, skills, or location..."
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
          <IconButton onClick={onToggleFilters} size="small">
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
                <MenuItem value="available_soon">Available Soon</MenuItem>
                <MenuItem value="name_az">Name A-Z</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Trade Filter */}
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

          {/* Available From Date */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Available By"
                value={
                  filters.availableFrom ? dayjs(filters.availableFrom) : null
                }
                onChange={(newValue) => {
                  if (newValue && dayjs.isDayjs(newValue)) {
                    onFilterChange(
                      "availableFrom",
                      newValue.format("YYYY-MM-DD")
                    );
                  } else {
                    onFilterChange("availableFrom", "");
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
                sx={{
                  "& .MuiPickersInputBase-root:hover .MuiPickersOutlinedInput-notchedOutline":
                    {
                      border: "2px solid",
                      borderColor: "primary.main",
                    },
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Accreditations Filter */}
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              multiple
              size="small"
              options={filterOptions.accreditations}
              value={filters.accreditations}
              onChange={(_, newValue) =>
                onFilterChange("accreditations", newValue)
              }
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
                  label="Accreditations"
                  placeholder="Select accreditations..."
                />
              )}
            />
          </Grid>
        </Grid>
      </Collapse>
    </CustomCard>
  );
};

export default PersonnelFilters;
