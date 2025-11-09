import React from "react";
import Box, { BoxProps } from "@mui/material/Box";

export interface StackProps extends BoxProps {
  direction?: "row" | "column";
  align?: BoxProps["alignItems"];
  justify?: BoxProps["justifyContent"];
  spacing?: BoxProps["gap"];
}

const Stack = ({
  direction = "column",
  align = direction === "row" ? "center" : "stretch",
  justify = "flex-start",
  spacing = 0,
  children,
  ...rest
}: StackProps) => {
  return (
    <Box
      display="flex"
      flexDirection={direction}
      alignItems={align}
      justifyContent={justify}
      gap={spacing}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Stack;
