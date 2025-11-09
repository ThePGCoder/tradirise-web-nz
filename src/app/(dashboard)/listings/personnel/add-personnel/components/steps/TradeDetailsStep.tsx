// src/app/listings/personnel/add-personnel/components/steps/TradeDetailsStep.tsx
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
  Chip,
  Autocomplete,
  ListSubheader,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { PersonnelFormData } from "../../personnel-form-types";
import { groupedRoles } from "@/lib/data/personnelData";

interface TradeDetailsStepProps {
  formData: PersonnelFormData;
  onInputChange: <K extends keyof PersonnelFormData>(
    field: K,
    value: PersonnelFormData[K]
  ) => void;
  activeStep: number;
}

const TradeDetailsStep: React.FC<TradeDetailsStepProps> = ({
  formData,
  onInputChange,
}) => {
  // Flatten all roles for secondary role selection
  const allRoles = groupedRoles.flatMap((group) => group.roles);

  const availableSecondaryRoles = allRoles.filter(
    (role) => role !== formData.primary_trade_role
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Trade Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Tell us about your primary trade and any additional roles you can
        fulfill.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth required>
            <InputLabel>Primary Trade Role</InputLabel>
            <Select
              value={formData.primary_trade_role}
              label="Primary Trade Role"
              onChange={(e) =>
                onInputChange("primary_trade_role", e.target.value)
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 400,
                  },
                },
              }}
            >
              {groupedRoles.map((group) => [
                <ListSubheader
                  key={group.group}
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {group.group}
                </ListSubheader>,
                ...group.roles.map((role) => (
                  <MenuItem key={role} value={role} sx={{ pl: 4 }}>
                    {role}
                  </MenuItem>
                )),
              ])}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Autocomplete
            multiple
            options={availableSecondaryRoles}
            groupBy={(option) => {
              const group = groupedRoles.find((g) => g.roles.includes(option));
              return group?.group || "Other";
            }}
            renderGroup={(params) => (
              <li key={params.key}>
                <ListSubheader
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {params.group}
                </ListSubheader>
                <ul style={{ padding: 0 }}>{params.children}</ul>
              </li>
            )}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key} {...optionProps} style={{ paddingLeft: 32 }}>
                  {option}
                </li>
              );
            }}
            value={formData.secondary_trade_roles}
            onChange={(_, newValue) => {
              onInputChange("secondary_trade_roles", newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Secondary Trade Roles (Optional)"
                placeholder="Select additional roles"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  color="primary"
                  variant="filled"
                  deleteIcon={<Icon icon="mdi:close" />}
                />
              ))
            }
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
            label="Professional Bio"
            value={formData.bio}
            onChange={(e) => onInputChange("bio", e.target.value)}
            helperText={`Tell potential employers about your experience, qualifications, and what makes you a great hire. Minimum 20 characters. (${formData.bio.length}/20)`}
            placeholder="I am a qualified carpenter with 10+ years experience in residential and commercial construction. I specialize in framing, finishing, and custom joinery work. I hold an LBP license and am Site Safe certified..."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TradeDetailsStep;
