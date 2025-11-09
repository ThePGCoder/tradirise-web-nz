// src/components/steps/ReviewStep.tsx
"use client";

import React from "react";
import {
  Typography,
  Stack,
  Card,
  CardContent,
  Box,
  Grid,
  Chip,
  Alert,
  Avatar,
} from "@mui/material";
import { Icon } from "@iconify/react";
import Flex from "@/global/Flex";
import { BusinessFormData } from "../../business-form-types";

interface ReviewStepProps {
  formData: BusinessFormData;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  const hasContactMethod =
    formData.contact_email?.trim() ||
    formData.mobile_contacts.some((c) => c.number.trim()) ||
    formData.office_phone?.trim();

  const formatWebsiteUrl = (website?: string) => {
    if (!website) return "";
    return website.startsWith("http") ? website : `https://${website}`;
  };

  /*const formatSocialMediaUrl = (platform: string, handle?: string) => {
    if (!handle) return "";
    if (handle.startsWith("http")) return handle;

    const baseUrls: Record<string, string> = {
      facebook: "https://facebook.com/",
      instagram: "https://instagram.com/",
      linkedin: "https://linkedin.com/",
      youtube: "https://youtube.com/",
      twitter: "https://x.com/",
      tiktok: "https://tiktok.com/",
    };

    return `${baseUrls[platform] || ""}${handle}`;
  };*/

  return (
    <Stack spacing={3}>
      <Typography variant="h6" component="h3">
        Review Your Business Listing
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={3}>
            {/* Business Header */}
            <Box>
              <Flex gap={2} alignItems="flex-start">
                {formData.logo_file && (
                  <Avatar
                    src={formData.logo_file.preview}
                    sx={{ width: 80, height: 80 }}
                    variant="rounded"
                  />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" gutterBottom>
                    {formData.business_name}
                  </Typography>
                  <Flex gap={1} alignItems="center" mb={1}>
                    <Icon icon="mdi:domain" />
                    <Typography variant="body1" color="primary">
                      {formData.business_type}
                    </Typography>
                  </Flex>
                  <Flex gap={1} alignItems="center">
                    <Icon icon="mdi:certificate" />
                    <Typography variant="body1">
                      {formData.legality_type}
                    </Typography>
                  </Flex>
                  {formData.gst_registered && (
                    <Flex gap={1} alignItems="center" mt={1}>
                      <Icon
                        icon="mdi:check-circle"
                        style={{ color: "#4caf50" }}
                      />
                      <Typography variant="body2" color="success.main">
                        GST Registered
                      </Typography>
                    </Flex>
                  )}
                  {formData.nzbn_number && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      NZBN: {formData.nzbn_number}
                    </Typography>
                  )}
                </Box>
              </Flex>
            </Box>

            {/* Cover Image */}
            {formData.cover_file && (
              <Box>
                <img
                  src={formData.cover_file.preview}
                  alt="Cover"
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </Box>
            )}

            {/* Business Details */}
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Years in Trading
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formData.years_in_trading} year
                  {formData.years_in_trading === 1 ? "" : "s"}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Team Size
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formData.employees}
                </Typography>
              </Grid>
            </Grid>

            {/* Address */}
            {(formData.street_address || formData.city) && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Business Address
                </Typography>
                <Flex gap={1} alignItems="flex-start">
                  <Icon icon="mdi:map-marker" style={{ marginTop: 2 }} />
                  <Box>
                    <Typography variant="body2">
                      {[
                        formData.street_address,
                        formData.suburb,
                        formData.city,
                        formData.postal_code,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                      {formData.region && `, ${formData.region}`}
                    </Typography>
                    <Typography variant="caption" color="primary">
                      Will be verified and added to map automatically
                    </Typography>
                  </Box>
                </Flex>
              </Box>
            )}

            {/* Multi-branch */}
            {formData.is_multi_branch &&
              formData.branch_addresses.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Additional Branches
                  </Typography>
                  {formData.branch_addresses.map((branch, index) => (
                    <Typography key={index} variant="body2">
                      {branch.name}:{" "}
                      {[branch.street_address, branch.suburb, branch.city]
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>
                  ))}
                </Box>
              )}

            {/* Contact Information */}
            {hasContactMethod && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Contact Information
                </Typography>
                {formData.contact_email && (
                  <Flex gap={1} alignItems="center">
                    <Icon icon="mdi:email" />
                    <Typography variant="body2">
                      {formData.contact_email}
                    </Typography>
                  </Flex>
                )}
                {formData.office_phone && (
                  <Flex gap={1} alignItems="center">
                    <Icon icon="mdi:phone" />
                    <Typography variant="body2">
                      {formData.office_phone}
                    </Typography>
                  </Flex>
                )}
                {formData.mobile_contacts.map((contact, index) => (
                  <Flex key={index} gap={1} alignItems="center">
                    <Icon icon="mdi:cellphone" />
                    <Typography variant="body2">
                      {contact.name}: {contact.number}
                    </Typography>
                  </Flex>
                ))}
                {formData.website && (
                  <Flex gap={1} alignItems="center">
                    <Icon icon="mdi:web" />
                    <Typography variant="body2" color="primary">
                      {formatWebsiteUrl(formData.website)}
                    </Typography>
                  </Flex>
                )}
              </Box>
            )}

            {/* Services */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Types of Work Undertaken
              </Typography>
              <Flex gap={1} flexWrap="wrap" mt={1}>
                {formData.types_of_work_undertaken.map((work, index) => (
                  <Chip
                    key={index}
                    label={work}
                    color="primary"
                    variant="filled"
                    size="small"
                  />
                ))}
              </Flex>
            </Box>

            {/* Insurance */}
            {formData.insurance_policies.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Insurance Policies
                </Typography>
                <Flex gap={1} flexWrap="wrap" mt={1}>
                  {formData.insurance_policies.map((policy, index) => (
                    <Chip
                      key={index}
                      label={policy}
                      color="secondary"
                      variant="filled"
                      size="small"
                    />
                  ))}
                </Flex>
              </Box>
            )}

            {/* Operating Hours */}
            {Object.keys(formData.operating_hours).length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Operating Hours
                </Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {Object.entries(formData.operating_hours).map(
                    ([day, hours]) => (
                      <Grid size={6} key={day}>
                        <Typography variant="body2">
                          <strong style={{ textTransform: "capitalize" }}>
                            {day}:
                          </strong>{" "}
                          {hours}
                        </Typography>
                      </Grid>
                    )
                  )}
                </Grid>
              </Box>
            )}

            {/* Additional Details */}
            <Grid container spacing={2}>
              {formData.out_of_zone_working && (
                <Grid size={6}>
                  <Flex gap={1} alignItems="center">
                    <Icon icon="mdi:map-marker-distance" color="#4caf50" />
                    <Typography variant="body2">
                      Out-of-zone work available
                    </Typography>
                  </Flex>
                </Grid>
              )}
              {formData.availability_date && (
                <Grid size={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Available From
                  </Typography>
                  <Typography variant="body2">
                    {new Date(formData.availability_date).toLocaleDateString()}
                  </Typography>
                </Grid>
              )}
            </Grid>

            {/* Certifications */}
            {formData.certifications.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Certifications
                </Typography>
                <Flex gap={1} flexWrap="wrap" mt={1}>
                  {formData.certifications.map((cert, index) => (
                    <Chip
                      key={index}
                      label={cert}
                      color="success"
                      variant="filled"
                      size="small"
                    />
                  ))}
                </Flex>
              </Box>
            )}

            {/* Social Media */}
            {Object.values(formData.social_media_links).some((link) =>
              link?.trim()
            ) && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Social Media
                </Typography>
                <Flex gap={1} flexWrap="wrap" mt={1}>
                  {Object.entries(formData.social_media_links).map(
                    ([platform, handle]) => {
                      if (!handle?.trim()) return null;
                      return (
                        <Chip
                          key={platform}
                          label={`${platform}: ${handle}`}
                          variant="outlined"
                          size="small"
                        />
                      );
                    }
                  )}
                </Flex>
              </Box>
            )}

            {/* Gallery */}
            {formData.gallery_files.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Gallery Images
                </Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {formData.gallery_files
                    .slice(0, 6)
                    .map((imageFile, index) => (
                      <Grid size={4} key={index}>
                        <img
                          src={imageFile.preview}
                          alt={`Gallery ${index + 1}`}
                          style={{
                            width: "100%",
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      </Grid>
                    ))}
                </Grid>
                {formData.gallery_files.length > 6 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    +{formData.gallery_files.length - 6} more images
                  </Typography>
                )}
              </Box>
            )}

            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Ready to submit!</strong>
                <br />
                Your business will be created and location-verified instantly
                using Google Maps. All images will be uploaded during the
                submission process.
              </Typography>
            </Alert>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ReviewStep;
