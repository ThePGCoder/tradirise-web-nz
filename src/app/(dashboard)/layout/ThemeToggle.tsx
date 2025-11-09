import { IconButton } from "@mui/material";
import React from "react";
import { Icon } from "@iconify/react";
import { useThemeMode } from "@/hooks/useThemeMode";

const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useThemeMode();
  return (
    <>
      <IconButton onClick={toggleTheme}>
        {mode === "light" ? (
          <Icon icon="mage:moon-fill" height={24} />
        ) : (
          <Icon icon="mage:sun-fill" height={24} />
        )}
      </IconButton>
    </>
  );
};

export default ThemeToggle;
