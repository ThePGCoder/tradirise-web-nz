// src/app/profile/edit/components/steps/UserInfoStep.tsx
"use client";

import React from "react";
import {
  TextField,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Alert,
} from "@mui/material";
import { ProfileFormData } from "../../../types/profile-types";
import { UserProfile } from "../../../types/profile-types";

import Flex from "@/global/Flex";
import ImageUpload from "@/app/(dashboard)/profiles/business-profiles/add-business/components/ImageUpload";
import { ImageFile } from "./EditProfileClient";

interface UserInfoStepProps {
  formData: ProfileFormData;
  onInputChange: <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => void;
  profile: UserProfile;
  avatarFile: ImageFile | null;
  coverFile: ImageFile | null;
  onAvatarChange: (file: ImageFile | null) => void;
  onCoverChange: (file: ImageFile | null) => void;
}

const UserInfoStep: React.FC<UserInfoStepProps> = ({
  formData,
  onInputChange,
  profile,
  avatarFile,
  coverFile,
  onAvatarChange,
  onCoverChange,
}) => {
  const handleAvatarSelect = (file: File) => {
    onAvatarChange({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleAvatarRemove = () => {
    if (avatarFile) {
      URL.revokeObjectURL(avatarFile.preview);
    }
    onAvatarChange(null);
  };

  const handleCoverSelect = (file: File) => {
    onCoverChange({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleCoverRemove = () => {
    if (coverFile) {
      URL.revokeObjectURL(coverFile.preview);
    }
    onCoverChange(null);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        User Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Update your basic profile information and images
      </Typography>

      {/* Basic Information */}
      <Box mb={3}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Basic Information
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              label="First Name"
              value={formData.first_name}
              onChange={(e) => onInputChange("first_name", e.target.value)}
              helperText="Minimum 2 characters"
              error={
                formData.first_name.length > 0 && formData.first_name.length < 2
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              label="Last Name"
              value={formData.last_name}
              onChange={(e) => onInputChange("last_name", e.target.value)}
              helperText="Minimum 2 characters"
              error={
                formData.last_name.length > 0 && formData.last_name.length < 2
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              disabled
              label="Username"
              value={formData.username}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>@</Typography>,
              }}
              helperText="Your username cannot be changed"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Trade Profile Toggle */}
      <Card sx={{ mb: 3 }} variant="outlined">
        <CardContent>
          <Flex justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Trade Profile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData.trade_profile_enabled
                  ? "Your trade profile is enabled and will be visible to employers"
                  : "Enable to showcase your trade skills and experience"}
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.trade_profile_enabled}
                  onChange={(e) =>
                    onInputChange("trade_profile_enabled", e.target.checked)
                  }
                  color="primary"
                />
              }
              label=""
            />
          </Flex>

          {!formData.trade_profile_enabled && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Enable your trade profile to access additional profile features
              and connect with potential employers.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Profile Images */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Profile Images
        </Typography>

        <Grid container spacing={3}>
          {/* Cover Image */}
          <Grid size={{ xs: 12 }}>
            <ImageUpload
              label="Cover Image"
              imageFile={coverFile || undefined}
              existingImageUrl={profile.cover_url || undefined}
              onImageSelect={handleCoverSelect}
              onImageRemove={handleCoverRemove}
              maxSize={10}
              helperText="Recommended size: 1200x400px. This appears at the top of your profile."
              aspectRatio="3/1"
              maxWidth={600}
              maxHeight={200}
            />
          </Grid>

          {/* Avatar Image */}
          <Grid size={{ xs: 12 }}>
            <ImageUpload
              label="Profile Picture"
              imageFile={avatarFile || undefined}
              existingImageUrl={profile.avatar_url || undefined}
              onImageSelect={handleAvatarSelect}
              onImageRemove={handleAvatarRemove}
              maxSize={10}
              helperText="Recommended: Square image (1:1 ratio). This appears throughout the site."
              aspectRatio="1/1"
              maxWidth={300}
              maxHeight={300}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UserInfoStep;
