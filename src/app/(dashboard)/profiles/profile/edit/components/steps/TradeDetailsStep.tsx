// src/app/profile/edit/components/steps/TradeDetailsStep.tsx
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

import { groupedRoles } from "@/lib/data/personnelData";
import { ProfileFormData } from "../../../types/profile-types";

interface TradeDetailsStepProps {
  formData: ProfileFormData;
  onInputChange: <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => void;
}

const TradeDetailsStep: React.FC<TradeDetailsStepProps> = ({
  formData,
  onInputChange,
}) => {
  // Flatten all roles from grouped structure
  const allRoles = groupedRoles.flatMap((group) => group.roles);

  // Get available secondary roles (excluding primary role)
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
          <FormControl fullWidth>
            <InputLabel>Primary Trade Role</InputLabel>
            <Select
              value={formData.primary_trade_role}
              label="Primary Trade Role"
              onChange={(e) =>
                onInputChange("primary_trade_role", e.target.value)
              }
            >
              {groupedRoles.map((group) => [
                <ListSubheader key={group.group}>{group.group}</ListSubheader>,
                ...group.roles.map((role) => (
                  <MenuItem key={role} value={role}>
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
            value={formData.secondary_trade_roles}
            onChange={(_, newValue) => {
              onInputChange("secondary_trade_roles", newValue);
            }}
            groupBy={(option) => {
              // Find which group this role belongs to
              const group = groupedRoles.find((g) => g.roles.includes(option));
              return group?.group || "Other";
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
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            type="number"
            label="Years in Trade"
            value={formData.years_in_trade}
            onChange={(e) =>
              onInputChange("years_in_trade", parseInt(e.target.value) || 0)
            }
            helperText="How many years of experience do you have in your trade?"
            inputProps={{ min: 0, max: 70 }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Professional Bio"
            value={formData.bio}
            onChange={(e) => onInputChange("bio", e.target.value)}
            helperText={`Tell potential employers about your experience, qualifications, and what makes you a great hire. Minimum 20 characters. (${formData.bio.length}/20)`}
            error={formData.bio.length > 0 && formData.bio.length < 20}
            placeholder="I am a qualified carpenter with 10+ years experience in residential and commercial construction. I specialize in framing, finishing, and custom joinery work. I hold an LBP license and am Site Safe certified..."
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Contact Email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => onInputChange("contact_email", e.target.value)}
            helperText="Email address for employers to contact you"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Mobile Number"
            value={formData.mobile}
            onChange={(e) => onInputChange("mobile", e.target.value)}
            helperText="Your contact number"
            placeholder="+64 21 123 4567"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Website"
            value={formData.website}
            onChange={(e) => onInputChange("website", e.target.value)}
            helperText="Your professional website or portfolio"
            placeholder="www.example.com"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TradeDetailsStep;
