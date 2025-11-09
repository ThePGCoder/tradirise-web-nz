// src/app/profile/edit/components/steps/ReviewStep.tsx
"use client";

import React from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
  Avatar,
  ImageList,
  ImageListItem,
} from "@mui/material";

import { ProfileFormData, UserProfile } from "../../../types/profile-types";

import Image from "next/image";
import { ImageFile } from "./EditProfileClient";

interface ReviewStepProps {
  formData: ProfileFormData;
  profile: UserProfile;
  avatarFile: ImageFile | null;
  coverFile: ImageFile | null;
  galleryFiles: ImageFile[];
  existingGalleryUrls?: string[];
}

interface SkillItem {
  trade: string;
  skill: string;
}

interface AccreditationItem {
  category: string;
  accreditation: string;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  profile,
  avatarFile,
  coverFile,
  galleryFiles,
  existingGalleryUrls,
}) => {
  const hasImageChanges = avatarFile || coverFile || galleryFiles.length > 0;
  const existingGallery = existingGalleryUrls || profile.gallery_urls || [];

  // Helper to render skills safely
  const renderSkills = () => {
    if (!formData.skills || formData.skills.length === 0) return null;

    return (
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Skills
          </Typography>
          <Grid container spacing={1}>
            {formData.skills.map((skill, i) => {
              // Check if it's a structured skill object
              if (
                typeof skill === "object" &&
                skill !== null &&
                "trade" in skill &&
                "skill" in skill
              ) {
                const structuredSkill = skill as SkillItem;
                return (
                  <Grid key={i}>
                    <Chip
                      label={`${structuredSkill.trade}: ${structuredSkill.skill}`}
                      color="info"
                    />
                  </Grid>
                );
              }
              // Otherwise treat as string
              return (
                <Grid key={i}>
                  <Chip label={String(skill)} color="info" />
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Helper to render accreditations safely
  const renderAccreditations = () => {
    if (!formData.accreditations || formData.accreditations.length === 0)
      return null;

    return (
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Accreditations
          </Typography>
          <Grid container spacing={1}>
            {formData.accreditations.map((acc, i) => {
              // Check if it's a structured accreditation object
              if (
                typeof acc === "object" &&
                acc !== null &&
                "category" in acc &&
                "accreditation" in acc
              ) {
                const structuredAcc = acc as AccreditationItem;
                return (
                  <Grid key={i}>
                    <Chip
                      label={`${structuredAcc.category}: ${structuredAcc.accreditation}`}
                      color="success"
                    />
                  </Grid>
                );
              }
              // Otherwise treat as string
              return (
                <Grid key={i}>
                  <Chip label={String(acc)} color="success" />
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review & Submit
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review all changes before submitting. Images will be uploaded when you
        click Update Profile.
      </Typography>

      {hasImageChanges && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600} mb={1}>
            Images to Upload
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {avatarFile && "• New profile picture\n"}
            {coverFile && "• New cover image\n"}
            {galleryFiles.length > 0 &&
              `• ${galleryFiles.length} new gallery image${
                galleryFiles.length > 1 ? "s" : ""
              }`}
          </Typography>
        </Alert>
      )}

      {/* Images Preview */}
      {hasImageChanges && (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Image Updates
            </Typography>

            {/* Cover Image */}
            {coverFile && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  New Cover Image
                </Typography>
                <Box
                  sx={{
                    height: 200,
                    borderRadius: 1,
                    overflow: "hidden",
                    backgroundImage: `url(${coverFile.preview})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </Box>
            )}

            {/* Avatar */}
            {avatarFile && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  New Profile Picture
                </Typography>
                <Avatar
                  src={avatarFile.preview}
                  sx={{ width: 100, height: 100 }}
                />
              </Box>
            )}

            {/* Gallery */}
            {galleryFiles.length > 0 && (
              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  New Gallery Images ({galleryFiles.length})
                </Typography>
                <ImageList
                  sx={{ width: "100%", height: "auto" }}
                  cols={4}
                  gap={8}
                >
                  {galleryFiles.map((imgFile, index) => (
                    <ImageListItem key={index}>
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: 150,
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={imgFile.preview}
                          alt={`Gallery ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </Box>
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* User Information */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            User Information
          </Typography>

          <Box mb={1}>
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              Name:
            </Typography>
            <Typography variant="body1">
              {formData.first_name} {formData.last_name}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              Username:
            </Typography>
            <Typography variant="body1">@{formData.username}</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Trade Profile Details - Only show if enabled */}
      {formData.trade_profile_enabled && (
        <>
          {/* Bio */}
          {formData.bio && (
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Professional Bio
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {formData.bio}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          {(formData.contact_email || formData.mobile || formData.website) && (
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Contact Information
                </Typography>

                {formData.contact_email && (
                  <Box mb={1}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      Email:
                    </Typography>
                    <Typography variant="body1">
                      {formData.contact_email}
                    </Typography>
                  </Box>
                )}

                {formData.mobile && (
                  <Box mb={1}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      Mobile:
                    </Typography>
                    <Typography variant="body1">{formData.mobile}</Typography>
                  </Box>
                )}

                {formData.website && (
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      Website:
                    </Typography>
                    <Typography variant="body1">{formData.website}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Location & Experience */}
          {(formData.region ||
            formData.max_servicable_radius ||
            formData.years_in_trade) && (
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Location & Experience
                </Typography>

                {formData.region && (
                  <Box mb={1}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      Location:
                    </Typography>
                    <Typography variant="body1">
                      {formData.suburb && formData.city
                        ? `${formData.suburb}, ${formData.city}`
                        : formData.city || formData.region}
                    </Typography>
                  </Box>
                )}

                {formData.max_servicable_radius > 0 && (
                  <Box mb={1}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      Service Radius:
                    </Typography>
                    <Typography variant="body1">
                      {formData.max_servicable_radius >= 200
                        ? "Nationwide"
                        : `${formData.max_servicable_radius} km`}
                    </Typography>
                  </Box>
                )}

                {formData.years_in_trade > 0 && (
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      Years in Trade:
                    </Typography>
                    <Typography variant="body1">
                      {formData.years_in_trade}{" "}
                      {formData.years_in_trade === 1 ? "year" : "years"}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Roles */}
          {formData.primary_trade_role && (
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Trade Roles
                </Typography>

                <Box mb={2}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    Primary Role:
                  </Typography>
                  <Box mt={0.5}>
                    <Chip label={formData.primary_trade_role} color="primary" />
                  </Box>
                </Box>

                {formData.secondary_trade_roles &&
                  formData.secondary_trade_roles.length > 0 && (
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.secondary"
                        mb={1}
                      >
                        Secondary Roles:
                      </Typography>
                      <Grid container spacing={1}>
                        {formData.secondary_trade_roles.map((role, i) => (
                          <Grid key={i}>
                            <Chip label={role} color="primary" />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {renderSkills()}

          {/* Accreditations */}
          {renderAccreditations()}

          {/* Work Gallery */}
          {(existingGallery.length > 0 || galleryFiles.length > 0) && (
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Work Gallery ({existingGallery.length + galleryFiles.length}{" "}
                  images)
                </Typography>

                {/* Existing Gallery Images */}
                {existingGallery.length > 0 && (
                  <Box sx={{ mb: galleryFiles.length > 0 ? 3 : 0 }}>
                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                      Current Images ({existingGallery.length})
                    </Typography>
                    <ImageList
                      sx={{ width: "100%", height: "auto" }}
                      cols={4}
                      gap={8}
                    >
                      {existingGallery.map((url, index) => (
                        <ImageListItem key={`existing-${index}`}>
                          <Box
                            sx={{
                              position: "relative",
                              width: "100%",
                              height: 150,
                              borderRadius: 1,
                              overflow: "hidden",
                            }}
                          >
                            <Image
                              src={url}
                              alt={`Existing ${index + 1}`}
                              fill
                              style={{ objectFit: "cover" }}
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                          </Box>
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Box>
                )}

                {/* New Gallery Images */}
                {galleryFiles.length > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      mb={1}
                      color="primary.main"
                    >
                      New Images ({galleryFiles.length})
                    </Typography>
                    <ImageList
                      sx={{ width: "100%", height: "auto" }}
                      cols={4}
                      gap={8}
                    >
                      {galleryFiles.map((imgFile, index) => (
                        <ImageListItem key={`new-${index}`}>
                          <Box
                            sx={{
                              position: "relative",
                              width: "100%",
                              height: 150,
                              borderRadius: 1,
                              overflow: "hidden",
                            }}
                          >
                            <Image
                              src={imgFile.preview}
                              alt={`New ${index + 1}`}
                              fill
                              style={{ objectFit: "cover" }}
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                          </Box>
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
};

export default ReviewStep;
