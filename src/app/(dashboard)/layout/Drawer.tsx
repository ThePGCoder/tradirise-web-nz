// src/components/CustomDrawer.tsx
"use client";

import Logo from "@/components/Logo";
import { Drawer, Box, Divider } from "@mui/material";
import { useThemeMode } from "@/hooks/useThemeMode";
import NavMenuClient from "./NavMenuClient";
import { grey } from "@mui/material/colors";

interface CustomDrawerProps {
  drawer: {
    open: boolean;
    toggleOpen: () => void;
  };
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ drawer }) => {
  const { mode } = useThemeMode();

  return (
    <Drawer open={drawer.open} onClose={drawer.toggleOpen} variant="temporary">
      <Box
        width="320px"
        p="12px"
        bgcolor={mode === "light" ? "white" : grey[900]}
        height="100%"
      >
        <Box display="flex" justifyContent="center" width="100%" paddingY={2}>
          <Logo fontSize={"20px"} showCountry={true} countryIconSize={12} />
        </Box>
        <Divider />
        {/* ✅ No props needed - NavMenuClient uses useUser hook */}
        <NavMenuClient toggleDrawer={drawer.toggleOpen} />
      </Box>
    </Drawer>
  );
};

export default CustomDrawer;
