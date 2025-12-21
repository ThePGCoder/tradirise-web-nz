// app/listings/marketplace/vehicles/add/components/steps/PricingLocationStep.tsx
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
import { nzRegions } from "@/lib/data/regions";
import { priceTypes } from "@/lib/data/vehicleData";

interface PricingLocationStepProps {
  formData: VehicleFormData;
  onInputChange: <K extends keyof VehicleFormData>(
    field: K,
    value: VehicleFormData[K]
  ) => void;
}

const PricingLocationStep: React.FC<PricingLocationStepProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Pricing & Location
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Set your asking price and specify where the vehicle is located.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            required
            type="number"
            label="Asking Price"
            value={formData.price || ""}
            onChange={(e) =>
              onInputChange("price", parseFloat(e.target.value) || 0)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            inputProps={{ min: 0, step: 100 }}
            helperText="Enter your asking price in NZD"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth required>
            <InputLabel>Price Type</InputLabel>
            <Select
              value={formData.price_type}
              label="Price Type"
              onChange={(e) => onInputChange("price_type", e.target.value)}
            >
              {priceTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            Select the region where the vehicle is located
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              p: 2,
              backgroundColor: "info.lighter",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "info.light",
            }}
          >
            <Typography variant="body2" color="info.dark" fontWeight="bold">
              Pricing Tips:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2.5 }}>
              <Typography component="li" variant="body2" color="info.dark">
                Research similar vehicles to price competitively
              </Typography>
              <Typography component="li" variant="body2" color="info.dark">
                Consider the vehicle&apos;s age, condition, and mileage
              </Typography>
              <Typography component="li" variant="body2" color="info.dark">
                Be honest about any issues to build trust with buyers
              </Typography>
              <Typography component="li" variant="body2" color="info.dark">
                Choose &quot;negotiable&quot; if you&apos;re open to offers
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PricingLocationStep;
