// src/app/listings/positions/add-position/components/steps/RequirementsBenefitsStep.tsx
"use client";

import React from "react";
import {
  TextField,
  Grid,
  Typography,
  Box,
  Chip,
  Alert,
  Autocomplete,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { PositionFormData } from "../../position-form-types";
import {
  groupedCommonRequirements,
  groupedCommonGoodToHave,
  groupedCommonBenefits,
} from "@/lib/data/positionData";

interface RequirementsBenefitsStepProps {
  formData: PositionFormData;
  onInputChange: <K extends keyof PositionFormData>(
    field: K,
    value: PositionFormData[K]
  ) => void;
}

const RequirementsBenefitsStep: React.FC<RequirementsBenefitsStepProps> = ({
  formData,
  onInputChange,
}) => {
  // Flatten grouped data for autocomplete options
  const allRequirements = React.useMemo(
    () => groupedCommonRequirements.flatMap((group) => group.requirements),
    []
  );

  const allGoodToHave = React.useMemo(
    () => groupedCommonGoodToHave.flatMap((group) => group.skills),
    []
  );

  const allBenefits = React.useMemo(
    () => groupedCommonBenefits.flatMap((group) => group.benefits),
    []
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Requirements & Benefits
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Define what you need from candidates and what you&#39;re offering in
        return.
      </Typography>

      <Grid container spacing={3}>
        {/* Requirements */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Essential Requirements
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Autocomplete
            multiple
            freeSolo
            options={allRequirements}
            value={formData.requirements}
            onChange={(_, newValue) => {
              onInputChange("requirements", newValue);
            }}
            groupBy={(option) => {
              const group = groupedCommonRequirements.find((g) =>
                g.requirements.includes(option)
              );
              return group?.group || "Other";
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Requirements"
                required
                placeholder="Select or type requirements"
                error={formData.requirements.length === 0}
                helperText={
                  formData.requirements.length === 0
                    ? "Please add at least one requirement"
                    : `${formData.requirements.length} requirement${
                        formData.requirements.length !== 1 ? "s" : ""
                      } added`
                }
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  color="error"
                  deleteIcon={<Icon icon="mdi:close" />}
                />
              ))
            }
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Licenses, certifications, or experience required for the role
          </Typography>
        </Grid>

        {/* Good to Have */}
        <Grid size={{ xs: 12 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            gutterBottom
            sx={{ mt: 2 }}
          >
            Good to Have (Optional)
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Autocomplete
            multiple
            freeSolo
            options={allGoodToHave}
            value={formData.good_to_have}
            onChange={(_, newValue) => {
              onInputChange("good_to_have", newValue);
            }}
            groupBy={(option) => {
              const group = groupedCommonGoodToHave.find((g) =>
                g.skills.includes(option)
              );
              return group?.group || "Other";
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Good to Have"
                placeholder="Select or type preferred qualifications"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  color="info"
                  deleteIcon={<Icon icon="mdi:close" />}
                />
              ))
            }
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Skills or qualifications that would be advantageous but not
            essential
          </Typography>
        </Grid>

        {/* Benefits */}
        <Grid size={{ xs: 12 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            gutterBottom
            sx={{ mt: 2 }}
          >
            Benefits & Perks (Optional)
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Autocomplete
            multiple
            freeSolo
            options={allBenefits}
            value={formData.benefits}
            onChange={(_, newValue) => {
              onInputChange("benefits", newValue);
            }}
            groupBy={(option) => {
              const group = groupedCommonBenefits.find((g) =>
                g.benefits.includes(option)
              );
              return group?.group || "Other";
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Benefits"
                placeholder="Select or type benefits offered"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  color="success"
                  deleteIcon={<Icon icon="mdi:close" />}
                />
              ))
            }
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            What makes this position attractive? (vehicle, tools, training,
            etc.)
          </Typography>
        </Grid>

        {/* Summary Alert */}
        {formData.requirements.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Alert severity="success">
              Your listing includes {formData.requirements.length} requirement
              {formData.requirements.length !== 1 ? "s" : ""}
              {formData.good_to_have.length > 0 &&
                `, ${formData.good_to_have.length} preferred qualification${
                  formData.good_to_have.length !== 1 ? "s" : ""
                }`}
              {formData.benefits.length > 0 &&
                `, and ${formData.benefits.length} benefit${
                  formData.benefits.length !== 1 ? "s" : ""
                }`}
              .
            </Alert>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Tip:</strong> Clear requirements and attractive benefits
              help you find the right candidates faster. Consider what truly
              matters for the role and what will make your position stand out.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RequirementsBenefitsStep;
