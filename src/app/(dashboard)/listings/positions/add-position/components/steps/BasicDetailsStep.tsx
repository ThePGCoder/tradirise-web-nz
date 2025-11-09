// src/app/listings/positions/add-position/components/steps/BasicDetailsStep.tsx
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
  ListSubheader,
} from "@mui/material";
import { PositionFormData } from "../../position-form-types";
import { groupedTradeCategories } from "@/lib/data/positionData";

interface BasicDetailsStepProps {
  formData: PositionFormData;
  onInputChange: <K extends keyof PositionFormData>(
    field: K,
    value: PositionFormData[K]
  ) => void;
}

const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Basic Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide the essential details about this position to attract the right
        candidates.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Position Title"
            value={formData.title}
            onChange={(e) => onInputChange("title", e.target.value)}
            helperText={`Be specific and descriptive (e.g., "Experienced Carpenter for Residential Build"). ${formData.title.length}/5 minimum`}
            error={formData.title.length > 0 && formData.title.length < 5}
            placeholder="e.g., Qualified Electrician for Commercial Project"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth required>
            <InputLabel>Trade Category</InputLabel>
            <Select
              value={formData.trade}
              label="Trade Category"
              onChange={(e) => onInputChange("trade", e.target.value)}
            >
              {groupedTradeCategories.map((group) => [
                <ListSubheader key={group.group}>{group.group}</ListSubheader>,
                ...group.categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                )),
              ])}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            multiline
            rows={8}
            label="Position Description"
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            helperText={`Describe the role, responsibilities, project details, and what you're looking for. Minimum 50 characters. (${formData.description.length}/50)`}
            error={
              formData.description.length > 0 &&
              formData.description.length < 50
            }
            placeholder="We are looking for an experienced carpenter to work on a 6-month residential development project in Auckland. The role involves framing, finishing work, and custom joinery. You will be working as part of a team of 5 tradespeople on a new build subdivision..."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BasicDetailsStep;
