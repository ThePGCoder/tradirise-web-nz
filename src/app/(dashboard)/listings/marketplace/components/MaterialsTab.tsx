// app/listings/marketplace/components/MaterialsTab.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Grid,
  Typography,
  Pagination,
  Snackbar,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Icon } from "@iconify/react";
import Flex from "@/global/Flex";
import EmptyResult from "@/components/EmptyResult";

import { MaterialAd } from "../page";
import MaterialCard from "./MaterialCard";
import MaterialCardCompact from "./MaterialCardCompact";
import MaterialFilters, { MaterialFilterState } from "./MaterialFilters";
import dayjs from "dayjs";

interface MaterialsTabProps {
  materials: MaterialAd[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

type ViewMode = "grid" | "compact" | "table";

const MaterialsTab: React.FC<MaterialsTabProps> = ({
  materials,
  currentPage,
  totalPages,
  totalCount,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("materialViewMode");
      return (saved as ViewMode) || "grid";
    }
    return "grid";
  });

  const [filters, setFilters] = useState<MaterialFilterState>({
    materialType: "",
    category: "",
    brand: "",
    region: "",
    condition: "",
    unit: "",
    minPrice: "",
    maxPrice: "",
    searchText: "",
    sortBy: "newest",
  });

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const materialTypes = [
      ...new Set(materials.map((m) => m.material_type).filter(Boolean)),
    ];
    const categories = [
      ...new Set(materials.map((m) => m.category).filter(Boolean)),
    ];
    const brands = [
      ...new Set(
        materials.map((m) => m.brand).filter((b): b is string => Boolean(b))
      ),
    ];
    const regions = [
      ...new Set(materials.map((m) => m.region).filter(Boolean)),
    ];
    const conditions = [
      ...new Set(materials.map((m) => m.condition).filter(Boolean)),
    ];
    const units = [...new Set(materials.map((m) => m.unit).filter(Boolean))];

    return {
      materialTypes: materialTypes.sort(),
      categories: categories.sort(),
      brands: brands.sort(),
      regions: regions.sort(),
      conditions: conditions.sort(),
      units: units.sort(),
    };
  }, [materials]);

  // Filter and sort materials
  const filteredMaterials = useMemo(() => {
    let filtered = [...materials];

    // Text search
    if (filters.searchText.trim()) {
      const searchTerm = filters.searchText.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          (item.brand && item.brand.toLowerCase().includes(searchTerm)) ||
          item.material_type.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply filters
    if (filters.materialType) {
      filtered = filtered.filter(
        (m) => m.material_type === filters.materialType
      );
    }
    if (filters.category) {
      filtered = filtered.filter((m) => m.category === filters.category);
    }
    if (filters.brand) {
      filtered = filtered.filter((m) => m.brand === filters.brand);
    }
    if (filters.region) {
      filtered = filtered.filter((m) => m.region === filters.region);
    }
    if (filters.condition) {
      filtered = filtered.filter((m) => m.condition === filters.condition);
    }
    if (filters.unit) {
      filtered = filtered.filter((m) => m.unit === filters.unit);
    }

    // Price range
    if (filters.minPrice) {
      filtered = filtered.filter(
        (m) => m.price >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(
        (m) => m.price <= parseFloat(filters.maxPrice)
      );
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.posted_date).getTime() -
            new Date(a.posted_date).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.posted_date).getTime() -
            new Date(b.posted_date).getTime()
        );
        break;
      case "price_low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "quantity_high":
        filtered.sort((a, b) => b.quantity - a.quantity);
        break;
    }

    return filtered;
  }, [materials, filters]);

  const handleFilterChange = (
    key: keyof MaterialFilterState,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      materialType: "",
      category: "",
      brand: "",
      region: "",
      condition: "",
      unit: "",
      minPrice: "",
      maxPrice: "",
      searchText: "",
      sortBy: "newest",
    });
  };

  const handleViewDetails = (materialId: string) => {
    router.push(`/listings/marketplace/material/${materialId}`);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/listings/marketplace?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: ViewMode | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
      localStorage.setItem("materialViewMode", newMode);
    }
  };

  const hasActiveFilters =
    filters.materialType ||
    filters.category ||
    filters.brand ||
    filters.region ||
    filters.condition ||
    filters.unit ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.searchText.trim();

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: "",
      width: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Avatar
            src={params.row.images?.[0] || undefined}
            alt={params.row.title}
            variant="rounded"
            sx={{ width: 35, height: 35 }}
          >
            <Icon icon="mdi:package-variant" width={20} />
          </Avatar>
        </Box>
      ),
    },
    {
      field: "title",
      headerName: "Material",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "material_type",
      headerName: "Type",
      width: 150,
    },
    {
      field: "category",
      headerName: "Category",
      width: 130,
    },
    {
      field: "brand",
      headerName: "Brand",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body2">{params.row.brand || "N/A"}</Typography>
        </Box>
      ),
    },
    {
      field: "condition",
      headerName: "Condition",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.row.condition}
          size="small"
          color={params.row.condition === "new" ? "success" : "default"}
          sx={{ fontSize: "0.75rem" }}
        />
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 130,
      type: "number",
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body2" fontWeight={600} color="primary">
            ${params.row.price.toLocaleString()}/{params.row.unit}
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
      field: "quantity",
      headerName: "Qty",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="body2">
            {params.row.quantity} {params.row.unit}
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
      <MaterialFilters
        filters={filters}
        filterOptions={filterOptions}
        resultsCount={filteredMaterials.length}
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
          })}
          color="text.secondary"
        >
          Showing {filteredMaterials.length} of {totalCount} material listings
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
            rows={filteredMaterials}
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
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((item) => (
              <Grid
                key={item.id}
                size={
                  viewMode === "compact"
                    ? { xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }
                    : { xs: 12, sm: 6, md: 12, lg: 6, xl: 4 }
                }
              >
                {viewMode === "compact" ? (
                  <MaterialCardCompact
                    material={item}
                    onViewDetails={handleViewDetails}
                  />
                ) : (
                  <MaterialCard
                    material={item}
                    onViewDetails={handleViewDetails}
                  />
                )}
              </Grid>
            ))
          ) : (
            <Grid key="no-materials" size={12}>
              <EmptyResult
                icon="mdi:package-variant"
                description="Add a materials listing to see it here."
                title={
                  hasActiveFilters
                    ? "No materials match your filters"
                    : "No materials available"
                }
                showButton={true}
                buttonText={
                  hasActiveFilters ? "Clear All Filters" : "Add Materials"
                }
                onButtonClick={() => {
                  if (hasActiveFilters) {
                    clearAllFilters();
                  } else {
                    router.push("/listings/marketplace/materials/add");
                  }
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

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        message={success}
      />
    </>
  );
};

export default MaterialsTab;
