"use client";

import { Box, Typography } from "@mui/material";
import React from "react";
import { Icon } from "@iconify/react";
import { orange } from "@mui/material/colors";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useFontLoaded } from "@/hooks/useFontLoaded";
import { motion } from "framer-motion";
import Center from "@/global/Center";
import Flex from "@/global/Flex";

interface LogoProps {
  fontSize:
    | string
    | number
    | {
        xs?: string | number;
        sm?: string | number;
        md?: string | number;
        lg?: string | number;
        xl?: string | number;
      };

  showCountry?: boolean;
  countryName?: string;
  countryFlag?: string;
  countryFontSize?:
    | string
    | number
    | {
        xs?: string | number;
        sm?: string | number;
        md?: string | number;
        lg?: string | number;
        xl?: string | number;
      };
  countryLetterSpacing?: string | number;
  countryIconSize?:
    | string
    | number
    | {
        xs?: string | number;
        sm?: string | number;
        md?: string | number;
        lg?: string | number;
        xl?: string | number;
      };
}

const Logo: React.FC<LogoProps> = ({
  fontSize,

  showCountry = false,
  countryName = "NEW ZEALAND",
  countryFlag = "circle-flags:nz",
  countryFontSize = "0.5rem",
  countryLetterSpacing = 3,
  countryIconSize = "1em",
}) => {
  const { mode } = useThemeMode();
  const fontReady = useFontLoaded("Bowlby One");

  // Helper function to get height estimate for skeleton
  const getHeightEstimate = () => {
    if (typeof fontSize === "number") return `${fontSize}px`;
    if (typeof fontSize === "string") return fontSize;

    // For responsive objects, use the largest value or fallback
    if (typeof fontSize === "object") {
      const sizes = Object.values(fontSize).filter(Boolean);
      if (sizes.length > 0) {
        const maxSize = Math.max(
          ...sizes.map((s) =>
            typeof s === "number" ? s : parseInt(s as string) || 0
          )
        );
        return `${maxSize}px`;
      }
    }

    return "42px"; // fallback
  };

  const heightEstimate = getHeightEstimate();

  if (!fontReady) {
    return (
      <Box
        sx={{
          height: heightEstimate,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Optional: Add skeleton shimmer or neutral placeholder */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: 2,
          }}
        />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/*<Center>
        <Box
          fontFamily="Corinthia"
          color={mode === "light" ? "black" : "white"}
        >
          <Typography fontSize={40} fontFamily="Corinthia">
            the
          </Typography>
        </Box>
      </Center>*/}
      <Box
        display="flex"
        alignItems="center"
        fontSize={fontSize}
        lineHeight={1}
        fontFamily="Bowlby One, sans-serif"
        sx={{
          overflow: "visible",
        }}
      >
        <Box color={mode === "light" ? "black" : "white"}>TRADI</Box>
        <Box color={mode === "light" ? orange[800] : orange[300]}>RISE</Box>
        <Box
          sx={{
            fontSize: fontSize,
            display: "flex",
            alignItems: "center",
            marginTop: "-0.1em", // Small negative margin to nudge it up slightly
          }}
          color="primary.main"
        >
          <Icon
            icon="fa7-solid:earth-oceania"
            style={{
              height: "1em",
            }}
          />
        </Box>
      </Box>
      {showCountry && (
        <Center pt={1}>
          <Flex alignItems="center">
            <Typography
              letterSpacing={countryLetterSpacing}
              fontWeight={500}
              sx={{
                fontSize: countryFontSize,
              }}
            >
              {countryName}
            </Typography>
            <Box
              sx={{
                fontSize: countryIconSize,
                display: "flex",
                alignItems: "center",
                marginLeft: "4px",
              }}
            >
              <Icon
                icon={countryFlag}
                style={{
                  fontSize: "1em",
                  height: "1em",
                  width: "1em",
                }}
              />
            </Box>
          </Flex>
        </Center>
      )}
    </motion.div>
  );
};

export default Logo;
