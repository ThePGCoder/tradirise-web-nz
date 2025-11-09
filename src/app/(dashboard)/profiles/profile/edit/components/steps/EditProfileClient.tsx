// src/app/profile/edit/components/EditProfileClient.tsx
"use client";

import React, { useContext, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Box,
  Card,
  CardContent,
  Alert,
  Avatar,
  Typography,
  LinearProgress,
} from "@mui/material";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";
import CustomStepper from "@/components/CustomStepper";
import Flex from "@/global/Flex";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";
import {
  ProfileFormData,
  UserProfile,
  SkillItem,
  AccreditationItem,
} from "../../../types/profile-types";
import { updateProfileAction } from "../../../profile-actions";
import UserInfoStep from "./UserInfoStep";
import LocationAvailabilityStep from "./LocationAvailabilityStep";
import TradeDetailsStep from "./TradeDetailsStep";
import SkillsCredentialsStep from "./SkillsCredentialsStep";
import GalleryStep from "./GalleryStep";
import ReviewStep from "./ReviewStep";

interface EditProfileClientProps {
  profile: UserProfile;
}

export interface ImageFile {
  file: File;
  preview: string;
}

// Helper function to parse flat strings back to structured format
const parseSkillsToStructured = (
  skills: string[] | null
): (string | SkillItem)[] => {
  if (!skills || !Array.isArray(skills)) return [];

  return skills.map((skill) => {
    // If already structured, return as is
    if (typeof skill === "object" && "trade" in skill && "skill" in skill) {
      return skill as SkillItem;
    }

    // If it's a string with ":", parse it
    if (typeof skill === "string" && skill.includes(":")) {
      const [trade, skillName] = skill.split(":").map((s) => s.trim());
      return { trade, skill: skillName };
    }

    // Fallback: treat as skill without trade
    return { trade: "Other", skill: String(skill) };
  });
};

// Helper function to parse flat strings back to structured format
const parseAccreditationsToStructured = (
  accreditations: string[] | null
): (string | AccreditationItem)[] => {
  if (!accreditations || !Array.isArray(accreditations)) return [];

  return accreditations.map((acc) => {
    // If already structured, return as is
    if (
      typeof acc === "object" &&
      "category" in acc &&
      "accreditation" in acc
    ) {
      return acc as AccreditationItem;
    }

    // If it's a string with ":", parse it
    if (typeof acc === "string" && acc.includes(":")) {
      const [category, accreditation] = acc.split(":").map((s) => s.trim());
      return { category, accreditation };
    }

    // Fallback: treat as accreditation without category
    return { category: "Other", accreditation: String(acc) };
  });
};

const EditProfileClient: React.FC<EditProfileClientProps> = ({ profile }) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Image state
  const [avatarFile, setAvatarFile] = useState<ImageFile | null>(null);
  const [coverFile, setCoverFile] = useState<ImageFile | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<ImageFile[]>([]);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>(
    profile.gallery_urls || []
  );

  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    username: profile.username || "",
    trade_profile_enabled: profile.trade_profile_enabled || false,
    bio: profile.bio || "",
    contact_email: profile.contact_email || "",
    mobile: profile.mobile || "",
    website: profile.website || "",
    region: profile.region || "",
    suburb: profile.suburb || "",
    city: profile.city || "",
    primary_trade_role: profile.primary_trade_role || "",
    secondary_trade_roles: profile.secondary_trade_roles || [],
    max_servicable_radius: profile.max_servicable_radius || 50,
    // Parse existing skills and accreditations to structured format
    skills: parseSkillsToStructured(profile.skills),
    accreditations: parseAccreditationsToStructured(profile.accreditations),
    years_in_trade: profile.years_in_trade || 0,
  });

  const steps = [
    "User Information",
    "Trade Details",
    "Location & Service Area",
    "Skills & Credentials",
    "Gallery",
    "Review & Submit",
  ];

  useEffect(() => {
    changeActiveRoute("Edit Profile");
  }, [changeActiveRoute]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (avatarFile) URL.revokeObjectURL(avatarFile.preview);
      if (coverFile) URL.revokeObjectURL(coverFile.preview);
      galleryFiles.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [avatarFile, coverFile, galleryFiles]);

  const handleInputChange = <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const uploadImage = async (file: File, fileName: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);

    const response = await fetch("/api/r2/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    const data = await response.json();
    return data.publicUrl;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsUploading(true);

    startTransition(async () => {
      try {
        // Upload images first
        let avatarUrl = profile.avatar_url;
        let coverUrl = profile.cover_url;

        // Start with existing gallery URLs (which may have been modified by user)
        const galleryUrls = [...existingGalleryUrls];

        // Upload avatar
        if (avatarFile) {
          const fileName = `avatars/${
            profile.id
          }-${Date.now()}.${avatarFile.file.name.split(".").pop()}`;
          avatarUrl = await uploadImage(avatarFile.file, fileName);
        }

        // Upload cover
        if (coverFile) {
          const fileName = `covers/${
            profile.id
          }-${Date.now()}.${coverFile.file.name.split(".").pop()}`;
          coverUrl = await uploadImage(coverFile.file, fileName);
        }

        // Upload gallery images
        if (galleryFiles.length > 0) {
          for (const imgFile of galleryFiles) {
            const fileName = `gallery/${
              profile.id
            }-${Date.now()}-${Math.random()
              .toString(36)
              .substring(7)}.${imgFile.file.name.split(".").pop()}`;
            const url = await uploadImage(imgFile.file, fileName);
            galleryUrls.push(url);
          }
        }

        const submissionData = {
          ...formData,
          avatar_url: avatarUrl,
          cover_url: coverUrl,
          gallery_urls: galleryUrls,
          website: formData.website
            ? formData.website.startsWith("http")
              ? formData.website
              : `https://${formData.website}`
            : "",
        };

        const result = await updateProfileAction(submissionData);

        if (result.success) {
          setSuccess("Profile updated successfully!");
          setTimeout(() => {
            router.push("/profile");
          }, 2000);
        } else {
          setError(result.error || "Failed to update profile");
        }
      } catch (err) {
        console.error("Submit error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred. Please try again."
        );
      } finally {
        setIsUploading(false);
      }
    });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <UserInfoStep
            formData={formData}
            onInputChange={handleInputChange}
            profile={profile}
            avatarFile={avatarFile}
            coverFile={coverFile}
            onAvatarChange={setAvatarFile}
            onCoverChange={setCoverFile}
          />
        );
      case 1:
        return (
          <TradeDetailsStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <LocationAvailabilityStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <SkillsCredentialsStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 4:
        return (
          <GalleryStep
            profile={profile}
            galleryFiles={galleryFiles}
            onGalleryChange={setGalleryFiles}
            existingGalleryUrls={existingGalleryUrls}
            onExistingGalleryChange={setExistingGalleryUrls}
          />
        );
      case 5:
        return (
          <ReviewStep
            formData={formData}
            profile={profile}
            avatarFile={avatarFile}
            coverFile={coverFile}
            galleryFiles={galleryFiles}
            existingGalleryUrls={existingGalleryUrls}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box mt={3}>
      <Button
        onClick={() => router.back()}
        startIcon={<Icon icon="mdi:arrow-left" />}
        sx={{ mb: 3 }}
        variant="text"
        disabled={isPending || isUploading}
      >
        Back to Profile
      </Button>

      <CustomCard sx={{ overflow: "visible" }}>
        <Box sx={{ p: 3, overflow: "visible" }}>
          <Card variant="outlined">
            <CardContent>
              <Flex alignItems="center" gap={2}>
                <Avatar
                  src={avatarFile?.preview || profile.avatar_url || ""}
                  sx={{ width: 60, height: 60 }}
                >
                  {formData.first_name?.[0] || profile.username?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">Edit Profile</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Update your personal and trade information
                  </Typography>
                </Box>
              </Flex>
            </CardContent>
          </Card>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {(isPending || isUploading) && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                {isUploading ? "Uploading images..." : "Updating profile..."}
              </Typography>
            </Box>
          )}

          <CustomStepper
            steps={steps}
            activeStep={activeStep}
            stepSpacing={160}
          />

          <Box sx={{ mb: 4, mt: 4, overflow: "visible" }}>
            {renderStepContent(activeStep)}
          </Box>

          <Flex justifyContent="space-between">
            <Button
              disabled={activeStep === 0 || isPending || isUploading}
              onClick={handleBack}
              variant="text"
              startIcon={<Icon icon="mdi:arrow-left" />}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={isPending || isUploading}
                startIcon={
                  isPending || isUploading ? (
                    <Icon icon="mdi:loading" className="animate-spin" />
                  ) : (
                    <Icon icon="mdi:check" />
                  )
                }
              >
                {isPending || isUploading ? "Updating..." : "Update Profile"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                disabled={isPending || isUploading}
                endIcon={<Icon icon="mdi:arrow-right" />}
              >
                Next
              </Button>
            )}
          </Flex>
        </Box>
      </CustomCard>
    </Box>
  );
};

export default EditProfileClient;
