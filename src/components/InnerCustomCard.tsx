"use client";

import React, { ReactNode } from "react";
import { Box, BoxProps, useTheme } from "@mui/material";

import { lightBorder, darkBorder } from "@/styles/theme";
import { useThemeMode } from "@/hooks/useThemeMode";

interface CustomCardProps extends BoxProps {
  children: ReactNode;
}

const CustomCard: React.FC<CustomCardProps> = ({ children, sx, ...props }) => {
  const { mode } = useThemeMode();
  const muiTheme = useTheme();

  // pick your light/dark paper color from your theme definitions

  return (
    <Box
      {...props}
      sx={[
        {
          border: "1px solid",
          borderColor: mode === "light" ? lightBorder : darkBorder,
          borderRadius: 1,

          transition: muiTheme.transitions.create("width", {
            easing: muiTheme.transitions.easing.easeInOut,
            duration: muiTheme.transitions.duration.standard,
          }),
        },
        // allow callers to override or extend via sx prop
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
};

export default CustomCard;
