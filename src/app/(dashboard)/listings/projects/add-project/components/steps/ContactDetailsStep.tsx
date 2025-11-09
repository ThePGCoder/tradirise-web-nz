// src/app/listings/projects/add-project/components/steps/ContactDetailsStep.tsx
"use client";

import React from "react";
import { TextField, Grid, Typography, Box } from "@mui/material";
import { ProjectFormData } from "../../project-form-types";

interface ContactDetailsStepProps {
  formData: ProjectFormData;
  onInputChange: <K extends keyof ProjectFormData>(
    field: K,
    value: ProjectFormData[K]
  ) => void;
}

const ContactDetailsStep: React.FC<ContactDetailsStepProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Contact & Company Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide contact details so contractors can reach you about this project.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Company/Client Name"
            value={formData.company_name}
            onChange={(e) => onInputChange("company_name", e.target.value)}
            placeholder="Your company or your name as the client"
            helperText="This will be displayed on your project listing"
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
            error={
              formData.contact_email !== "" &&
              !/\S+@\S+\.\S+/.test(formData.contact_email)
            }
            helperText="Email where contractors can reach you"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Contact Phone (Optional)"
            value={formData.contact_phone || ""}
            onChange={(e) => onInputChange("contact_phone", e.target.value)}
            placeholder="+64 21 123 4567"
            helperText="Phone number will be shown to contractors"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Posted By"
            value={formData.posted_by}
            disabled
            helperText="Your platform username (cannot be changed)"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactDetailsStep;
