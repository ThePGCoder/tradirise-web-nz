// src/components/steps/BusinessInfoStep.tsx
"use client";

import React from "react";
import {
  Typography,
  TextField,
  Stack,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Grid,
} from "@mui/material";
import { BusinessFormData, ImageFile } from "../../business-form-types";
import ImageUpload from "../ImageUpload";
import { groupedBusinessTypes, legalityTypes } from "@/lib/data/businessData";

interface BusinessInfoStepProps {
  formData: BusinessFormData;
  onInputChange: <K extends keyof BusinessFormData>(
    field: K,
    value: BusinessFormData[K]
  ) => void;
  activeStep: number;
  existingLogoUrl?: string;
  existingCoverUrl?: string;
}

const BusinessInfoStep: React.FC<BusinessInfoStepProps> = ({
  formData,
  onInputChange,
  activeStep,
  existingLogoUrl,
  existingCoverUrl,
}) => {
  const createImageFile = (file: File): ImageFile => ({
    file,
    preview: URL.createObjectURL(file),
    uploaded: false,
  });

  const handleImageSelect =
    (field: "logo_file" | "cover_file") => (file: File) => {
      onInputChange(field, createImageFile(file));
    };

  const handleImageRemove = (field: "logo_file" | "cover_file") => () => {
    if (formData[field]) {
      URL.revokeObjectURL(formData[field]!.preview);
      onInputChange(field, undefined);
    }
  };

  return (
    <Box
      sx={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h6" component="h3">
          Business Information
        </Typography>

        <TextField
          label="Business Name"
          value={formData.business_name}
          onChange={(e) => onInputChange("business_name", e.target.value)}
          required
          fullWidth
          placeholder="e.g., ABC Construction Ltd, Smith Plumbing Services"
          error={!formData.business_name.trim() && activeStep > 0}
          helperText={
            !formData.business_name.trim() && activeStep > 0
              ? "Business name is required"
              : ""
          }
          InputProps={{
            sx: { userSelect: "text" },
          }}
        />

        <TextField
          select
          label="Business Type"
          value={formData.business_type}
          onChange={(e) => onInputChange("business_type", e.target.value)}
          required
          fullWidth
          helperText="What is your primary business category?"
        >
          {groupedBusinessTypes.flatMap((group) => [
            <MenuItem
              key={`group-${group.group}`}
              disabled
              sx={{ fontWeight: "bold", opacity: 0.8 }}
            >
              {group.group}
            </MenuItem>,
            ...group.types.map((type) => (
              <MenuItem
                key={`type-${group.group}-${type}`}
                value={type}
                sx={{ pl: 3 }}
              >
                {type}
              </MenuItem>
            )),
          ])}
        </TextField>

        <TextField
          label="NZBN Number (Optional)"
          value={formData.nzbn_number}
          onChange={(e) => onInputChange("nzbn_number", e.target.value)}
          fullWidth
          placeholder="New Zealand Business Number"
          helperText="Your New Zealand Business Number if you have one"
          InputProps={{
            sx: { userSelect: "text" },
          }}
        />

        <TextField
          select
          label="Legal Structure"
          value={formData.legality_type}
          onChange={(e) => onInputChange("legality_type", e.target.value)}
          required
          fullWidth
          helperText="What is your business legal structure?"
        >
          {legalityTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Years in Trading"
          type="number"
          value={formData.years_in_trading}
          onChange={(e) =>
            onInputChange("years_in_trading", parseInt(e.target.value) || 0)
          }
          required
          fullWidth
          inputProps={{ min: 0, max: 100 }}
          helperText="How many years has your business been operating?"
          InputProps={{
            sx: { userSelect: "text" },
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.gst_registered}
              onChange={(e) =>
                onInputChange("gst_registered", e.target.checked)
              }
            />
          }
          label="GST Registered"
        />

        {/* Business Images */}
        <Box>
          <Typography variant="subtitle1" gutterBottom fontWeight={600}>
            Business Images
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <ImageUpload
                label="Logo"
                imageFile={formData.logo_file}
                existingImageUrl={existingLogoUrl}
                onImageSelect={handleImageSelect("logo_file")}
                onImageRemove={handleImageRemove("logo_file")}
                helperText="Square logo works best (1:1 ratio)"
                aspectRatio="1/1"
                maxWidth={250}
                maxHeight={250}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ImageUpload
                label="Cover Image"
                imageFile={formData.cover_file}
                existingImageUrl={existingCoverUrl}
                onImageSelect={handleImageSelect("cover_file")}
                onImageRemove={handleImageRemove("cover_file")}
                helperText="Banner image for your business profile"
                aspectRatio="16/9"
                maxWidth={400}
                maxHeight={225}
              />
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
};

export default BusinessInfoStep;
