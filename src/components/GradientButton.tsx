import { Box, Button } from "@mui/material";
import React, { ReactNode } from "react";
import {
  darkGradient,
  darkShadow,
  lightGradient,
  lightShadow,
} from "../styles/theme";
import { Icon } from "@iconify/react";
import { useThemeMode } from "@/hooks/useThemeMode";

interface GradientButtonProps {
  children?: ReactNode;
  startIcon?: string;
  endIcon?: string;
  onClick?: () => void;
  width?: string | number;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  startIcon,
  endIcon,
  onClick,
  width,
}) => {
  const { mode } = useThemeMode();
  return (
    <>
      <Button
        startIcon={startIcon && <Icon icon={startIcon} />}
        endIcon={endIcon && <Icon icon={endIcon} />}
        variant="contained"
        onClick={onClick}
        sx={{
          background: mode === "light" ? darkGradient : lightGradient,
          width: width,
          px: "32px",
          height: "40px",

          textTransform: "none",
          "&:hover": {
            boxShadow: mode === "light" ? lightShadow : darkShadow,
          },
        }}
      >
        <Box fontSize="1rem">{children}</Box>
      </Button>
    </>
  );
};

export default GradientButton;
