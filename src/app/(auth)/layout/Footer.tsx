import { Box } from "@mui/material";
import { blue } from "@mui/material/colors";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <>
      <Box
        position="fixed"
        bgcolor="transparent" // A very subtle white with low opacity
        bottom={0}
        display="flex"
        width="100%"
        justifyContent="center"
        alignItems="center"
        height="50px"
        sx={{
          backdropFilter: "blur(10px)", // Apply the blur effect here
          WebkitBackdropFilter: "blur(10px)", // For Safari compatibility
          borderTop: "1px solid rgba(255, 255, 255, 0.18)", // Optional: subtle border for glass effect
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)", // Optional: subtle shadow for depth
        }}
      >
        <Box display="flex" fontSize="0.8rem">
          <Box color={blue[500]}>&nbsp;&#123;</Box>
          <Box fontStyle="italic" fontFamily="corinthia">
            the
          </Box>
          <Box fontWeight="bold" fontFamily="poppins">
            PGCoder
          </Box>
          <Box color={blue[500]}>...&#125;</Box>
        </Box>
      </Box>
    </>
  );
};

export default Footer;
