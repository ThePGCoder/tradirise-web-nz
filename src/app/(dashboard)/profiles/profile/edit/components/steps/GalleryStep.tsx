// src/app/profile/edit/components/steps/GalleryStep.tsx
"use client";

import React from "react";
import {
  Typography,
  Box,
  Button,
  ImageList,
  ImageListItem,
  IconButton,
  Alert,
} from "@mui/material";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { UserProfile } from "../../../types/profile-types";
import { ImageFile } from "./EditProfileClient";

interface GalleryStepProps {
  profile: UserProfile;
  galleryFiles: ImageFile[];
  onGalleryChange: (files: ImageFile[]) => void;
  existingGalleryUrls?: string[];
  onExistingGalleryChange?: (urls: string[]) => void;
}

const GalleryStep: React.FC<GalleryStepProps> = ({
  profile,
  galleryFiles,
  onGalleryChange,
  existingGalleryUrls,
  onExistingGalleryChange,
}) => {
  const existingGallery = existingGalleryUrls || profile.gallery_urls || [];
  const maxImages = 12;
  const remainingSlots =
    maxImages - existingGallery.length - galleryFiles.length;

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > remainingSlots) {
      alert(`You can only add ${remainingSlots} more images`);
      return;
    }

    const validFiles: ImageFile[] = [];

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Max size is 10MB`);
        continue;
      }
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`);
        continue;
      }
      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
      });
    }

    if (validFiles.length > 0) {
      onGalleryChange([...galleryFiles, ...validFiles]);
    }
  };

  const handleRemoveNew = (index: number) => {
    const file = galleryFiles[index];
    URL.revokeObjectURL(file.preview);
    onGalleryChange(galleryFiles.filter((_, i) => i !== index));
  };

  const handleRemoveExisting = (index: number) => {
    if (onExistingGalleryChange) {
      const updatedUrls = existingGallery.filter((_, i) => i !== index);
      onExistingGalleryChange(updatedUrls);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Photo Gallery
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Showcase your work with a photo gallery (optional, max 12 images)
      </Typography>

      {!profile.trade_profile_enabled && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Enable your trade profile to add a work gallery
        </Alert>
      )}

      {profile.trade_profile_enabled && (
        <>
          <Box sx={{ mb: 2 }}>
            <Button
              component="label"
              variant="contained"
              startIcon={<Icon icon="mdi:image-plus" />}
              disabled={remainingSlots <= 0}
            >
              Add Images ({existingGallery.length + galleryFiles.length}/
              {maxImages})
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handleFilesSelect}
                disabled={remainingSlots <= 0}
              />
            </Button>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mt: 1 }}
            >
              Upload high-quality images of your work. Max 10MB per image.
            </Typography>
          </Box>

          {/* Existing Gallery Images */}
          {existingGallery.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Current Gallery ({existingGallery.length})
              </Typography>
              <ImageList
                sx={{ width: "100%", height: "auto" }}
                cols={3}
                gap={8}
              >
                {existingGallery.map((url, index) => (
                  <ImageListItem
                    key={`existing-${index}`}
                    sx={{
                      position: "relative",
                      "&:hover .delete-button": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: 200,
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </Box>
                    <IconButton
                      className="delete-button"
                      onClick={() => handleRemoveExisting(index)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        opacity: 0,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.7)",
                          transform: "scale(1.1)",
                        },
                        width: 28,
                        height: 28,
                      }}
                      size="small"
                    >
                      <Icon icon="mdi:close" width={16} />
                    </IconButton>
                  </ImageListItem>
                ))}
              </ImageList>
              <Typography variant="caption" color="text.secondary">
                Hover over images to remove them
              </Typography>
            </Box>
          )}

          {/* New Gallery Images */}
          {galleryFiles.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                mb={1}
                color="primary.main"
              >
                New Images to Upload ({galleryFiles.length})
              </Typography>
              <ImageList
                sx={{ width: "100%", height: "auto" }}
                cols={3}
                gap={8}
              >
                {galleryFiles.map((imgFile, index) => (
                  <ImageListItem
                    key={`new-${index}`}
                    sx={{
                      position: "relative",
                      "&:hover .delete-button": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: 200,
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={imgFile.preview}
                        alt={`New ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </Box>
                    <IconButton
                      className="delete-button"
                      onClick={() => handleRemoveNew(index)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        opacity: 0,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.7)",
                          transform: "scale(1.1)",
                        },
                        width: 28,
                        height: 28,
                      }}
                      size="small"
                    >
                      <Icon icon="mdi:close" width={16} />
                    </IconButton>
                  </ImageListItem>
                ))}
              </ImageList>
              <Alert severity="info" sx={{ mt: 2 }}>
                These images will be uploaded when you submit the form
              </Alert>
            </Box>
          )}

          {existingGallery.length === 0 && galleryFiles.length === 0 && (
            <Box
              sx={{
                border: "2px dashed",
                borderColor: "divider",
                borderRadius: 1,
                p: 4,
                textAlign: "center",
              }}
            >
              <Icon
                icon="mdi:image-multiple"
                width={48}
                style={{ opacity: 0.5 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                No gallery images yet. Add images to showcase your work.
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default GalleryStep;
