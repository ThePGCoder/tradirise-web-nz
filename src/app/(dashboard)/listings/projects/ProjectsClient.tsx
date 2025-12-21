// app/listings/projects/ProjectsClient.tsx
"use client";

import React, { useContext, useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Typography,
  Grid,
  Box,
  Snackbar,
  Alert,
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

import ProjectsCard from "./components/ProjectsCard";
import ProjectsCardCompact from "./components/ProjectsCardCompact";
import ProjectFilters, { FilterState } from "./components/ProjectFilters";

import { Project } from "@/types/projects";
import PageHeader from "@/components/PageHeader";
import AddButton from "../../layout/components/AddButton";

import EmptyResult from "@/components/EmptyResult";

dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);

interface ProjectsClientProps {
  initialProjects: Project[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

type ViewMode = "grid" | "compact" | "table";

const ProjectsClient: React.FC<ProjectsClientProps> = ({
  initialProjects,
  currentPage,
  totalPages,
  totalCount,
}) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("projectsViewMode");
      return (saved as ViewMode) || "grid";
    }
    return "grid";
  });

  const [filters, setFilters] = useState<FilterState>({
    trade: "",
    region: "",
    startDate: "",
    sortBy: "newest",
    searchText: "",
    projectType: "",
    minPrice: "",
    maxPrice: "",
  });

  const filterOptions = useMemo(() => {
    const trades = new Set<string>();
    initialProjects.forEach((p) => {
      p.required_trades?.forEach((trade) => trades.add(trade));
    });

    const regions = [
      ...new Set(initialProjects.map((p) => p.region).filter(Boolean)),
    ];

    const projectTypes = [
      ...new Set(initialProjects.map((p) => p.project_type).filter(Boolean)),
    ];

    return {
      trades: Array.from(trades).sort(),
      regions: regions.sort(),
      projectTypes: projectTypes.sort(),
    };
  }, [initialProjects]);

  const extractNumericPrice = (priceRange: string): number => {
    const match = priceRange.match(/\$?(\d+(?:,\d{3})*(?:\.\d+)?)/);
    return match ? parseFloat(match[1].replace(/,/g, "")) : 0;
  };

  const filteredProjects = useMemo(() => {
    let filtered = [...initialProjects];

    if (filters.searchText.trim()) {
      const searchTerm = filters.searchText.toLowerCase().trim();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          project.region.toLowerCase().includes(searchTerm) ||
          project.company_name.toLowerCase().includes(searchTerm) ||
          project.required_trades?.some((trade) =>
            trade.toLowerCase().includes(searchTerm)
          )
      );
    }

    if (filters.trade) {
      filtered = filtered.filter((project) =>
        project.required_trades?.includes(filters.trade)
      );
    }

    if (filters.region) {
      filtered = filtered.filter(
        (project) => project.region === filters.region
      );
    }

    if (filters.projectType) {
      filtered = filtered.filter(
        (project) => project.project_type === filters.projectType
      );
    }

    if (filters.startDate) {
      const filterDate = dayjs(filters.startDate);
      filtered = filtered.filter((project) =>
        dayjs(project.proposed_start_date).isSameOrBefore(filterDate, "day")
      );
    }

    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      filtered = filtered.filter((project) => {
        const projectPrice = extractNumericPrice(project.price_range);
        return projectPrice >= minPrice;
      });
    }

    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      filtered = filtered.filter((project) => {
        const projectPrice = extractNumericPrice(project.price_range);
        return projectPrice <= maxPrice;
      });
    }

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
            dayjs(a.proposed_start_date).valueOf() -
            dayjs(b.proposed_start_date).valueOf()
        );
        break;
      case "title_az":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "price_high":
        filtered.sort(
          (a, b) =>
            extractNumericPrice(b.price_range) -
            extractNumericPrice(a.price_range)
        );
        break;
      case "price_low":
        filtered.sort(
          (a, b) =>
            extractNumericPrice(a.price_range) -
            extractNumericPrice(b.price_range)
        );
        break;
    }

    return filtered;
  }, [initialProjects, filters]);

  useEffect(() => {
    changeActiveRoute("Projects");
  }, [changeActiveRoute]);

  const handleViewDetails = (projectId: string) => {
    router.push(`/listings/projects/${projectId}`);
  };

  const handleSave = (projectId: string) => {
    console.log(`Saving project ID: ${projectId}`);
    setSuccess("Project saved to your favorites!");
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
      projectType: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/listings/projects?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: ViewMode | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
      localStorage.setItem("projectsViewMode", newMode);
    }
  };

  const hasActiveFilters =
    filters.trade ||
    filters.region ||
    filters.startDate ||
    filters.searchText.trim() ||
    filters.projectType ||
    filters.minPrice ||
    filters.maxPrice;

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: "logo",
      headerName: "",
      width: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        // Check if it's a business listing or personal listing
        const isBusinessListing = params.row.is_business_listing;
        const logoUrl = isBusinessListing
          ? params.row.businesses?.logo_url || params.row.company_logo_url
          : params.row.profiles?.avatar_url;
        const fallbackInitial = isBusinessListing
          ? params.row.businesses?.business_name?.[0] ||
            params.row.company_name?.[0] ||
            "B"
          : params.row.profiles?.first_name?.[0] || "P";

        return (
          <Box display="flex" alignItems="center" height="100%">
            <Avatar
              src={logoUrl || undefined}
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
      headerName: "Project",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "project_type",
      headerName: "Type",
      width: 130,
    },
    {
      field: "price_range",
      headerName: "Budget",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body2" fontWeight={600} color="primary">
            {params.row.price_range}
          </Typography>
        </Box>
      ),
    },
    {
      field: "region",
      headerName: "Location",
      width: 130,
    },
    {
      field: "required_trades",
      headerName: "Trades Needed",
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.row.required_trades?.length || 0}
          size="small"
          variant="outlined"
          sx={{ fontSize: "0.75rem" }}
        />
      ),
    },
    {
      field: "proposed_start_date",
      headerName: "Start Date",
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body2">
            {dayjs(params.row.proposed_start_date).format("MMM D, YYYY")}
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
          title="Available Projects"
          description="Find your next project opportunity in the construction industry"
        />

        <ProjectFilters
          filters={filters}
          filterOptions={filterOptions}
          resultsCount={filteredProjects.length}
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
            Showing {filteredProjects.length} of {totalCount} projects
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
              rows={filteredProjects}
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
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <Grid
                  key={project.id}
                  size={
                    viewMode === "compact"
                      ? { xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }
                      : { xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }
                  }
                >
                  {viewMode === "compact" ? (
                    <ProjectsCardCompact
                      project={project}
                      onViewDetails={handleViewDetails}
                    />
                  ) : (
                    <ProjectsCard
                      project={project}
                      onViewDetails={handleViewDetails}
                      onSave={handleSave}
                    />
                  )}
                </Grid>
              ))
            ) : (
              <Grid key="no-projects" size={12}>
                <EmptyResult
                  icon="mingcute:house-fill"
                  description="Add a project to see it here."
                  title={
                    hasActiveFilters
                      ? "No projects match your filters"
                      : "No projects available at the moment"
                  }
                  showButton={true}
                  buttonText={
                    hasActiveFilters ? "Clear All Filters" : "Add A Project"
                  }
                  onButtonClick={() => {
                    clearAllFilters();
                    router.push("/listings/projects/add-project");
                  }}
                  height="calc(100vh * 0.5)"
                />
              </Grid>
            )}
          </Grid>
        )}

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
      </Box>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        message={success}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <AddButton />
    </>
  );
};

export default ProjectsClient;
