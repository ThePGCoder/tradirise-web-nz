// components/FavouriteButton.tsx
"use client";

import React from "react";
import { Button, CircularProgress, Box } from "@mui/material";
import { Icon } from "@iconify/react";
import { useFavourite } from "@/hooks/useFavourite";

interface FavouriteButtonProps {
  itemType: "personnel" | "business" | "position" | "project";
  itemId: string;
  size?: "small" | "medium" | "large";
  onToggle?: (isFavourited: boolean) => void;
}

const FavouriteButton: React.FC<FavouriteButtonProps> = ({
  itemType,
  itemId,
  size = "small",
  onToggle,
}) => {
  const { isFavourited, isLoading, isToggling, toggleFavourite } = useFavourite(
    itemType,
    itemId,
    onToggle
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavourite();
  };

  if (isLoading) {
    return (
      <Button
        size={size}
        variant="text"
        color="info"
        disabled
        sx={{
          fontSize: { xs: "0.75rem", md: "0.875rem" },
          textTransform: "none",
          minWidth: { xs: "auto", sm: "64px" },
          px: { xs: 1, sm: 2 },
        }}
      >
        <CircularProgress size={16} color="info" />
      </Button>
    );
  }

  return (
    <Button
      size={size}
      variant="text"
      color="info"
      onClick={handleClick}
      disabled={isToggling}
      startIcon={
        isToggling ? (
          <CircularProgress size={16} color="info" />
        ) : (
          <Icon
            icon={isFavourited ? "mdi:star" : "mdi:star-outline"}
            width={16}
            height={16}
          />
        )
      }
      sx={{
        fontSize: { xs: "0.75rem", sm: "0.875rem" },
        textTransform: "none",
        minWidth: { xs: "auto", sm: "64px" },
        px: { xs: 1, sm: 2 },
        "& .MuiButton-startIcon": {
          margin: { xs: 0, sm: "0 8px 0 -4px" },
        },
      }}
    >
      <Box sx={{ display: { xs: "none", sm: "inline" } }}>
        {isFavourited ? "Saved" : "Save"}
      </Box>
    </Button>
  );
};

export default FavouriteButton;
