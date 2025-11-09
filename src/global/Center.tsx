import React from "react";
import Box, { BoxProps } from "@mui/material/Box";

export type CenterProps = BoxProps;

const Center = ({ children, ...rest }: CenterProps) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" {...rest}>
      {children}
    </Box>
  );
};

export default Center;
