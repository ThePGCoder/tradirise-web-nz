// app/listings/marketplace/plant/add/components/steps/PlantPricingStep.tsx
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
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { priceTypes } from "@/lib/data/plantData";
import { PlantFormData } from "../plant-form-types";

interface PlantPricingStepProps {
  formData: PlantFormData;
  onInputChange: <K extends keyof PlantFormData>(
    field: K,
    value: PlantFormData[K]
  ) => void;
}

const PlantPricingStep: React.FC<PlantPricingStepProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Pricing & Options
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Set your sale price and delivery options.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            required
            type="number"
            label="Sale Price"
            value={formData.sale_price || ""}
            onChange={(e) =>
              onInputChange("sale_price", parseFloat(e.target.value) || 0)
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
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Additional Options
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.delivery_available}
                onChange={(e) =>
                  onInputChange("delivery_available", e.target.checked)
                }
              />
            }
            label="Delivery available"
          />
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
                Research similar equipment to price competitively
              </Typography>
              <Typography component="li" variant="body2" color="info.dark">
                Consider age, condition, and hours used
              </Typography>
              <Typography component="li" variant="body2" color="info.dark">
                Include service history to justify higher prices
              </Typography>
              <Typography component="li" variant="body2" color="info.dark">
                Choose &#34;negotiable&#34; if you&#39;re open to offers
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlantPricingStep;
