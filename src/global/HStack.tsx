import React from "react";
import Box, { BoxProps } from "@mui/material/Box";

export interface HStackProps extends BoxProps {
  align?: BoxProps["alignItems"];
  justify?: BoxProps["justifyContent"];
  spacing?: BoxProps["gap"];
}

const HStack = ({
  align = "center",
  justify = "flex-start",
  spacing = 0,
  children,
  ...rest
}: HStackProps) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems={align}
      justifyContent={justify}
      gap={spacing}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default HStack;
