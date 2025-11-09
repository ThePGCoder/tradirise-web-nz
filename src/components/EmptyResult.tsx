"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import Center from "@/global/Center";
import CustomCard from "./CustomCard";

interface EmptyResultProps {
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  showButton?: boolean;
  height?: string;
  sx?: object;
}

const EmptyResult: React.FC<EmptyResultProps> = ({
  icon = "ph:empty-bold",
  iconSize = 50,
  iconColor = "text.secondary",
  title = "No Results Found",
  description = "Add an item to see them here.",
  buttonText = "Get Started",
  onButtonClick,
  showButton = true,
  height = "calc(100vh - 100px)",
  sx = {},
}) => {
  return (
    <Center sx={{ height, ...sx }}>
      <CustomCard sx={{ p: 8 }}>
        <Box textAlign="center" color="text.secondary">
          <Box color={iconColor} sx={{ mb: 2 }}>
            <Icon icon={icon} height={iconSize} width={iconSize} />
          </Box>
          <Typography variant="h6" component="div" gutterBottom>
            {title}
          </Typography>
          <Typography component="p" sx={{ mb: 2 }}>
            {description}
          </Typography>
          {showButton && onButtonClick && (
            <Button variant="contained" onClick={onButtonClick}>
              {buttonText}
            </Button>
          )}
        </Box>
      </CustomCard>
    </Center>
  );
};

export default EmptyResult;
