// src/app/listings/positions/add-position/components/steps/LocationRateStep.tsx
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
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import usePlacesAutocomplete, { getGeocode } from "use-places-autocomplete";
import { PositionFormData } from "../../position-form-types";
import { nzRegions } from "@/lib/data/regions";

interface LocationRateStepProps {
  formData: PositionFormData;
  onInputChange: <K extends keyof PositionFormData>(
    field: K,
    value: PositionFormData[K]
  ) => void;
}

const googleRegionMap: { [key: string]: string } = {
  "Auckland Region": "Auckland",
  "Wellington Region": "Wellington",
  "Canterbury Region": "Canterbury",
  "Bay of Plenty Region": "Bay of Plenty",
  "Waikato Region": "Waikato",
  "Otago Region": "Otago",
  "Manawatū-Whanganui Region": "Manawatū-Whanganui",
  "Hawke's Bay Region": "Hawke's Bay",
  "Taranaki Region": "Taranaki",
  "Northland Region": "Northland",
  "Gisborne Region": "Gisborne",
  "Nelson Region": "Nelson",
  "Marlborough Region": "Marlborough",
  "Tasman Region": "Tasman",
  "Southland Region": "Southland",
  "West Coast Region": "West Coast",
};

const LocationRateStep: React.FC<LocationRateStepProps> = ({
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

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Location & Rate
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Specify where the work is located and the compensation details.
      </Typography>

      <Grid container spacing={3}>
        {/* Location Section */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Work Location
          </Typography>
        </Grid>

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
                label="Search for location"
                placeholder="Start typing the suburb or city..."
                required
              />
            )}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Only suburb and city information will be displayed.
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

        <Grid size={{ xs: 12, md: 6 }}>
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
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Suburb/Town (Optional)"
            value={formData.suburb || ""}
            onChange={(e) => onInputChange("suburb", e.target.value)}
            helperText="Auto-filled from address search"
            disabled
          />
        </Grid>

        {/* Rate Section */}
        <Grid size={{ xs: 12 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            gutterBottom
            sx={{ mt: 2 }}
          >
            Compensation
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControl component="fieldset" required>
            <FormLabel component="legend">Remuneration Type</FormLabel>
            <RadioGroup
              row
              value={formData.remuneration}
              onChange={(e) =>
                onInputChange(
                  "remuneration",
                  e.target.value as "wages" | "labour_only" | "negotiable"
                )
              }
            >
              <FormControlLabel
                value="wages"
                control={<Radio />}
                label="Wages/Salary"
              />
              <FormControlLabel
                value="labour_only"
                control={<Radio />}
                label="Labour Only/Contract"
              />
              <FormControlLabel
                value="negotiable"
                control={<Radio />}
                label="Negotiable"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            label="Rate"
            value={formData.rate}
            onChange={(e) => onInputChange("rate", e.target.value)}
            placeholder="e.g., $35/hour or $280/day"
            helperText="Include currency and rate period"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Rate Type (Optional)</InputLabel>
            <Select
              value={formData.rate_type || ""}
              label="Rate Type (Optional)"
              onChange={(e) =>
                onInputChange(
                  "rate_type",
                  e.target.value as
                    | "hourly"
                    | "daily"
                    | "weekly"
                    | "project"
                    | undefined
                )
              }
            >
              <MenuItem value="">
                <em>Not specified</em>
              </MenuItem>
              <MenuItem value="hourly">Hourly</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="project">Project-based</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Start Date */}
        <Grid size={{ xs: 12 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={formData.start_date ? dayjs(formData.start_date) : null}
              onChange={(newValue) => {
                onInputChange(
                  "start_date",
                  newValue ? dayjs(newValue).format("YYYY-MM-DD") : ""
                );
              }}
              minDate={dayjs()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  helperText: "When do you need someone to start?",
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        {/* Contact Details */}
        <Grid size={{ xs: 12 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            gutterBottom
            sx={{ mt: 2 }}
          >
            Contact Information
          </Typography>
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
            helperText="Email for applications"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Contact Phone (Optional)"
            value={formData.contact_phone || ""}
            onChange={(e) => onInputChange("contact_phone", e.target.value)}
            placeholder="021 123 4567"
            helperText="Optional phone number"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Website (Optional)"
            value={formData.website || ""}
            onChange={(e) => onInputChange("website", e.target.value)}
            placeholder="www.example.com"
            helperText="Company or project website"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocationRateStep;
