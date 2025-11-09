import React from "react";
import Box, { BoxProps } from "@mui/material/Box";

export interface VStackProps extends BoxProps {
  align?: BoxProps["alignItems"];
  justify?: BoxProps["justifyContent"];
  spacing?: number | string;
}

const VStack = ({
  align = "center", // Chakra UI VStack default
  justify = "flex-start",
  spacing = 1, // Roughly 1rem (Chakra default)
  children,
  ...rest
}: VStackProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems={align}
      justifyContent={justify}
      gap={spacing}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default VStack;
