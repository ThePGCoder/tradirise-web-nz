// src/components/steps/ServicesOperationsStep.tsx
"use client";

import React from "react";
import {
  Typography,
  TextField,
  Stack,
  Autocomplete,
  Chip,
  MenuItem,
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  Card,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Icon } from "@iconify/react";
import Flex from "@/global/Flex";
import {
  BusinessFormData,
  ImageFile,
  OperatingHours,
} from "../../business-form-types";
import {
  daysOfWeek,
  defaultOperatingHours,
  employeeOptions,
  insuranceTypes,
  groupedWorkTypes,
} from "@/lib/data/businessData";

interface ServicesOperationsStepProps {
  formData: BusinessFormData;
  onInputChange: <K extends keyof BusinessFormData>(
    field: K,
    value: BusinessFormData[K]
  ) => void;
  activeStep: number;
}

const ServicesOperationsStep: React.FC<ServicesOperationsStepProps> = ({
  formData,
  onInputChange,
  activeStep,
}) => {
  // Initialize operating hours with defaults if empty
  React.useEffect(() => {
    if (Object.keys(formData.operating_hours).length === 0) {
      onInputChange("operating_hours", defaultOperatingHours);
    }
  }, [formData.operating_hours, onInputChange]);

  // Flatten grouped work types for autocomplete options
  const allWorkTypes = React.useMemo(
    () => groupedWorkTypes.flatMap((group) => group.types),
    []
  );

  const updateOperatingHours = (day: string, hours: string) => {
    onInputChange("operating_hours", {
      ...formData.operating_hours,
      [day]: hours,
    });
  };

  const createImageFile = (file: File): ImageFile => ({
    file,
    preview: URL.createObjectURL(file),
    uploaded: false,
  });

  const handleGalleryImageSelect = (file: File) => {
    const newImage = createImageFile(file);
    onInputChange("gallery_files", [...formData.gallery_files, newImage]);
  };

  const removeGalleryImage = (index: number) => {
    const imageToRemove = formData.gallery_files[index];
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    const updated = formData.gallery_files.filter((_, i) => i !== index);
    onInputChange("gallery_files", updated);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6" component="h3">
        Services & Operations
      </Typography>

      <Autocomplete
        multiple
        options={allWorkTypes}
        value={formData.types_of_work_undertaken}
        onChange={(_, newValue) =>
          onInputChange("types_of_work_undertaken", newValue)
        }
        groupBy={(option) => {
          const group = groupedWorkTypes.find((g) => g.types.includes(option));
          return group?.group || "Other";
        }}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option}
              {...getTagProps({ index })}
              key={option}
              color="primary"
              variant="filled"
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Types of Work Undertaken"
            required
            fullWidth
            helperText="Select all types of work your business handles"
            error={
              formData.types_of_work_undertaken.length === 0 && activeStep > 2
            }
          />
        )}
      />

      <TextField
        select
        label="Number of Employees"
        value={formData.employees}
        onChange={(e) => onInputChange("employees", e.target.value)}
        required
        fullWidth
        helperText="How many people work for your business?"
      >
        <MenuItem value="">
          <em>Select Employee Count</em>
        </MenuItem>
        {employeeOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <Autocomplete
        multiple
        options={insuranceTypes}
        value={formData.insurance_policies}
        onChange={(_, newValue) =>
          onInputChange("insurance_policies", newValue)
        }
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option}
              {...getTagProps({ index })}
              key={option}
              color="secondary"
              variant="filled"
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Insurance Policies"
            fullWidth
            helperText="Select the insurance policies your business holds"
          />
        )}
      />

      <Box>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Operating Hours
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Default trade hours (7:30-17:00 Mon-Fri) are pre-filled. Modify as
          needed.
        </Typography>
        <Stack spacing={2}>
          {daysOfWeek.map((day) => (
            <Grid container spacing={2} key={day} alignItems="center">
              <Grid size={{ xs: 12, sm: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ textTransform: "capitalize", pt: 1 }}
                >
                  {day}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 9 }}>
                <TextField
                  placeholder="e.g., 7:30-17:00 or Closed"
                  value={
                    formData.operating_hours[day as keyof OperatingHours] || ""
                  }
                  onChange={(e) => updateOperatingHours(day, e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>
          ))}
        </Stack>
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.out_of_zone_working}
            onChange={(e) =>
              onInputChange("out_of_zone_working", e.target.checked)
            }
          />
        }
        label="Available for out-of-zone work"
      />

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Availability Date"
          value={
            formData.availability_date
              ? new Date(formData.availability_date)
              : null
          }
          onChange={(date) =>
            onInputChange(
              "availability_date",
              date ? date.toISOString().split("T")[0] : ""
            )
          }
          slotProps={{
            textField: {
              fullWidth: true,
              helperText: "When can you start new projects?",
            },
          }}
        />
      </LocalizationProvider>

      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle1" fontWeight={600}>
            Gallery Images
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleGalleryImageSelect(file);
            }}
            style={{ display: "none" }}
            id="gallery-upload"
          />
          <label htmlFor="gallery-upload">
            <Button
              component="span"
              size="small"
              startIcon={<Icon icon="mdi:plus" />}
              variant="outlined"
            >
              Add Image
            </Button>
          </label>
        </Flex>

        {formData.gallery_files.length > 0 ? (
          <Grid container spacing={2}>
            {formData.gallery_files.map((imageFile, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card variant="outlined" sx={{ p: 1 }}>
                  <Box sx={{ position: "relative" }}>
                    <img
                      src={imageFile.preview}
                      alt={`Gallery ${index + 1}`}
                      style={{
                        width: "100%",
                        height: 150,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <IconButton
                      onClick={() => removeGalleryImage(index)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.8)",
                        },
                      }}
                      size="small"
                    >
                      <Icon icon="mdi:close" />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    {imageFile.file.name}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Upload images to showcase your work and projects
          </Typography>
        )}
      </Box>
    </Stack>
  );
};

export default ServicesOperationsStep;
