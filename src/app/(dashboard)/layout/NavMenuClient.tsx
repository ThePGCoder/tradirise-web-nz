// src/components/navigation/NavMenuClient.tsx
"use client";

import { publicNavData, protectedNavData } from "@/lib/data/navItemData";
import NavMenu from "./NavMenu";
import { Box, CircularProgress } from "@mui/material";
import { useUser } from "@/hooks/useUser";

interface NavMenuClientProps {
  toggleDrawer?: () => void;
}

const NavMenuClient: React.FC<NavMenuClientProps> = ({ toggleDrawer }) => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={3}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  const navData = user ? protectedNavData : publicNavData;

  return <NavMenu navData={navData} toggleDrawer={toggleDrawer} />;
};

export default NavMenuClient;
