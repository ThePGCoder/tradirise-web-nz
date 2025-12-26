// app/components/CountrySwitcher.tsx
"use client";

import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import Image from "next/image";
import { useThemeMode } from "@/hooks/useThemeMode";

const CountrySwitcher: React.FC = () => {
  const { mode } = useThemeMode();
  const [currentCountry, setCurrentCountry] = React.useState<"nz" | "au">("nz");

  React.useEffect(() => {
    // Detect current site based on hostname
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname.includes(".com.au")) {
        setCurrentCountry("au");
      } else {
        setCurrentCountry("nz");
      }
    }
  }, []);

  const handleSwitch = () => {
    const newCountry = currentCountry === "nz" ? "au" : "nz";
    const newUrl =
      newCountry === "au"
        ? "https://tradirise.com.au"
        : "https://tradirise.co.nz";
    window.location.href = newUrl;
  };

  const otherCountry = currentCountry === "nz" ? "au" : "nz";
  const otherCountryName =
    currentCountry === "nz" ? "Australia" : "New Zealand";
  const otherFlagImage = currentCountry === "nz" ? "/au-06.png" : "/nz-06.png";

  return (
    <Tooltip title={`Switch to ${otherCountryName}`} arrow>
      <IconButton
        onClick={handleSwitch}
        sx={{
          position: "relative",
          width: 40,
          height: 40,
          padding: 0.5,
          borderRadius: "50%",
          border:
            mode === "light"
              ? "2px solid rgba(0,0,0,0.1)"
              : "2px solid rgba(255,255,255,0.2)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
            border:
              mode === "light"
                ? "2px solid rgba(0,0,0,0.3)"
                : "2px solid rgba(255,255,255,0.4)",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <Image
            src={otherFlagImage}
            alt={`Switch to ${otherCountryName}`}
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </Box>
      </IconButton>
    </Tooltip>
  );
};

export default CountrySwitcher;
