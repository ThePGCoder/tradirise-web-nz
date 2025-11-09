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
} from "@mui/material";

import Flex from "@/global/Flex";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";

import ProjectsCard from "./components/ProjectsCard";
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

  /*const handleQuickApply = async (projectId: string) => {
    try {
      const response = await fetch("/api/ad-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad_id: projectId, ad_type: "project" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setSuccess(
        "Application submitted successfully! The employer will contact you if you're selected."
      );

      window.location.reload();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit application";
      console.error("Error applying for project:", err);
      setError(errorMessage);
    }
  };*/

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

  const hasActiveFilters =
    filters.trade ||
    filters.region ||
    filters.startDate ||
    filters.searchText.trim() ||
    filters.projectType ||
    filters.minPrice ||
    filters.maxPrice;

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
          <Typography variant="body2" color="text.secondary">
            Page {currentPage} of {totalPages}
          </Typography>
        </Flex>

        <Grid container columnSpacing={3} rowGap={3}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Grid
                key={project.id}
                size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}
              >
                <ProjectsCard
                  project={project}
                  onViewDetails={handleViewDetails}
                  onSave={handleSave}
                />
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
