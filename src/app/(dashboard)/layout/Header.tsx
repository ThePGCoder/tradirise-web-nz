import { Box, IconButton } from "@mui/material";
import React from "react";
import { Icon } from "@iconify/react";

import ThemeToggle from "./ThemeToggle";

import Logo from "@/components/Logo";
import { useThemeMode } from "@/hooks/useThemeMode";

interface HeaderProps {
  toggleDrawer: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleDrawer }) => {
  const { mode } = useThemeMode();
  return (
    <>
      <Box
        position="fixed"
        top={0}
        left={0}
        display="flex"
        width={{ xs: "100%", sm: "100%", md: "calc(100% - 320px)" }}
        justifyContent={{
          xs: "space-between",
          sm: "space-between",
          md: "flex-end",
        }}
        alignItems="center"
        height="50px"
        px={1}
        marginLeft={{ xs: 0, sm: 0, md: "320px" }}
        borderBottom={
          mode === "light"
            ? "1px solid RGBA(0, 0, 0, 0.08)"
            : "1px solid RGBA(255, 255, 255, 0.08)"
        }
        zIndex={1100}
        sx={{
          backgroundColor: "transparent",
          backdropFilter: "blur(15px)",
        }}
      >
        <Box display={{ md: "none" }}>
          <IconButton onClick={toggleDrawer}>
            <Icon icon="ri:menu-3-line" height={20} />
          </IconButton>
        </Box>
        <Box display={{ md: "none" }}>
          <Logo fontSize={""} iconHeight={""} />
        </Box>
        <ThemeToggle />
      </Box>
    </>
  );
};

export default Header;
