// src/app/listings/positions/add-position/components/steps/ReviewStep.tsx
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
  Avatar,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { PositionFormData } from "../../position-form-types";

interface Business {
  id: string;
  business_name: string;
  logo_url?: string;
}

interface ReviewStepProps {
  formData: PositionFormData;
  selectedBusiness?: Business | null;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  selectedBusiness,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Your Position Listing
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please review all information before submitting. You can go back to make
        changes if needed.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Once submitted, your position listing will be visible to trade
        professionals searching for work.
      </Alert>

      <Grid container spacing={3}>
        {/* Posting As */}
        {formData.is_business_listing && selectedBusiness && (
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
                    <Icon icon="mdi:domain" />
                  </Box>
                  Posting As
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={selectedBusiness.logo_url}
                    sx={{ width: 50, height: 50 }}
                  >
                    {selectedBusiness.business_name[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedBusiness.business_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Business Listing
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Basic Details */}
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
                  <Icon icon="mdi:briefcase" />
                </Box>
                Position Details
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Title
                  </Typography>
                  <Typography variant="h6">{formData.title}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Trade Category
                  </Typography>
                  <Chip label={formData.trade} color="primary" sx={{ mt: 1 }} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                  >
                    {formData.description}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Location */}
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
                Location
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
                      Suburb
                    </Typography>
                    <Typography variant="body1">{formData.suburb}</Typography>
                  </Grid>
                )}
                {formData.city && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      City
                    </Typography>
                    <Typography variant="body1">{formData.city}</Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Compensation */}
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
                  <Icon icon="mdi:cash" />
                </Box>
                Compensation
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Rate
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formData.rate}
                  </Typography>
                </Grid>
                {formData.rate_type && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Rate Type
                    </Typography>
                    <Typography variant="body1">
                      {formData.rate_type.charAt(0).toUpperCase() +
                        formData.rate_type.slice(1)}
                    </Typography>
                  </Grid>
                )}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Remuneration Type
                  </Typography>
                  <Chip
                    label={
                      formData.remuneration === "labour_only"
                        ? "Labour Only"
                        : formData.remuneration.charAt(0).toUpperCase() +
                          formData.remuneration.slice(1)
                    }
                    color="secondary"
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(formData.start_date)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Requirements & Benefits */}
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
                  <Icon icon="mdi:clipboard-check" />
                </Box>
                Requirements & Benefits
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Requirements ({formData.requirements.length})
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                  >
                    {formData.requirements.map((req) => (
                      <Chip key={req} label={req} size="small" color="error" />
                    ))}
                  </Box>
                </Grid>

                {formData.good_to_have.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">
                      Good to Have ({formData.good_to_have.length})
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                    >
                      {formData.good_to_have.map((item) => (
                        <Chip
                          key={item}
                          label={item}
                          size="small"
                          color="info"
                        />
                      ))}
                    </Box>
                  </Grid>
                )}

                {formData.benefits.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">
                      Benefits ({formData.benefits.length})
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                    >
                      {formData.benefits.map((benefit) => (
                        <Chip
                          key={benefit}
                          label={benefit}
                          size="small"
                          color="success"
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
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
                  <Icon icon="mdi:email" />
                </Box>
                Contact Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {formData.contact_email}
                  </Typography>
                </Grid>
                {formData.contact_phone && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      {formData.contact_phone}
                    </Typography>
                  </Grid>
                )}
                {formData.website && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">
                      Website
                    </Typography>
                    <Typography variant="body1">{formData.website}</Typography>
                  </Grid>
                )}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Posted By
                  </Typography>
                  <Typography variant="body1">{formData.posted_by}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReviewStep;
