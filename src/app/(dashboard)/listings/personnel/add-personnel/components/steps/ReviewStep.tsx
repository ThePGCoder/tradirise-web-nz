// src/app/listings/personnel/add-personnel/components/steps/ReviewStep.tsx
"use client";

import React from "react";
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Chip,
  Alert,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { PersonnelFormData } from "../../personnel-form-types";

interface ReviewStepProps {
  formData: PersonnelFormData;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  const getRadiusLabel = (value: number) => {
    if (value >= 999) return "Nationwide";
    return `${value} km`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Skills are stored as objects in formData, need to convert to display format
  const formatSkillLabel = (skill: string | unknown): string => {
    if (typeof skill === "string") {
      return skill;
    }
    // Handle object format from form
    if (
      skill &&
      typeof skill === "object" &&
      "trade" in skill &&
      "skill" in skill
    ) {
      const skillObj = skill as { trade: string; skill: string };
      return `${skillObj.trade}: ${skillObj.skill}`;
    }
    // Fallback - shouldn't happen with clean data
    console.warn("Unexpected skill format:", skill);
    return String(skill);
  };

  // Accreditations are stored as objects in formData, need to convert to display format
  const formatAccreditationLabel = (
    accreditation: string | unknown
  ): string => {
    if (typeof accreditation === "string") {
      return accreditation;
    }
    // Handle object format from form
    if (
      accreditation &&
      typeof accreditation === "object" &&
      "category" in accreditation &&
      "accreditation" in accreditation
    ) {
      const accObj = accreditation as {
        category: string;
        accreditation: string;
      };
      return `${accObj.category}: ${accObj.accreditation}`;
    }
    // Fallback - shouldn't happen with clean data
    console.warn("Unexpected accreditation format:", accreditation);
    return String(accreditation);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Your Listing
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please review all information before submitting. You can go back to make
        changes if needed.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        Once submitted, your personnel listing will be visible to employers
        searching for trade professionals.
      </Alert>
      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box sx={{ color: "primary.main", display: "flex" }}>
                  <Icon icon="mdi:account" />
                </Box>
                Personal Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">
                    {formData.first_name} {formData.last_name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {formData.contact_email}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Mobile
                  </Typography>
                  <Typography variant="body1">{formData.mobile}</Typography>
                </Grid>
                {formData.website && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Website
                    </Typography>
                    <Typography variant="body1">{formData.website}</Typography>
                  </Grid>
                )}
                {!formData.is_for_self && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">
                      Posted By
                    </Typography>
                    <Typography variant="body1">
                      {formData.posted_by_name}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Trade Details */}
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box sx={{ color: "primary.main", display: "flex" }}>
                  <Icon icon="mdi:hammer-wrench" />
                </Box>
                Trade Details
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Primary Trade Role
                  </Typography>
                  <Chip
                    label={formData.primary_trade_role}
                    color="primary"
                    sx={{ mt: 1 }}
                  />
                </Grid>
                {formData.secondary_trade_roles.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">
                      Secondary Trade Roles
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                    >
                      {formData.secondary_trade_roles.map((role) => (
                        <Chip key={role} label={role} size="small" />
                      ))}
                    </Box>
                  </Grid>
                )}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Professional Bio
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                  >
                    {formData.bio}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Location & Availability */}
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box sx={{ color: "primary.main", display: "flex" }}>
                  <Icon icon="mdi:map-marker" />
                </Box>
                Location & Availability
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Region
                  </Typography>
                  <Typography variant="body1">{formData.region}</Typography>
                </Grid>
                {formData.suburb && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Suburb/Town
                    </Typography>
                    <Typography variant="body1">{formData.suburb}</Typography>
                  </Grid>
                )}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Service Radius
                  </Typography>
                  <Typography variant="body1">
                    {getRadiusLabel(formData.max_servicable_radius)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Available From
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(formData.available_from)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Skills & Credentials */}
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box sx={{ color: "primary.main", display: "flex" }}>
                  <Icon icon="mdi:certificate" />
                </Box>
                Skills & Credentials
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Skills ({formData.skills.length})
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                  >
                    {formData.skills.map((skill, index) => (
                      <Chip
                        key={`skill-${index}`}
                        label={formatSkillLabel(skill)}
                        size="small"
                        color="success"
                      />
                    ))}
                  </Box>
                </Grid>
                {formData.accreditations.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">
                      Accreditations ({formData.accreditations.length})
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                    >
                      {formData.accreditations.map((accreditation, index) => (
                        <Chip
                          key={`accreditation-${index}`}
                          label={formatAccreditationLabel(accreditation)}
                          size="small"
                          color="primary"
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReviewStep;
