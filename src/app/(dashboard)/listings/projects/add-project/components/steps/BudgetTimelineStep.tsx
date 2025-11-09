// src/app/listings/projects/add-project/components/steps/BudgetTimelineStep.tsx
"use client";

import React from "react";
import {
  TextField,
  Grid,
  Typography,
  Box,
  MenuItem,
  InputAdornment,
  Autocomplete,
  Chip,
  ListSubheader,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import { ProjectFormData } from "../../project-form-types";
import {
  budgetTypeOptions,
  groupedProjectDurationOptions,
  groupedMaterialsProvidedOptions,
} from "@/lib/data/projectData";

interface BudgetTimelineStepProps {
  formData: ProjectFormData;
  onInputChange: <K extends keyof ProjectFormData>(
    field: K,
    value: ProjectFormData[K]
  ) => void;
}

const BudgetTimelineStep: React.FC<BudgetTimelineStepProps> = ({
  formData,
  onInputChange,
}) => {
  // Flatten grouped data for autocomplete
  const allMaterialsOptions = React.useMemo(
    () => groupedMaterialsProvidedOptions.flatMap((group) => group.options),
    []
  );

  const getBudgetLabel = () => {
    switch (formData.budget_type) {
      case "fixed":
        return "Total Budget";
      case "hourly":
        return "Hourly Budget";
      case "per_trade":
        return "Budget Per Trade";
      case "range":
        return "Budget Range";
      default:
        return "Budget";
    }
  };

  const getBudgetPlaceholder = () => {
    switch (formData.budget_type) {
      case "fixed":
        return "e.g., 15000";
      case "hourly":
        return "e.g., 45";
      case "per_trade":
        return "e.g., 5000";
      case "range":
        return "Enter budget range";
      default:
        return "Enter budget";
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Budget & Timeline
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Set your budget expectations and project timeline.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            select
            fullWidth
            label="Budget Type"
            value={formData.budget_type}
            onChange={(e) => onInputChange("budget_type", e.target.value)}
            required
            helperText="How would you like to structure the budget?"
          >
            {budgetTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {formData.budget_type === "range" ? (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Minimum Budget"
                value={formData.budget_min || ""}
                onChange={(e) => onInputChange("budget_min", e.target.value)}
                placeholder="10000"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Maximum Budget"
                value={formData.budget_max || ""}
                onChange={(e) => onInputChange("budget_max", e.target.value)}
                placeholder="20000"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                required
              />
            </Grid>
          </>
        ) : (
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label={getBudgetLabel()}
              value={formData.price_range}
              onChange={(e) => onInputChange("price_range", e.target.value)}
              placeholder={getBudgetPlaceholder()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon="mdi:currency-usd" />
                  </InputAdornment>
                ),
              }}
              required
            />
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Proposed Start Date"
              value={
                formData.proposed_start_date
                  ? dayjs(formData.proposed_start_date)
                  : null
              }
              onChange={(newValue) =>
                onInputChange(
                  "proposed_start_date",
                  newValue ? dayjs(newValue).format("YYYY-MM-DD") : ""
                )
              }
              minDate={dayjs()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  helperText: "When would you like this project to start?",
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            select
            fullWidth
            label="Project Duration"
            value={formData.project_duration}
            onChange={(e) => onInputChange("project_duration", e.target.value)}
            required
            helperText="Estimated time to complete the project"
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: {
                    maxHeight: 400,
                  },
                },
              },
            }}
          >
            {groupedProjectDurationOptions.map((group) => [
              <ListSubheader
                key={group.group}
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                {group.group}
              </ListSubheader>,
              ...group.durations.map((duration) => (
                <MenuItem key={duration} value={duration} sx={{ pl: 4 }}>
                  {duration}
                </MenuItem>
              )),
            ])}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Autocomplete
            multiple
            options={allMaterialsOptions}
            value={formData.materials_provided}
            onChange={(_, newValue) =>
              onInputChange("materials_provided", newValue)
            }
            groupBy={(option) => {
              const group = groupedMaterialsProvidedOptions.find((g) =>
                g.options.includes(option)
              );
              return group?.group || "Other";
            }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  color="success"
                  deleteIcon={<Icon icon="mdi:close" />}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Materials & Equipment (Optional)"
                placeholder="What will you provide?"
                helperText="Specify what materials, tools, or equipment you'll provide"
              />
            )}
            ListboxProps={{
              style: {
                maxHeight: 400,
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BudgetTimelineStep;
