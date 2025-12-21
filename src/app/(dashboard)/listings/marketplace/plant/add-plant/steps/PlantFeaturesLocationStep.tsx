// app/listings/marketplace/plant/add/components/steps/PlantFeaturesLocationStep.tsx
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
  Autocomplete,
  Chip,
} from "@mui/material";
import { Icon } from "@iconify/react";

import { nzRegions } from "@/lib/data/regions";
import { commonPlantFeatures } from "@/lib/data/plantData";
import { PlantFormData } from "../plant-form-types";

interface PlantFeaturesLocationStepProps {
  formData: PlantFormData;
  onInputChange: <K extends keyof PlantFormData>(
    field: K,
    value: PlantFormData[K]
  ) => void;
}

const PlantFeaturesLocationStep: React.FC<PlantFeaturesLocationStepProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Features & Location
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add features and specify where the equipment is located.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Autocomplete
            multiple
            freeSolo
            options={commonPlantFeatures}
            value={formData.features}
            onChange={(_, newValue) => {
              onInputChange("features", newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Features"
                placeholder="Select or type features"
                helperText="Select from common features or type your own"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  color="primary"
                  variant="outlined"
                  deleteIcon={<Icon icon="mdi:close" />}
                />
              ))
            }
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth required>
            <InputLabel>Region</InputLabel>
            <Select
              value={formData.region}
              label="Region"
              onChange={(e) => onInputChange("region", e.target.value)}
            >
              {nzRegions.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Select the region where the equipment is located
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlantFeaturesLocationStep;
