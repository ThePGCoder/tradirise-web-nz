// src/app/listings/personnel/add-personnel/components/steps/PersonalInfoStep.tsx
"use client";

import React from "react";
import { TextField, Grid, Typography, Box } from "@mui/material";

import { PersonnelFormData } from "../../personnel-form-types";

interface PersonalInfoStepProps {
  formData: PersonnelFormData;
  onInputChange: <K extends keyof PersonnelFormData>(
    field: K,
    value: PersonnelFormData[K]
  ) => void;
  activeStep: number;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide basic contact information. This will be visible to potential
        employers.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            label="First Name"
            value={formData.first_name}
            onChange={(e) => onInputChange("first_name", e.target.value)}
            helperText="As it appears on official documents"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            label="Last Name"
            value={formData.last_name}
            onChange={(e) => onInputChange("last_name", e.target.value)}
            helperText="As it appears on official documents"
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
            helperText="Primary email for contact"
            error={
              formData.contact_email !== "" &&
              !/\S+@\S+\.\S+/.test(formData.contact_email)
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            label="Mobile Number"
            value={formData.mobile}
            onChange={(e) => onInputChange("mobile", e.target.value)}
            helperText="Include area code (e.g., 021 123 4567)"
            placeholder="021 123 4567"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Website (Optional)"
            value={formData.website || ""}
            onChange={(e) => onInputChange("website", e.target.value)}
            helperText="Your personal website or LinkedIn profile"
            placeholder="www.example.com"
          />
        </Grid>

        {!formData.is_for_self && (
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              required
              label="Posted By"
              value={formData.posted_by_name}
              onChange={(e) => onInputChange("posted_by_name", e.target.value)}
              helperText="Your name (person creating this listing)"
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PersonalInfoStep;
