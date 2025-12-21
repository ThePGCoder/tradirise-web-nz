// app/listings/marketplace/vehicles/add/components/steps/ImagesContactStep.tsx
"use client";

import React from "react";
import { TextField, Grid, Typography, Box } from "@mui/material";

import { VehicleFormData } from "../../vehicle-form-types";
import ImageUploader from "../ImageUploader";

interface ImagesContactStepProps {
  formData: VehicleFormData;
  onInputChange: <K extends keyof VehicleFormData>(
    field: K,
    value: VehicleFormData[K]
  ) => void;
  currentUserEmail?: string;
  currentUserName?: string;
}

const ImagesContactStep: React.FC<ImagesContactStepProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Images & Contact Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload photos of your vehicle and provide contact details for potential
        buyers.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <ImageUploader
            images={formData.images}
            onChange={(newImages) => onInputChange("images", newImages)}
            maxImages={10}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography
            variant="subtitle1"
            fontWeight={500}
            gutterBottom
            sx={{ mt: 2 }}
          >
            Contact Information
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This information will be visible to potential buyers
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            label="Contact Name"
            value={formData.contact_name}
            onChange={(e) => onInputChange("contact_name", e.target.value)}
            helperText="Your name or business name"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            type="email"
            label="Contact Email"
            value={formData.contact_email}
            onChange={(e) => onInputChange("contact_email", e.target.value)}
            helperText="Email for enquiries"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            type="tel"
            label="Contact Phone"
            value={formData.contact_phone}
            onChange={(e) => onInputChange("contact_phone", e.target.value)}
            helperText="Phone number for enquiries"
            placeholder="e.g., 021 123 4567"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImagesContactStep;
