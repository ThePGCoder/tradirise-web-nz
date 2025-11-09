"use client";

import { Box, BoxProps } from "@mui/material";
import React from "react";

const Middle = ({ children, ...props }: BoxProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      {...props}
      height="100vh"
    >
      {children}
    </Box>
  );
};

export default Middle;
