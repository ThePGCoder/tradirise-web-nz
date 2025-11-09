// src/components/ImageUpload.tsx
"use client";

import React from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { ImageFile } from "../business-form-types";

interface ImageUploadProps {
  label: string;
  imageFile?: ImageFile;
  existingImageUrl?: string;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  maxSize?: number; // in MB
  helperText?: string;
  aspectRatio?: string; // e.g., "16/9", "1/1"
  maxWidth?: number;
  maxHeight?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  imageFile,
  existingImageUrl,
  onImageSelect,
  onImageRemove,
  maxSize = 10,
  helperText,
  aspectRatio = "16/9",
  maxWidth = 400,
  maxHeight = 300,
}) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    onImageSelect(file);
    // Reset input
    event.target.value = "";
  };

  const inputId = `image-upload-${label.replace(/\s+/g, "-").toLowerCase()}`;

  // Determine which image to display
  const displayImage = imageFile ? imageFile.preview : existingImageUrl;
  const hasImage = !!displayImage;

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>

      {hasImage ? (
        <Card variant="outlined" sx={{ maxWidth, mb: 1 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ position: "relative" }}>
              <img
                src={displayImage}
                alt={label}
                style={{
                  width: "100%",
                  maxHeight: maxHeight,
                  objectFit: "cover",
                  borderRadius: 8,
                  aspectRatio: aspectRatio,
                }}
              />
              <IconButton
                onClick={onImageRemove}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.8)",
                  },
                }}
                size="small"
              >
                <Icon icon="mdi:close" />
              </IconButton>
            </Box>
            {imageFile && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {imageFile.file.name} (
                {(imageFile.file.size / 1024 / 1024).toFixed(2)} MB)
              </Typography>
            )}
            {!imageFile && existingImageUrl && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Current image (click X to remove)
              </Typography>
            )}
          </CardContent>
        </Card>
      ) : (
        <Box
          sx={{
            border: "2px dashed",
            borderColor: "grey.300",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            maxWidth,
            aspectRatio: aspectRatio,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "action.hover",
            },
          }}
          onClick={() => document.getElementById(inputId)?.click()}
        >
          <Icon
            icon="mdi:cloud-upload"
            style={{ fontSize: 48, color: "#999" }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Click to select {label.toLowerCase()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Max {maxSize}MB
          </Typography>
        </Box>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        id={inputId}
      />

      {!hasImage && (
        <Button
          onClick={() => document.getElementById(inputId)?.click()}
          variant="text"
          size="small"
          startIcon={<Icon icon="mdi:upload" />}
          sx={{ mt: 1 }}
        >
          Upload {label}
        </Button>
      )}

      {hasImage && (
        <Button
          onClick={() => document.getElementById(inputId)?.click()}
          variant="text"
          size="small"
          startIcon={<Icon icon="mdi:swap-horizontal" />}
          sx={{ mt: 1 }}
        >
          Change {label}
        </Button>
      )}

      {helperText && (
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mt: 1 }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUpload;
