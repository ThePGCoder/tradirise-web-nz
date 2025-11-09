// src/app/listings/projects/add-project/components/steps/ProjectOverviewStep.tsx
"use client";

import React from "react";
import {
  TextField,
  Grid,
  Typography,
  Box,
  Autocomplete,
  Chip,
  Button,
} from "@mui/material";
import { Icon } from "@iconify/react";
import usePlacesAutocomplete, { getGeocode } from "use-places-autocomplete";
import { ProjectFormData } from "../../project-form-types";
import {
  groupedTradeOptions,
  groupedProjectTypeOptions,
} from "@/lib/data/projectData";
import { nzRegions } from "@/lib/data/regions";
import { googleRegionMap } from "@/lib/data/googleRegions";

interface ProjectOverviewStepProps {
  formData: ProjectFormData;
  onInputChange: <K extends keyof ProjectFormData>(
    field: K,
    value: ProjectFormData[K]
  ) => void;
}

const ProjectOverviewStep: React.FC<ProjectOverviewStepProps> = ({
  formData,
  onInputChange,
}) => {
  // Flatten grouped data for autocomplete
  const allTradeOptions = React.useMemo(
    () => groupedTradeOptions.flatMap((group) => group.trades),
    []
  );

  const allProjectTypeOptions = React.useMemo(
    () => groupedProjectTypeOptions.flatMap((group) => group.types),
    []
  );

  const {
    ready,
    value,
    suggestions: { data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "nz" },
    },
    debounce: 300,
  });

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const addressComponents = results[0].address_components;

      const getComponent = (type: string) =>
        addressComponents?.find((c) => c.types.includes(type))?.long_name ?? "";

      const suburb =
        getComponent("sublocality") ||
        getComponent("sublocality_level_1") ||
        getComponent("neighborhood") ||
        "";

      const city =
        getComponent("locality") ||
        getComponent("postal_town") ||
        getComponent("administrative_area_level_2") ||
        "";

      const googleRegion = getComponent("administrative_area_level_1");
      const mappedRegion = googleRegionMap[googleRegion] || googleRegion;

      onInputChange("suburb", suburb);
      onInputChange("city", city);

      if (mappedRegion && nzRegions.includes(mappedRegion)) {
        onInputChange("region", mappedRegion);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Project Overview
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide the essential details about your project to attract the right
        contractors.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Project Title"
            value={formData.title}
            onChange={(e) => onInputChange("title", e.target.value)}
            helperText={`Be specific and descriptive. ${formData.title.length}/3 minimum`}
            error={formData.title.length > 0 && formData.title.length < 3}
            placeholder="e.g., Kitchen Renovation, Bathroom Remodel, Office Fit-out"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Autocomplete
            multiple
            options={allTradeOptions}
            value={formData.required_trades}
            onChange={(_, newValue) =>
              onInputChange("required_trades", newValue)
            }
            groupBy={(option) => {
              const group = groupedTradeOptions.find((g) =>
                g.trades.includes(option)
              );
              return group?.group || "Other";
            }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  color="primary"
                  deleteIcon={<Icon icon="mdi:close" />}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Required Trades"
                required
                placeholder="Select all trades/skills needed"
                error={formData.required_trades.length === 0}
                helperText={
                  formData.required_trades.length === 0
                    ? "Please select at least one trade"
                    : `${formData.required_trades.length} trade${
                        formData.required_trades.length !== 1 ? "s" : ""
                      } selected`
                }
              />
            )}
            ListboxProps={{
              style: {
                maxHeight: 400,
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Autocomplete
            options={allProjectTypeOptions}
            value={formData.project_type}
            onChange={(_, newValue) =>
              onInputChange("project_type", newValue || "")
            }
            groupBy={(option) => {
              const group = groupedProjectTypeOptions.find((g) =>
                g.types.includes(option)
              );
              return group?.group || "Other";
            }}
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                label="Project Type"
                required
                helperText="What type of project is this?"
              />
            )}
            ListboxProps={{
              style: {
                maxHeight: 400,
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            multiline
            rows={6}
            label="Project Description"
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            helperText={`Describe the project scope and requirements. ${formData.description.length}/10 minimum`}
            error={
              formData.description.length > 0 &&
              formData.description.length < 10
            }
            placeholder="Describe what needs to be done, specific requirements, timeline expectations..."
          />
        </Grid>

        {/* Location */}
        <Grid size={{ xs: 12 }}>
          {!formData.city ? (
            <Autocomplete
              freeSolo
              options={data.map((suggestion) => suggestion.description)}
              value={value}
              onChange={(_, newValue) => {
                if (newValue) {
                  handleSelect(newValue);
                }
              }}
              onInputChange={(_, newInputValue) => {
                setValue(newInputValue);
              }}
              disabled={!ready}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Project Location"
                  placeholder="Start typing the project location..."
                  required
                />
              )}
            />
          ) : (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Selected Location
              </Typography>
              {formData.suburb && (
                <Typography variant="body2">
                  <strong>Suburb:</strong> {formData.suburb}
                </Typography>
              )}
              {formData.city && (
                <Typography variant="body2">
                  <strong>City:</strong> {formData.city}
                </Typography>
              )}
              {formData.region && (
                <Typography variant="body2">
                  <strong>Region:</strong> {formData.region}
                </Typography>
              )}
              <Button
                onClick={() => {
                  onInputChange("suburb", "");
                  onInputChange("city", "");
                  onInputChange("region", "");
                  setValue("");
                }}
                variant="outlined"
                size="small"
                startIcon={<Icon icon="mdi:map-marker" />}
                sx={{ mt: 1 }}
              >
                Change Location
              </Button>
            </Box>
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Only suburb and city information will be displayed.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectOverviewStep;
