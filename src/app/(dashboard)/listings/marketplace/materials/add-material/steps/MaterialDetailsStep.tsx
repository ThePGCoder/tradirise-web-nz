// app/listings/marketplace/material/add/steps/MaterialDetailsStep.tsx
"use client";

import React from "react";
import {
  TextField,
  Grid,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import {
  materialTypes,
  materialCategories,
  materialConditions,
} from "@/lib/data/materialData";
import { MaterialFormData } from "../../material-form-types";

interface MaterialDetailsStepProps {
  formData: MaterialFormData;
  onInputChange: <K extends keyof MaterialFormData>(
    field: K,
    value: MaterialFormData[K]
  ) => void;
}

const MaterialDetailsStep: React.FC<MaterialDetailsStepProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Material Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide the basic information about your materials.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Listing Title"
            value={formData.title}
            onChange={(e) => onInputChange("title", e.target.value)}
            placeholder="e.g., Premium Grade Concrete Mix - 20 Tonne"
            helperText="Create a descriptive title"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth required>
            <InputLabel>Material Type</InputLabel>
            <Select
              value={formData.material_type}
              label="Material Type"
              onChange={(e) => onInputChange("material_type", e.target.value)}
            >
              {materialTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => onInputChange("category", e.target.value)}
            >
              {materialCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth required>
            <InputLabel>Condition</InputLabel>
            <Select
              value={formData.condition}
              label="Condition"
              onChange={(e) => onInputChange("condition", e.target.value)}
            >
              {materialConditions.map((condition) => (
                <MenuItem key={condition} value={condition}>
                  {condition.charAt(0).toUpperCase() + condition.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Brand"
            value={formData.brand || ""}
            onChange={(e) => onInputChange("brand", e.target.value)}
            placeholder="e.g., Golden Bay Cement"
            helperText="Brand or manufacturer (optional)"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Grade/Quality"
            value={formData.grade_quality || ""}
            onChange={(e) => onInputChange("grade_quality", e.target.value)}
            placeholder="e.g., Grade A, Premium, Standard"
            helperText="Material grade or quality level (optional)"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Dimensions"
            value={formData.dimensions || ""}
            onChange={(e) => onInputChange("dimensions", e.target.value)}
            placeholder="e.g., 2400mm x 1200mm x 10mm"
            helperText="Size or dimensions (optional)"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            multiline
            rows={6}
            label="Description"
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            helperText={`Describe the materials in detail. Minimum 20 characters. (${formData.description.length}/20)`}
            placeholder="Describe your materials in detail. Include information about quality, specifications, origin, storage conditions, and any other relevant details..."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MaterialDetailsStep;
