import { Typography, TypographyProps } from "@mui/material";
import React from "react";

interface SloganProps {
  fontSize: TypographyProps["fontSize"];
}

const Slogan: React.FC<SloganProps> = ({ fontSize }) => {
  return (
    <>
      <Typography
        fontFamily="inter"
        fontSize={fontSize}
        textAlign="center"
        alignItems="center"
        fontWeight="bold"
      >
        &#34;Find Work. Hire Talent. Post Jobs. Get Seen.&#34;
      </Typography>
    </>
  );
};

export default Slogan;
