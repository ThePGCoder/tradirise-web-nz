// app/components/CountrySwitcher.tsx
"use client";

import React, { useState, useEffect } from "react";
import { IconButton, Tooltip, Button } from "@mui/material";
import { Icon } from "@iconify/react";

interface CountrySwitcherProps {
  variant?: "icon" | "button";
  onSwitch?: () => void;
}

const CountrySwitcher = ({
  variant = "icon",
  onSwitch,
}: CountrySwitcherProps) => {
  const [currentCountry, setCurrentCountry] = useState<"nz" | "au">("nz");

  useEffect(() => {
    // Detect current site based on hostname
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;

      // Check for production domains
      if (hostname.includes(".com.au")) {
        setCurrentCountry("au");
      } else if (hostname.includes(".co.nz")) {
        setCurrentCountry("nz");
      } else {
        // Default to NZ for localhost and other domains
        setCurrentCountry("nz");
      }
    }
  }, []);

  const handleCountrySwitch = () => {
    const hostname = window.location.hostname;

    // If on localhost, just toggle the state for testing
    if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
      setCurrentCountry(currentCountry === "nz" ? "au" : "nz");
      // Store this in localStorage to persist the choice
      localStorage.setItem(
        "selectedCountry",
        currentCountry === "nz" ? "au" : "nz"
      );
    } else {
      // Production behavior - redirect to other domain
      const newCountry = currentCountry === "nz" ? "au" : "nz";
      const newUrl =
        newCountry === "au"
          ? "https://tradirise.com.au"
          : "https://tradirise.co.nz";
      window.location.href = newUrl;
    }

    // Call optional callback
    if (onSwitch) {
      onSwitch();
    }
  };

  // Current country (what user is on)
  const currentCountryName =
    currentCountry === "nz" ? "New Zealand" : "Australia";
  const currentFlagIcon =
    currentCountry === "nz" ? "circle-flags:nz" : "circle-flags:au";

  // Other country (what they can switch to)
  const otherCountryName =
    currentCountry === "nz" ? "Australia" : "New Zealand";

  if (variant === "button") {
    return (
      <Button
        fullWidth
        variant="outlined"
        onClick={handleCountrySwitch}
        startIcon={<Icon icon={currentFlagIcon} width={24} height={24} />}
        sx={{
          justifyContent: "flex-start",
          py: 1.5,
          borderRadius: 1,
          textTransform: "none",
          fontWeight: 500,
        }}
      >
        {currentCountryName} - Switch to {otherCountryName}
      </Button>
    );
  }

  return (
    <Tooltip title={`Switch to ${otherCountryName}`} arrow>
      <IconButton onClick={handleCountrySwitch}>
        <Icon icon={currentFlagIcon} />
      </IconButton>
    </Tooltip>
  );
};

export default CountrySwitcher;
