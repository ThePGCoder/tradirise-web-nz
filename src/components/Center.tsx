import React from "react";
import { Box, BoxProps } from "@mui/material";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CenterProps extends BoxProps {}

export const Center: React.FC<CenterProps> = ({ children, sx, ...rest }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...sx,
    }}
    {...rest}
  >
    {children}
  </Box>
);
