// src/app/(dashboard)/layout/LayoutClient.tsx
"use client";

import Header from "@/app/(dashboard)/layout/Header";
import Sidebar from "@/app/(dashboard)/layout/Sidebar";
import CustomDrawer from "@/app/(dashboard)/layout/Drawer";
import { Box } from "@mui/material";
import React, { ReactNode, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";

import { useToggle } from "@/hooks/useToggle";
import { getRouteNameFromPathname } from "@/utils/routeMapping";
import { ActiveRouteContext } from "@/providers/ActiveRouteProvider";

interface LayoutClientProps {
  children: ReactNode;
}

const LayoutClient: React.FC<LayoutClientProps> = ({ children }) => {
  const drawer = useToggle();
  const pathname = usePathname();
  const { changeActiveRoute } = useContext(ActiveRouteContext);

  // Automatically detect and set active route based on pathname
  useEffect(() => {
    const routeName = getRouteNameFromPathname(pathname, true);
    changeActiveRoute(routeName);
  }, [pathname, changeActiveRoute]);

  return (
    <Box>
      <Header toggleDrawer={drawer.toggleOpen} />
      <CustomDrawer drawer={drawer} />
      <Sidebar />

      <Box
        marginLeft={{ xs: "none", sm: "none", md: "320px" }}
        sx={{
          transition: "margin-left 0.2s ease",
          pt: "18px",
        }}
      >
        <Box margin="auto" width="100%" maxWidth={1400} px={2} pt={3}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutClient;
