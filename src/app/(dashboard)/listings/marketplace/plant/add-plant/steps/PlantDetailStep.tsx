// app/listings/marketplace/plant/add/components/steps/PlantDetailsStep.tsx
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
  InputAdornment,
} from "@mui/material";

import {
  equipmentTypes,
  equipmentCategories,
  equipmentMakes,
  equipmentConditions,
} from "@/lib/data/plantData";
import { PlantFormData } from "../plant-form-types";

interface PlantDetailsStepProps {
  formData: PlantFormData;
  onInputChange: <K extends keyof PlantFormData>(
    field: K,
    value: PlantFormData[K]
  ) => void;
}

const PlantDetailsStep: React.FC<PlantDetailsStepProps> = ({
  formData,
  onInputChange,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Plant & Equipment Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide the basic information about your plant or equipment.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Listing Title"
            value={formData.title}
            onChange={(e) => onInputChange("title", e.target.value)}
            placeholder="e.g., 2020 Caterpillar 320 Excavator"
            helperText="Create a descriptive title"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth required>
            <InputLabel>Equipment Type</InputLabel>
            <Select
              value={formData.equipment_type}
              label="Equipment Type"
              onChange={(e) => onInputChange("equipment_type", e.target.value)}
            >
              {equipmentTypes.map((type) => (
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
              {equipmentCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Make</InputLabel>
            <Select
              value={formData.make || ""}
              label="Make"
              onChange={(e) => onInputChange("make", e.target.value)}
            >
              <MenuItem value="">
                <em>Not specified</em>
              </MenuItem>
              {equipmentMakes.map((make) => (
                <MenuItem key={make} value={make}>
                  {make}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Model"
            value={formData.model || ""}
            onChange={(e) => onInputChange("model", e.target.value)}
            placeholder="e.g., 320D"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="number"
            label="Year"
            value={formData.year || ""}
            onChange={(e) =>
              onInputChange("year", parseInt(e.target.value) || undefined)
            }
            inputProps={{ min: 1900, max: currentYear + 1 }}
            helperText="Manufacturing year (optional)"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth required>
            <InputLabel>Condition</InputLabel>
            <Select
              value={formData.condition}
              label="Condition"
              onChange={(e) => onInputChange("condition", e.target.value)}
            >
              {equipmentConditions.map((condition) => (
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
            type="number"
            label="Hours Used"
            value={formData.hours_used || ""}
            onChange={(e) =>
              onInputChange("hours_used", parseInt(e.target.value) || undefined)
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">hours</InputAdornment>
              ),
            }}
            helperText="Operating hours (if applicable)"
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
            helperText={`Describe the equipment's condition, features, and history. Minimum 20 characters. (${formData.description.length}/20)`}
            placeholder="Describe your plant or equipment in detail. Include information about its condition, service history, capabilities, and any accessories included..."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlantDetailsStep;
