// components/PositionFilters.tsx
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
  Box,
} from "@mui/material";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import Flex from "@/global/Flex";
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export interface FilterState {
  trade: string;
  region: string;
  startDate: string;
  sortBy: string;
  searchText: string;
  minRate: string;
  maxRate: string;
}

interface PositionFiltersProps {
  filters: FilterState;
  filterOptions: {
    trades: string[];
    regions: string[];
  };
  resultsCount: number;
  totalCount: number;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
}

const PositionFilters: React.FC<PositionFiltersProps> = ({
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
    filters.minRate ||
    filters.maxRate;

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
        placeholder="Search positions by title, trade, description, or location..."
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
                <MenuItem value="start_date_soon">Starting Soon</MenuItem>
                <MenuItem value="title_az">Title A-Z</MenuItem>
                <MenuItem value="rate_high">Highest Rate</MenuItem>
                <MenuItem value="rate_low">Lowest Rate</MenuItem>
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

          {/* Start Date */}
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

          {/* Rate Range */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Flex gap={1}>
              <TextField
                size="small"
                label="Min Rate ($)"
                type="number"
                value={filters.minRate}
                onChange={(e) => onFilterChange("minRate", e.target.value)}
                fullWidth
              />
              <TextField
                size="small"
                label="Max Rate ($)"
                type="number"
                value={filters.maxRate}
                onChange={(e) => onFilterChange("maxRate", e.target.value)}
                fullWidth
              />
            </Flex>
          </Grid>
        </Grid>
      </Collapse>
    </CustomCard>
  );
};

export default PositionFilters;
