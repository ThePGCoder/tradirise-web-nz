// app/listings/marketplace/plant/add/components/steps/PlantReviewStep.tsx
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
  ImageList,
  ImageListItem,
} from "@mui/material";
import { Icon } from "@iconify/react";

import { PlantFormData } from "../plant-form-types";

interface PlantReviewStepProps {
  formData: PlantFormData;
}

const PlantReviewStep: React.FC<PlantReviewStepProps> = ({ formData }) => {
  const formatPrice = (price?: number) => {
    if (!price) return "Not specified";
    return new Intl.NumberFormat("en-NZ", {
      style: "currency",
      currency: "NZD",
      minimumFractionDigits: 0,
    }).format(price);
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
        Once submitted, your plant & equipment listing will be visible in the
        marketplace.
      </Alert>

      <Grid container spacing={3}>
        {/* Equipment Details */}
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
                  <Icon icon="mdi:excavator" />
                </Box>
                Equipment Details
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Listing Title
                  </Typography>
                  <Typography variant="h6">{formData.title}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Equipment Type
                  </Typography>
                  <Typography variant="body1">
                    {formData.equipment_type}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1">{formData.category}</Typography>
                </Grid>
                {formData.make && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Make & Model
                    </Typography>
                    <Typography variant="body1">
                      {formData.make} {formData.model || ""}
                    </Typography>
                  </Grid>
                )}
                {formData.year && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Year
                    </Typography>
                    <Typography variant="body1">{formData.year}</Typography>
                  </Grid>
                )}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Condition
                  </Typography>
                  <Chip
                    label={formData.condition}
                    color={formData.condition === "new" ? "success" : "default"}
                    size="small"
                  />
                </Grid>
                {formData.hours_used && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Hours Used
                    </Typography>
                    <Typography variant="body1">
                      {formData.hours_used.toLocaleString()} hours
                    </Typography>
                  </Grid>
                )}
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

        {/* Pricing */}
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
                  <Icon icon="mdi:currency-usd" />
                </Box>
                Pricing & Options
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Sale Price
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {formatPrice(formData.sale_price)}
                  </Typography>
                  <Chip
                    label={formData.price_type}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  {formData.delivery_available && (
                    <Chip
                      label="Delivery Available"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Features & Location */}
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
                Features & Location
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {formData.features.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">
                      Features ({formData.features.length})
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                    >
                      {formData.features.map((feature) => (
                        <Chip
                          key={feature}
                          label={feature}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1">{formData.region}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Images */}
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
                  <Icon icon="mdi:image-multiple" />
                </Box>
                Images ({formData.images.length})
              </Typography>
              <Divider sx={{ my: 2 }} />
              {formData.images.length > 0 ? (
                <ImageList cols={4} gap={8}>
                  {formData.images.map((url, index) => (
                    <ImageListItem key={url}>
                      <img
                        src={url}
                        alt={`Equipment ${index + 1}`}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: 150,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                      {index === 0 && (
                        <Chip
                          label="Main"
                          size="small"
                          color="primary"
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                          }}
                        />
                      )}
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No images uploaded
                </Typography>
              )}
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
                  <Icon icon="mdi:account-circle" />
                </Box>
                Contact Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">
                    {formData.contact_name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {formData.contact_email}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {formData.contact_phone}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlantReviewStep;
