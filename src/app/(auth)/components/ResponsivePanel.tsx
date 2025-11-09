// app/(auth)/login/LoginContent.tsx
"use client";

import React, { ReactNode } from "react";
import { Box } from "@mui/material";

import CustomCard from "@/components/CustomCard";

interface ResponsivePanelProps {
  children: ReactNode;
}

const ResponsivePanel: React.FC<ResponsivePanelProps> = ({ children }) => {
  const desktopImage = "/site.jpg";
  return (
    <>
      <CustomCard
        sx={{
          width: { xs: 350, sm: 350, md: 700 },
          p: 0,
          height: { xs: "auto", md: "50vh" },
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          height="100%"
        >
          {/* desktop-only static image */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              flex: 1,
              backgroundImage: `url(${desktopImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* form pane */}
          <Box
            sx={{
              flex: 1,
              px: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {children}
          </Box>
        </Box>
      </CustomCard>
    </>
  );
};

export default ResponsivePanel;
