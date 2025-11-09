import React from "react";
import Box, { BoxProps } from "@mui/material/Box";

export interface FlexProps extends BoxProps {
  direction?: BoxProps["flexDirection"];
  justify?: BoxProps["justifyContent"];
  align?: BoxProps["alignItems"];
  wrap?: BoxProps["flexWrap"];
  gap?: BoxProps["gap"];
}

const Flex = ({
  direction = "row",
  justify = "flex-start",
  align = "stretch",
  wrap = "nowrap",
  gap,
  children,
  ...rest
}: FlexProps) => {
  return (
    <Box
      display="flex"
      flexDirection={direction}
      justifyContent={justify}
      alignItems={align}
      flexWrap={wrap}
      gap={gap}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Flex;
