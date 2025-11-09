// src/components/Sidebar.tsx
"use client";

import { Box, Divider } from "@mui/material";
import React from "react";
import { darkBorder, lightBorder } from "@/styles/theme";
import Logo from "@/components/Logo";
import { useThemeMode } from "@/hooks/useThemeMode";
import NavMenuClient from "./NavMenuClient";

const Sidebar: React.FC = () => {
  const { mode } = useThemeMode();

  return (
    <Box
      position="fixed"
      top={0}
      width="320px"
      border="1px solid"
      borderLeft="none"
      borderTop="none"
      borderBottom="none"
      borderColor={mode === "light" ? lightBorder : darkBorder}
      height="100%"
      display={{ xs: "none", sm: "none", md: "block" }}
      p={2}
      bgcolor={mode === "light" ? "white" : "#242424"}
    >
      <Box display="flex" justifyContent="center" width="100%" paddingY={2}>
        <Logo fontSize={"20px"} showCountry={true} countryIconSize={12} />
      </Box>
      <Divider />
      {/* ✅ No props needed - NavMenuClient uses useUser hook */}
      <NavMenuClient />
    </Box>
  );
};

export default Sidebar;
