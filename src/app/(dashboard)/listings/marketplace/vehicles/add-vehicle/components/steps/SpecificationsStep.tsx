// app/listings/marketplace/vehicles/add/components/steps/SpecificationsStep.tsx
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import { VehicleFormData } from "../../vehicle-form-types";
import {
  commonFeatures,
  fuelTypes,
  transmissionTypes,
} from "@/lib/data/vehicleData";

interface SpecificationsStepProps {
  formData: VehicleFormData;
  onInputChange: <K extends keyof VehicleFormData>(
    field: K,
    value: VehicleFormData[K]
  ) => void;
}

const SpecificationsStep: React.FC<SpecificationsStepProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Specifications & Features
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add technical specifications and features of your vehicle.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Transmission</InputLabel>
            <Select
              value={formData.transmission || ""}
              label="Transmission"
              onChange={(e) => onInputChange("transmission", e.target.value)}
            >
              <MenuItem value="">
                <em>Not specified</em>
              </MenuItem>
              {transmissionTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Fuel Type</InputLabel>
            <Select
              value={formData.fuel_type || ""}
              label="Fuel Type"
              onChange={(e) => onInputChange("fuel_type", e.target.value)}
            >
              <MenuItem value="">
                <em>Not specified</em>
              </MenuItem>
              {fuelTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Registration Expiry"
              value={
                formData.registration_expires
                  ? dayjs(formData.registration_expires)
                  : null
              }
              onChange={(newValue) => {
                onInputChange(
                  "registration_expires",
                  newValue ? dayjs(newValue).format("YYYY-MM-DD") : undefined
                );
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: "Leave blank if not applicable",
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="WOF Expiry"
              value={formData.wof_expires ? dayjs(formData.wof_expires) : null}
              onChange={(newValue) => {
                onInputChange(
                  "wof_expires",
                  newValue ? dayjs(newValue).format("YYYY-MM-DD") : undefined
                );
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: "Warrant of Fitness expiry date",
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Autocomplete
            multiple
            freeSolo
            options={commonFeatures}
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
      </Grid>
    </Box>
  );
};

export default SpecificationsStep;
