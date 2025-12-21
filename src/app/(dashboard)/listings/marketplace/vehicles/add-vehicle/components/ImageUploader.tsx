// components/ImageUploader.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  Typography,
  Alert,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Paper,
} from "@mui/material";
import { Icon } from "@iconify/react";
import Flex from "@/global/Flex";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 10,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed max
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    const uploadedUrls: string[] = [];

    try {
      // Upload files one by one
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image file`);
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          throw new Error(`${file.name} is too large. Maximum size is 10MB`);
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 15);
        const extension = file.name.split(".").pop();
        const fileName = `vehicles/${timestamp}-${randomStr}.${extension}`;

        // Create form data
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName);

        console.log(`Uploading ${file.name} as ${fileName}...`);

        // Upload to R2
        const response = await fetch("/api/r2/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const data = await response.json();
        console.log("Upload successful:", data);

        uploadedUrls.push(data.publicUrl);

        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      // Add new images to existing ones
      onChange([...images, ...uploadedUrls]);

      // Reset file input
      event.target.value = "";
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload images");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages);
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1" fontWeight={500}>
          Vehicle Images ({images.length}/{maxImages})
        </Typography>
        <Button
          component="label"
          variant="contained"
          startIcon={<Icon icon="mdi:upload" />}
          disabled={disabled || uploading || images.length >= maxImages}
          size="small"
        >
          Upload Images
          <input
            type="file"
            hidden
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={disabled || uploading || images.length >= maxImages}
          />
        </Button>
      </Flex>

      {uploading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Uploading... {Math.round(uploadProgress)}%
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {images.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: "center",
            backgroundColor: "grey.50",
            borderStyle: "dashed",
          }}
        >
          <Icon
            icon="mdi:image-multiple"
            width={48}
            height={48}
            color="#9e9e9e"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No images uploaded yet. Add up to {maxImages} images.
          </Typography>
        </Paper>
      ) : (
        <>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              First image will be used as the main listing photo. Drag to
              reorder.
            </Typography>
          </Alert>
          <ImageList cols={4} gap={8} sx={{ m: 0 }}>
            {images.map((url, index) => (
              <ImageListItem
                key={url}
                sx={{
                  border: index === 0 ? "2px solid" : "1px solid",
                  borderColor: index === 0 ? "primary.main" : "divider",
                  borderRadius: 1,
                  overflow: "hidden",
                  position: "relative",
                  cursor: "move",
                }}
              >
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  loading="lazy"
                  onError={(e) => {
                    console.error("Failed to load image:", url);
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.style.backgroundColor = "#f5f5f5";
                      parent.style.display = "flex";
                      parent.style.alignItems = "center";
                      parent.style.justifyContent = "center";
                      const errorDiv = document.createElement("div");
                      errorDiv.innerHTML = "⚠️<br/>Image Error";
                      errorDiv.style.textAlign = "center";
                      errorDiv.style.color = "#999";
                      parent.appendChild(errorDiv);
                    }
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <ImageListItemBar
                  sx={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                  }}
                  position="top"
                  actionIcon={
                    <Flex gap={0.5}>
                      {index > 0 && (
                        <IconButton
                          size="small"
                          onClick={() => handleReorder(index, index - 1)}
                          sx={{ color: "white" }}
                        >
                          <Icon icon="mdi:chevron-left" />
                        </IconButton>
                      )}
                      {index < images.length - 1 && (
                        <IconButton
                          size="small"
                          onClick={() => handleReorder(index, index + 1)}
                          sx={{ color: "white" }}
                        >
                          <Icon icon="mdi:chevron-right" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        sx={{ color: "error.light" }}
                      >
                        <Icon icon="mdi:delete" />
                      </IconButton>
                    </Flex>
                  }
                  actionPosition="right"
                />
                {index === 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      backgroundColor: "primary.main",
                      color: "white",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    Main Photo
                  </Box>
                )}
              </ImageListItem>
            ))}
          </ImageList>
        </>
      )}

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 2, display: "block" }}
      >
        Supported formats: JPG, PNG, WEBP. Maximum file size: 10MB per image.
      </Typography>
    </Box>
  );
};

export default ImageUploader;
