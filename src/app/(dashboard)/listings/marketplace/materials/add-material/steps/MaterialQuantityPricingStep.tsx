// app/listings/marketplace/material/add/steps/MaterialQuantityPricingStep.tsx
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

import {
  materialUnits,
  priceUnits,
  priceTypes,
  deliveryCostOptions,
} from "@/lib/data/materialData";
import { MaterialFormData } from "../../material-form-types";

interface MaterialQuantityPricingStepProps {
  formData: MaterialFormData;
  onInputChange: <K extends keyof MaterialFormData>(
    field: K,
    value: MaterialFormData[K]
  ) => void;
}

const MaterialQuantityPricingStep: React.FC<
  MaterialQuantityPricingStepProps
> = ({ formData, onInputChange }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Quantity & Pricing
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Specify the quantity available and set your pricing.
      </Typography>

      <Grid container spacing={3}>
        {/* Quantity Section */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
            Quantity Information
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            type="number"
            label="Total Quantity"
            value={formData.quantity || ""}
            onChange={(e) =>
              onInputChange("quantity", parseFloat(e.target.value) || 0)
            }
            inputProps={{ min: 0, step: 0.01 }}
            helperText="Total quantity you're listing"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth required>
            <InputLabel>Unit</InputLabel>
            <Select
              value={formData.unit}
              label="Unit"
              onChange={(e) => onInputChange("unit", e.target.value)}
            >
              {materialUnits.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="number"
            label="Available Quantity"
            value={formData.available_quantity || ""}
            onChange={(e) =>
              onInputChange(
                "available_quantity",
                parseFloat(e.target.value) || undefined
              )
            }
            inputProps={{ min: 0, step: 0.01 }}
            helperText="Currently available (optional, defaults to total quantity)"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Minimum Order"
            value={formData.minimum_order || ""}
            onChange={(e) => onInputChange("minimum_order", e.target.value)}
            placeholder="e.g., 1 tonne, 5m³, 10 bags"
            helperText="Minimum order quantity (optional)"
          />
        </Grid>

        {/* Pricing Section */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Pricing Information
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            type="number"
            label="Price"
            value={formData.price || ""}
            onChange={(e) =>
              onInputChange("price", parseFloat(e.target.value) || 0)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            inputProps={{ min: 0, step: 1 }}
            helperText="Your asking price in NZD"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Price Unit</InputLabel>
            <Select
              value={formData.price_unit || ""}
              label="Price Unit"
              onChange={(e) => onInputChange("price_unit", e.target.value)}
            >
              <MenuItem value="">
                <em>Select unit (optional)</em>
              </MenuItem>
              {priceUnits.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
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

        {/* Delivery Section */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Delivery Options
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
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

        {formData.delivery_available && (
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Delivery Cost</InputLabel>
              <Select
                value={formData.delivery_cost || ""}
                label="Delivery Cost"
                onChange={(e) => onInputChange("delivery_cost", e.target.value)}
              >
                <MenuItem value="">
                  <em>Not specified</em>
                </MenuItem>
                {deliveryCostOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

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
                Research current market rates for similar materials
              </Typography>
              <Typography component="li" variant="body2" color="info.dark">
                Consider bulk pricing discounts for larger orders
              </Typography>
              <Typography component="li" variant="body2" color="info.dark">
                Factor in delivery costs if offering delivery
              </Typography>
              <Typography component="li" variant="body2" color="info.dark">
                Be clear about your pricing unit (per tonne, per m³, etc.)
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MaterialQuantityPricingStep;
