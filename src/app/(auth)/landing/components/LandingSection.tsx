// app/components/LandingSection.tsx
"use client";

import React from "react";
import { Box, Stack } from "@mui/material";
import { blue, grey } from "@mui/material/colors";

import ImageCrossfade from "@/components/ImageCrossfade";
import B2BValueSection from "./B2BValueSection";
import PricingSectionClient from "@/components/pricing-section/components/PricingSectionClient";
import LandingHero from "./LandingHero";
import LandingNavigation from "./LandingNavigation";
import { useThemeMode } from "@/hooks/useThemeMode";
import AboutSection from "./AboutSection";
import ComparisonChart from "./ComparisonChart";
import ComparisonFeatures from "./Comparison Features";

// Define background images
const BACKGROUND_IMAGES = ["/site.png", "/site2.png", "/site3.png"];

// Import the type from PricingSection
interface SubscriptionPlan {
  id: string;
  name: string;
  display_name: string;
  price_monthly: string;
  price_yearly: string;
  currency: string;
  max_businesses: number;
  max_photos: number;
  max_listings_per_month: number;
  promo_free_until?: string;
  allows_business_listing: boolean;
  allows_reviews: boolean;
  allows_featured: boolean;
  max_team_members?: number;
  features?: {
    business_listing: boolean;
    reviews: boolean;
    featured_listings: boolean;
    portfolio_showcase: boolean;
    analytics: boolean;
    unlimited_projects: boolean;
    unlimited_project_posts: boolean;
    can_respond_to_everything: boolean;
    can_respond?: boolean;
    promo_message?: string;
    multi_user?: boolean;
    priority_support?: boolean;
    max_ad_responses_per_month?: number;
  };
}

interface LandingSectionProps {
  plans: SubscriptionPlan[];
}

export default function LandingSection({ plans }: LandingSectionProps) {
  const { mode } = useThemeMode();
  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* Navigation */}
      <LandingNavigation />

      {/* Solid Background for fade transition */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          minHeight: "100vh",
          zIndex: -3,
          background: mode === "light" ? "#ffffff" : grey[900],
          pointerEvents: "none",
        }}
      />

      {/* Radial Gradient Overlay - starts after images fade */}
      <Box
        sx={{
          position: "absolute",
          top: "700px",
          left: 0,
          width: "100%",
          height: "calc(100% - 700px)",
          minHeight: "calc(100vh - 700px)",
          zIndex: -2,
          background:
            mode === "light"
              ? `radial-gradient(circle, #E2E8F0 33%, #ffffff 66%)`
              : `radial-gradient(circle, #323232 33%, ${grey[900]} 66%)`,
          pointerEvents: "none",
        }}
      />

      {/* Hero Section with Background */}
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Background Image with Gradient Fade */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "700px",
            zIndex: -1,
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "200px",
              background: () =>
                mode === "light"
                  ? `linear-gradient(to bottom, transparent, white)`
                  : `linear-gradient(to bottom, transparent, ${grey[900]})`,
              pointerEvents: "none",
            },
          }}
        >
          <ImageCrossfade
            images={BACKGROUND_IMAGES}
            interval={6000}
            duration={1.5}
            alt="Trade background"
            objectFit="cover"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0.3,
            }}
          />
        </Box>

        {/* Hero Content */}
        <Box sx={{ width: "100%" }}>
          <LandingHero />
        </Box>
      </Box>

      {/* Rest of the page with solid background */}
      <Stack sx={{ position: "relative", zIndex: 1, gap: 10 }}>
        {/* About Section - What We Do/Don't Do */}
        <AboutSection />

        {/* B2B Value Proposition Section */}
        <B2BValueSection />

        {/* Comparison Chart */}
        <ComparisonChart />

        {/* Comparison Features */}
        <ComparisonFeatures />

        {/* Pricing Section */}
        <Box id="pricing-section">
          <PricingSectionClient plans={plans} />
        </Box>
      </Stack>

      {/* Footer */}
      <Box
        bgcolor="transparent"
        bottom={0}
        display="flex"
        width="100%"
        justifyContent="center"
        alignItems="center"
        height="50px"
        sx={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        }}
      >
        <Stack textAlign="center">
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
          <Box fontSize="0.6rem">2025©</Box>
        </Stack>
      </Box>
    </Box>
  );
}
