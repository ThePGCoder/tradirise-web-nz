// src/app/listings/projects/add-project/components/steps/ReviewStep.tsx
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
import Flex from "@/global/Flex";
import dayjs from "dayjs";
import { ProjectFormData, budgetTypeOptions } from "../../project-form-types";

interface Business {
  id: string;
  business_name: string;
  logo_url?: string;
}

interface ReviewStepProps {
  formData: ProjectFormData;
  selectedBusiness?: Business | null;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  selectedBusiness,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    return dayjs(dateString).format("MMMM D, YYYY");
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Your Project Listing
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please review all information before submitting. You can go back to make
        changes if needed.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Once submitted, your project listing will be visible to contractors
        searching for work opportunities.
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

        {/* Project Details */}
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
                Project Details
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
                    Project Type
                  </Typography>
                  <Chip
                    label={formData.project_type}
                    color="primary"
                    sx={{ mt: 1 }}
                  />
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

        {/* Required Trades */}
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
                  <Icon icon="mdi:account-hard-hat" />
                </Box>
                Required Trades ({formData.required_trades.length})
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Flex gap={1} flexWrap="wrap">
                {formData.required_trades.map((trade) => (
                  <Chip
                    key={trade}
                    label={trade}
                    size="small"
                    color="primary"
                  />
                ))}
              </Flex>
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
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Region
                  </Typography>
                  <Typography variant="body1">{formData.region}</Typography>
                </Grid>
                {formData.suburb && (
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Suburb
                    </Typography>
                    <Typography variant="body1">{formData.suburb}</Typography>
                  </Grid>
                )}
                {formData.city && (
                  <Grid size={{ xs: 12, sm: 4 }}>
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

        {/* Budget & Timeline */}
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
                Budget & Timeline
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Budget
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formData.budget_type === "range" &&
                    formData.budget_min &&
                    formData.budget_max
                      ? `$${formData.budget_min} - $${formData.budget_max}`
                      : formData.price_range}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Budget Type
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {
                      budgetTypeOptions.find(
                        (b) => b.value === formData.budget_type
                      )?.label
                    }
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatDate(formData.proposed_start_date)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formData.project_duration}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Materials */}
        {formData.materials_provided.length > 0 && (
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
                    <Icon icon="mdi:tools" />
                  </Box>
                  Materials & Equipment
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Flex gap={1} flexWrap="wrap">
                  {formData.materials_provided.map((material) => (
                    <Chip
                      key={material}
                      label={material}
                      size="small"
                      color="success"
                    />
                  ))}
                </Flex>
              </CardContent>
            </Card>
          </Grid>
        )}

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
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Company/Client
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formData.company_name}
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
