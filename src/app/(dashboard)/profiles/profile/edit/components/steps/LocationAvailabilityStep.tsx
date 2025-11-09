// src/app/profile/edit/components/steps/LocationAvailabilityStep.tsx
"use client";

import React from "react";
import {
  TextField,
  Grid,
  Typography,
  Box,
  Slider,
  Autocomplete,
} from "@mui/material";
import usePlacesAutocomplete, { getGeocode } from "use-places-autocomplete";
import { ProfileFormData } from "../../../types/profile-types";
import { nzRegions } from "@/lib/data/regions";
import { googleRegionMap } from "@/lib/data/googleRegions";

interface LocationAvailabilityStepProps {
  formData: ProfileFormData;
  onInputChange: <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => void;
}

const LocationAvailabilityStep: React.FC<LocationAvailabilityStepProps> = ({
  formData,
  onInputChange,
}) => {
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

  const getRadiusLabel = (value: number) => {
    if (value >= 200) return "Nationwide";
    return `${value} km`;
  };

  const radiusMarks = [
    { value: 10, label: "10" },
    { value: 25, label: "25" },
    { value: 50, label: "50" },
    { value: 75, label: "75" },
    { value: 100, label: "100" },
    { value: 150, label: "150" },
    { value: 200, label: "Nationwide" },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Location & Service Area
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Let employers know where you&#39;re based and how far you&#39;re willing
        to travel for work.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
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
                label="Search for your location"
                placeholder="Start typing your suburb or city..."
              />
            )}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Note: Only suburb and city information will be used. Your full
            address will not be stored or displayed.
          </Typography>
          {(formData.suburb || formData.city) && (
            <Box sx={{ mt: 1 }}>
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
            </Box>
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography gutterBottom fontWeight={500}>
            Maximum Service Radius:{" "}
            {getRadiusLabel(formData.max_servicable_radius)}
          </Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={formData.max_servicable_radius}
              onChange={(_, value) =>
                onInputChange("max_servicable_radius", value as number)
              }
              min={10}
              max={200}
              step={5}
              marks={radiusMarks}
              valueLabelDisplay="auto"
              valueLabelFormat={getRadiusLabel}
              sx={{
                "& .MuiSlider-markLabel": {
                  fontSize: "0.75rem",
                  top: 32,
                },
              }}
            />
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mt: 3 }}
          >
            How far are you willing to travel for work?
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocationAvailabilityStep;
