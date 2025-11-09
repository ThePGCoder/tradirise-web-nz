"use client";

import React, { ReactNode } from "react";
import { Card, CardProps, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

import { lightTheme, darkTheme, darkBorder, lightBorder } from "@/styles/theme";
import { useThemeMode } from "@/hooks/useThemeMode";

interface CustomCardProps extends CardProps {
  children: ReactNode;
  undecorated?: boolean;
}

const CustomCard: React.FC<CustomCardProps> = ({
  children,
  sx,
  undecorated = false,
  ...rest
}) => {
  const { mode } = useThemeMode();
  const muiTheme = useTheme();

  const bgcolor =
    mode === "light"
      ? lightTheme.palette.background.paper
      : darkTheme.palette.background.paper;

  return (
    <Card
      {...rest}
      sx={[
        {
          bgcolor,
          borderRadius: 2,
          transition: muiTheme.transitions.create("box-shadow", {
            easing: muiTheme.transitions.easing.easeInOut,
            duration: muiTheme.transitions.duration.standard,
          }),
          boxShadow:
            mode === "dark"
              ? `inset 0 0 0 2px ${darkBorder}, ${muiTheme.shadows[6]}`
              : `inset 0 0 0 2px ${lightBorder}, ${muiTheme.shadows[6]}`,
          ...(!undecorated && {
            backgroundImage:
              mode === "light"
                ? "linear-gradient(#ffffff, #f8fafc)"
                : `linear-gradient(${grey[800]}, ${grey[900]})`,
          }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Card>
  );
};

export default CustomCard;
