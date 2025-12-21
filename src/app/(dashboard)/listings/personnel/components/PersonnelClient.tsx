"use client";

import React, { useContext, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Grid,
  Box,
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
import PersonnelCard from "./PersonnelCard";

import PersonnelFilters, { FilterState } from "./PersonnelFilters";

import { sharePersonnel } from "@/utils/shareUtils";
import { PersonnelWithProfile } from "../page";
import PageHeader from "@/components/PageHeader";
import AddButton from "@/app/(dashboard)/layout/components/AddButton";
import EmptyResult from "@/components/EmptyResult";
import PersonnelCardCompact from "./PersonnelCardCompact";

// Add dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);

interface PersonnelClientProps {
  initialPersonnel: PersonnelWithProfile[];
}

type ViewMode = "grid" | "compact" | "table";

const PersonnelClient: React.FC<PersonnelClientProps> = ({
  initialPersonnel,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("personnelViewMode");
      return (saved as ViewMode) || "grid";
    }
    return "grid";
  });

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    trade: "",
    accreditations: [],
    availableFrom: "",
    sortBy: "newest",
    region: "",
    searchText: "",
  });

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const trades = [
      ...new Set(
        initialPersonnel.map((p) => p.primary_trade_role).filter(Boolean)
      ),
    ];

    const accreditations = [
      ...new Set(initialPersonnel.flatMap((p) => p.accreditations || [])),
    ];

    const regions = [
      ...new Set(initialPersonnel.map((p) => p.region).filter(Boolean)),
    ];

    return {
      trades: trades.sort(),
      accreditations: accreditations.sort(),
      regions: regions.sort(),
    };
  }, [initialPersonnel]);

  // Filter and sort personnel based on current filters
  const filteredPersonnel = useMemo(() => {
    let filtered = [...initialPersonnel];

    // Text search
    if (filters.searchText.trim()) {
      const searchTerm = filters.searchText.toLowerCase().trim();
      filtered = filtered.filter(
        (person) =>
          `${person.first_name || ""} ${person.last_name || ""}`
            .toLowerCase()
            .includes(searchTerm) ||
          (person.primary_trade_role || "")
            .toLowerCase()
            .includes(searchTerm) ||
          (person.bio || "").toLowerCase().includes(searchTerm) ||
          (person.skills || []).some((skill) =>
            skill.toLowerCase().includes(searchTerm)
          ) ||
          (person.region || "").toLowerCase().includes(searchTerm)
      );
    }

    // Trade filter
    if (filters.trade) {
      filtered = filtered.filter(
        (person) => person.primary_trade_role === filters.trade
      );
    }

    // Region filter
    if (filters.region) {
      filtered = filtered.filter((person) => person.region === filters.region);
    }

    // Accreditations filter
    if (filters.accreditations.length > 0) {
      filtered = filtered.filter(
        (person) =>
          person.accreditations &&
          filters.accreditations.some((filterAcc) =>
            person.accreditations.includes(filterAcc)
          )
      );
    }

    // Available from filter
    if (filters.availableFrom) {
      const filterDate = dayjs(filters.availableFrom);
      filtered = filtered.filter((person) =>
        dayjs(person.available_from).isSameOrBefore(filterDate, "day")
      );
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf()
        );
        break;
      case "available_soon":
        filtered.sort(
          (a, b) =>
            dayjs(a.available_from).valueOf() -
            dayjs(b.available_from).valueOf()
        );
        break;
      case "name_az":
        filtered.sort((a, b) => {
          const nameA =
            `${a.first_name || ""} ${a.last_name || ""}`.trim() ||
            a.primary_trade_role;
          const nameB =
            `${b.first_name || ""} ${b.last_name || ""}`.trim() ||
            b.primary_trade_role;
          return nameA.localeCompare(nameB);
        });
        break;
    }

    return filtered;
  }, [initialPersonnel, filters]);

  useEffect(() => {
    changeActiveRoute("Personnel");
  }, [changeActiveRoute]);

  const handleViewDetails = (personnelId: string) => {
    router.push(`/listings/personnel/${personnelId}`);
  };

  const handleContact = (personnelId: string) => {
    console.log(`Contacting personnel ID: ${personnelId}`);
    const person = initialPersonnel.find((p) => p.id === personnelId);
    if (person?.contact_email) {
      window.location.href = `mailto:${person.contact_email}`;
    }
  };

  const handleSave = (personnelId: string) => {
    console.log(`Saving personnel ID: ${personnelId}`);
  };

  const handleShare = async (personnelId: string) => {
    const person = initialPersonnel.find((p) => p.id === personnelId);
    if (!person) return;

    try {
      const result = await sharePersonnel({
        id: person.id,
        first_name: person.first_name || "",
        last_name: person.last_name || "",
        primary_trade_role: person.primary_trade_role,
        region: person.region,
      });

      if (result.success) {
        if (result.method === "clipboard") {
          alert("Link copied to clipboard!");
        }
      } else if (result.cancelled) {
        console.log("Share cancelled by user");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      alert("Failed to share. Please try again.");
    }
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
      trade: "",
      accreditations: [],
      availableFrom: "",
      sortBy: "newest",
      region: "",
      searchText: "",
    });
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: ViewMode | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
      localStorage.setItem("personnelViewMode", newMode);
    }
  };

  const hasActiveFilters = Boolean(
    filters.trade ||
      filters.accreditations.length > 0 ||
      filters.availableFrom ||
      filters.region ||
      filters.searchText.trim()
  );

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      width: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Avatar
            src={
              params.row.profiles?.avatar_url ||
              params.row.avatar_url ||
              undefined
            }
            sx={{ width: 35, height: 35 }}
          >
            {params.row.first_name?.[0]}
            {params.row.last_name?.[0]}
          </Avatar>
        </Box>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body2" fontWeight={600}>
            {params.row.first_name} {params.row.last_name}
          </Typography>
        </Box>
      ),
    },
    {
      field: "primary_trade_role",
      headerName: "Trade",
      width: 150,
    },
    {
      field: "region",
      headerName: "Location",
      width: 130,
    },
    {
      field: "available_from",
      headerName: "Available",
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body2">
            {dayjs(params.row.available_from).format("MMM D, YYYY")}
          </Typography>
        </Box>
      ),
    },
    {
      field: "accreditations",
      headerName: "Accreditations",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.row.accreditations?.length || 0}
          size="small"
          variant="outlined"
          sx={{ fontSize: "0.75rem" }}
        />
      ),
    },
    {
      field: "years_experience",
      headerName: "Experience",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body2">
            {params.row.years_experience || "N/A"} years
          </Typography>
        </Box>
      ),
    },
    {
      field: "created_at",
      headerName: "Posted",
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
        title="Find Personnel"
        description="Connect with skilled professionals and contractors for your projects"
      />

      {/* Filters Component */}
      <PersonnelFilters
        filters={filters}
        filterOptions={filterOptions}
        filtersExpanded={filtersExpanded}
        hasActiveFilters={hasActiveFilters}
        resultsCount={filteredPersonnel.length}
        onFilterChange={handleFilterChange}
        onToggleFilters={() => setFiltersExpanded(!filtersExpanded)}
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
          })}
          color="text.secondary"
        >
          Showing {filteredPersonnel.length} of {initialPersonnel.length}{" "}
          personnel
          {hasActiveFilters && " (filtered)"}
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

      {/* Table View */}
      {viewMode === "table" ? (
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredPersonnel}
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
          {filteredPersonnel.length > 0 ? (
            filteredPersonnel.map((person) => (
              <Grid
                key={person.id}
                size={
                  viewMode === "compact"
                    ? { xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }
                    : { xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }
                }
              >
                {viewMode === "compact" ? (
                  <PersonnelCardCompact
                    person={person}
                    onViewDetails={handleViewDetails}
                  />
                ) : (
                  <PersonnelCard
                    person={person}
                    onViewDetails={handleViewDetails}
                    onContact={handleContact}
                    onSave={handleSave}
                    onShare={handleShare}
                  />
                )}
              </Grid>
            ))
          ) : (
            <Grid key="no-personnel" size={12}>
              <EmptyResult
                icon="entypo:v-card"
                description="Add personnel to see them here."
                title={
                  hasActiveFilters
                    ? "No personnel match your filters"
                    : "No personnel available at the moment"
                }
                showButton={true}
                buttonText={
                  hasActiveFilters ? "Clear All Filters" : "Add Personnel"
                }
                onButtonClick={() => {
                  if (hasActiveFilters) {
                    clearAllFilters();
                  } else {
                    router.push("/listings/personnel/add-personnel");
                  }
                }}
                height="calc(100vh * 0.5)"
              />
            </Grid>
          )}
        </Grid>
      )}

      <AddButton />
    </Box>
  );
};

export default PersonnelClient;
