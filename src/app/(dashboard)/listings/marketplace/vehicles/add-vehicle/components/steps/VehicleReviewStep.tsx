// app/listings/marketplace/vehicles/add/components/steps/VehicleReviewStep.tsx
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
import { VehicleFormData } from "../../vehicle-form-types";
import dayjs from "dayjs";

interface VehicleReviewStepProps {
  formData: VehicleFormData;
}

const VehicleReviewStep: React.FC<VehicleReviewStepProps> = ({ formData }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NZ", {
      style: "currency",
      currency: "NZD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return dayjs(dateString).format("DD MMM YYYY");
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
        Once submitted, your vehicle listing will be visible to potential buyers
        in the marketplace.
      </Alert>

      <Grid container spacing={3}>
        {/* Vehicle Details */}
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
                  <Icon icon="mdi:car" />
                </Box>
                Vehicle Details
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
                    Vehicle Type
                  </Typography>
                  <Typography variant="body1">
                    {formData.vehicle_type}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Make & Model
                  </Typography>
                  <Typography variant="body1">
                    {formData.make} {formData.model}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Year
                  </Typography>
                  <Typography variant="body1">{formData.year}</Typography>
                </Grid>
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
                {formData.mileage && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Mileage
                    </Typography>
                    <Typography variant="body1">
                      {formData.mileage.toLocaleString()} km
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

        {/* Specifications */}
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
                  <Icon icon="mdi:cog" />
                </Box>
                Specifications
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {formData.transmission && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Transmission
                    </Typography>
                    <Typography variant="body1">
                      {formData.transmission}
                    </Typography>
                  </Grid>
                )}
                {formData.fuel_type && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Fuel Type
                    </Typography>
                    <Typography variant="body1">
                      {formData.fuel_type}
                    </Typography>
                  </Grid>
                )}
                {formData.registration_expires && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Registration Expiry
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(formData.registration_expires)}
                    </Typography>
                  </Grid>
                )}
                {formData.wof_expires && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      WOF Expiry
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(formData.wof_expires)}
                    </Typography>
                  </Grid>
                )}
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Pricing & Location */}
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
                Pricing & Location
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Asking Price
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {formatPrice(formData.price)}
                  </Typography>
                  <Chip
                    label={formData.price_type}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
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
                        alt={`Vehicle ${index + 1}`}
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

export default VehicleReviewStep;
