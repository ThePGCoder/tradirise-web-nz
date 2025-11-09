import { Box } from "@mui/material";
import { blue } from "@mui/material/colors";
import React from "react";

interface FooterProps {
  offset: boolean;
}

const Footer: React.FC<FooterProps> = ({ offset }) => {
  return (
    <>
      <Box
        position="fixed"
        bgcolor="transparent"
        bottom={0}
        display="flex"
        width={{
          xs: "100%",
          sm: "100%",
          md: offset ? "calc(100% - 320px)" : "100%",
        }}
        justifyContent="center"
        alignItems="center"
        height="50px"
        marginLeft={{ xs: "none", sm: "none", md: offset ? "320px" : "" }}
        sx={{
          backdropFilter: "blur(2px)", // Apply the blur effect here
          WebkitBackdropFilter: "blur(2px)", // For Safari compatibility
          borderTop: "1px solid rgba(255, 255, 255, 0.18)", // Optional: subtle border for glass effect
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)", // Optional: subtle shadow for depth
        }}
      >
        <Box display="flex" fontSize="0.8rem">
          <Box color={blue[500]}>&nbsp;&#123;</Box>
          <Box fontStyle="italic" fontFamily="corinthia">
            the
          </Box>
          <Box fontWeight="bold">PGCoder</Box>
          <Box color={blue[500]}>...&#125;</Box>
        </Box>
      </Box>
    </>
  );
};

export default Footer;
