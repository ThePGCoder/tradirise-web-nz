// src/components/steps/AdditionalDetailsStep.tsx
"use client";

import React from "react";
import {
  Typography,
  TextField,
  Stack,
  Autocomplete,
  Chip,
  Box,
  InputAdornment,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { BusinessFormData, SocialMediaLinks } from "../../business-form-types";
import { groupedCertificationTypes } from "@/lib/data/businessData";

interface AdditionalDetailsStepProps {
  formData: BusinessFormData;
  onInputChange: <K extends keyof BusinessFormData>(
    field: K,
    value: BusinessFormData[K]
  ) => void;
}

const AdditionalDetailsStep: React.FC<AdditionalDetailsStepProps> = ({
  formData,
  onInputChange,
}) => {
  // Flatten grouped certification types for autocomplete options
  const allCertificationTypes = React.useMemo(
    () => groupedCertificationTypes.flatMap((group) => group.types),
    []
  );

  const updateSocialMediaLink = (
    platform: keyof SocialMediaLinks,
    url: string
  ) => {
    // Remove protocol and www from social media URLs
    const cleanUrl = url.replace(/^https?:\/\//, "").replace(/^www\./, "");

    onInputChange("social_media_links", {
      ...formData.social_media_links,
      [platform]: cleanUrl,
    });
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6" component="h3">
        Additional Details
      </Typography>

      <Autocomplete
        multiple
        options={allCertificationTypes}
        value={formData.certifications}
        onChange={(_, newValue) => onInputChange("certifications", newValue)}
        groupBy={(option) => {
          const group = groupedCertificationTypes.find((g) =>
            g.types.includes(option)
          );
          return group?.group || "Other";
        }}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option}
              {...getTagProps({ index })}
              key={option}
              color="success"
              variant="filled"
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Certifications"
            fullWidth
            helperText="Professional certifications and memberships"
          />
        )}
      />

      <Box>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Social Media Links
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Enter social media usernames or profile URLs (without protocols)
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Facebook"
            value={formData.social_media_links.facebook || ""}
            onChange={(e) => updateSocialMediaLink("facebook", e.target.value)}
            fullWidth
            placeholder="facebook.com/yourbusiness"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon="mdi:facebook" color="#1877F2" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Instagram"
            value={formData.social_media_links.instagram || ""}
            onChange={(e) => updateSocialMediaLink("instagram", e.target.value)}
            fullWidth
            placeholder="instagram.com/yourbusiness"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon="mdi:instagram" color="#E4405F" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="LinkedIn"
            value={formData.social_media_links.linkedin || ""}
            onChange={(e) => updateSocialMediaLink("linkedin", e.target.value)}
            fullWidth
            placeholder="linkedin.com/company/yourbusiness"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon="mdi:linkedin" color="#0A66C2" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="YouTube"
            value={formData.social_media_links.youtube || ""}
            onChange={(e) => updateSocialMediaLink("youtube", e.target.value)}
            fullWidth
            placeholder="youtube.com/@yourbusiness"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon="mdi:youtube" color="#FF0000" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="TikTok"
            value={formData.social_media_links.tiktok || ""}
            onChange={(e) => updateSocialMediaLink("tiktok", e.target.value)}
            fullWidth
            placeholder="tiktok.com/@yourbusiness"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon="ic:baseline-tiktok" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Twitter/X"
            value={formData.social_media_links.twitter || ""}
            onChange={(e) => updateSocialMediaLink("twitter", e.target.value)}
            fullWidth
            placeholder="x.com/yourbusiness"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon="mdi:twitter" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default AdditionalDetailsStep;
