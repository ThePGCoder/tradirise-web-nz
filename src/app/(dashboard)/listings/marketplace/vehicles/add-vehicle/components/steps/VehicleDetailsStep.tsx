// app/listings/marketplace/vehicles/add/components/steps/VehicleDetailsStep.tsx
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
import { VehicleFormData } from "../../vehicle-form-types";
import {
  vehicleTypes,
  vehicleMakes,
  vehicleConditions,
} from "@/lib/data/vehicleData";

interface VehicleDetailsStepProps {
  formData: VehicleFormData;
  onInputChange: <K extends keyof VehicleFormData>(
    field: K,
    value: VehicleFormData[K]
  ) => void;
}

const VehicleDetailsStep: React.FC<VehicleDetailsStepProps> = ({
  formData,
  onInputChange,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Vehicle Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide the basic information about your vehicle.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Listing Title"
            value={formData.title}
            onChange={(e) => onInputChange("title", e.target.value)}
            placeholder="e.g., 2018 Ford Ranger XLT 4x4"
            helperText="Create a descriptive title that includes year, make, and model"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth required>
            <InputLabel>Vehicle Type</InputLabel>
            <Select
              value={formData.vehicle_type}
              label="Vehicle Type"
              onChange={(e) => onInputChange("vehicle_type", e.target.value)}
            >
              {vehicleTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth required>
            <InputLabel>Make</InputLabel>
            <Select
              value={formData.make}
              label="Make"
              onChange={(e) => onInputChange("make", e.target.value)}
            >
              {vehicleMakes.map((make) => (
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
            required
            label="Model"
            value={formData.model}
            onChange={(e) => onInputChange("model", e.target.value)}
            placeholder="e.g., Ranger XLT"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            type="number"
            label="Year"
            value={formData.year || ""}
            onChange={(e) =>
              onInputChange("year", parseInt(e.target.value) || 0)
            }
            inputProps={{ min: 1900, max: currentYear + 1 }}
            helperText={`Between 1900 and ${currentYear + 1}`}
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
              {vehicleConditions.map((condition) => (
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
            label="Mileage (km)"
            value={formData.mileage || ""}
            onChange={(e) =>
              onInputChange("mileage", parseInt(e.target.value) || undefined)
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">km</InputAdornment>,
            }}
            helperText="Leave blank if not applicable"
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
            helperText={`Describe the vehicle's condition, features, and history. Minimum 20 characters. (${formData.description.length}/20)`}
            placeholder="Describe your vehicle in detail. Include information about its condition, service history, any modifications, and why you're selling..."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default VehicleDetailsStep;
