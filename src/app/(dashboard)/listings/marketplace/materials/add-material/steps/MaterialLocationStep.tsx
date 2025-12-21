// app/listings/marketplace/material/add/steps/MaterialLocationStep.tsx
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

import { nzRegions } from "@/lib/data/regions";
import { MaterialFormData } from "../../material-form-types";

interface MaterialLocationStepProps {
  formData: MaterialFormData;
  onInputChange: <K extends keyof MaterialFormData>(
    field: K,
    value: MaterialFormData[K]
  ) => void;
}

const MaterialLocationStep: React.FC<MaterialLocationStepProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Location
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Specify where the materials are located.
      </Typography>

      <Grid container spacing={3}>
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
            Select the region where the materials are located
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Location Details"
            value={formData.location_details || ""}
            onChange={(e) => onInputChange("location_details", e.target.value)}
            placeholder="e.g., Located at construction yard on Main Street, accessible via rear gate. Available for viewing weekdays 8am-5pm."
            helperText="Provide specific location details, access information, or viewing arrangements (optional)"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              p: 2,
              backgroundColor: "warning.lighter",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "warning.light",
            }}
          >
            <Typography variant="body2" color="warning.dark" fontWeight="bold">
              Location Tips:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2.5 }}>
              <Typography component="li" variant="body2" color="warning.dark">
                Don&#39;t share your full address publicly - buyers can request
                it privately
              </Typography>
              <Typography component="li" variant="body2" color="warning.dark">
                Include access information (loading dock, forklift available,
                etc.)
              </Typography>
              <Typography component="li" variant="body2" color="warning.dark">
                Mention any viewing or collection time restrictions
              </Typography>
              <Typography component="li" variant="body2" color="warning.dark">
                Specify if materials are stored indoors or outdoors
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MaterialLocationStep;
