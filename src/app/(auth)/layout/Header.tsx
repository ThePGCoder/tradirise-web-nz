"use client";

import ThemeToggle from "@/app/(dashboard)/layout/ThemeToggle";
import { Box } from "@mui/material";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <>
      <Box
        position="fixed"
        top={0}
        height="50px"
        display="flex"
        width="100%"
        justifyContent="flex-end"
        px={1}
        zIndex={100}
      >
        <ThemeToggle />
      </Box>
    </>
  );
};

export default Header;
