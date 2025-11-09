import { Icon, IconifyIcon } from "@iconify/react";
import { Box, BoxProps } from "@mui/material";

interface IconifyProps extends BoxProps {
  icon: IconifyIcon | string;
  width?: number | string;
  height?: number | string;
}

export default function Iconify({
  icon,
  width = 20,
  sx,
  ...other
}: IconifyProps) {
  return (
    <Box
      component={Icon}
      icon={icon}
      sx={{ width, height: width, ...sx }}
      {...other}
    />
  );
}
