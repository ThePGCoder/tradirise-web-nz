// components/PricingSectionClient.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Chip,
  Stack,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { darkTheme, lightTheme } from "@/styles/theme";
import CustomCard from "@/components/CustomCard";
import { useThemeMode } from "@/hooks/useThemeMode";
import { grey } from "@mui/material/colors";
import { Center } from "@/components/Center";

const MotionBox = motion(Box);
const MotionCustomCard = motion(CustomCard);

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

interface PricingSectionClientProps {
  plans: SubscriptionPlan[];
  showTitle?: boolean;
  showDescription?: boolean;
  selectedPlan?: string;
  onPlanSelect?: (planName: string) => void;
}

export default function PricingSectionClient({
  plans,
  showTitle = true,
  showDescription = true,
  selectedPlan,
  onPlanSelect,
}: PricingSectionClientProps) {
  const { mode } = useThemeMode();
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const handlePlanClick = (planName: string) => {
    if (onPlanSelect) {
      onPlanSelect(planName);
    } else {
      router.push("/register");
    }
  };

  const getPrice = (plan: SubscriptionPlan) => {
    // Show $0 for Pro during promo period
    if (plan.name === "pro" && plan.promo_free_until) {
      const promoDate = new Date(plan.promo_free_until);
      const now = new Date();
      if (now <= promoDate) {
        return 0;
      }
    }

    return billingPeriod === "yearly"
      ? parseFloat(plan.price_yearly)
      : parseFloat(plan.price_monthly);
  };

  const getPeriod = () => (billingPeriod === "yearly" ? "year" : "month");

  const getSavings = (plan: SubscriptionPlan) => {
    if (billingPeriod !== "yearly" || parseFloat(plan.price_monthly) === 0)
      return null;
    const monthlyCost = parseFloat(plan.price_monthly) * 12;
    const savings = monthlyCost - parseFloat(plan.price_yearly);
    return savings > 1 ? Math.round(savings).toString() : null;
  };

  const isSelected = (planName: string) =>
    selectedPlan?.toLowerCase() === planName.toLowerCase();

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "free":
        return mode === "light"
          ? lightTheme.palette.info.main
          : darkTheme.palette.info.main;
      case "pro":
        return mode === "light"
          ? lightTheme.palette.primary.main
          : darkTheme.palette.primary.main;
      case "business":
        return mode === "light"
          ? lightTheme.palette.success.main
          : darkTheme.palette.success.main;
      default:
        return mode === "light"
          ? lightTheme.palette.grey[600]
          : darkTheme.palette.grey[400];
    }
  };

  const getButtonStyle = (
    planName: string,
    selected: boolean,
    popular: boolean
  ) => {
    const name = planName.toLowerCase();

    if (name === "free") {
      return {
        variant: "contained" as const,
        color: "info" as const,
      };
    } else if (name === "pro" || popular) {
      return {
        variant: "contained" as const,
        color: "primary" as const,
      };
    } else if (name === "business") {
      return {
        variant: "contained" as const,
        color: "success" as const,
      };
    }

    return {
      variant: "contained" as const,
      color: "info" as const,
    };
  };

  const getCardBorderStyle = (
    planName: string,
    selected: boolean,
    popular: boolean
  ) => {
    const name = planName.toLowerCase();

    if (name === "free") {
      return {
        border: `3px solid ${
          mode === "light"
            ? lightTheme.palette.info.main
            : darkTheme.palette.info.main
        }`,
      };
    } else if (name === "pro" || popular) {
      return {
        border: `3px solid ${
          mode === "light"
            ? lightTheme.palette.primary.main
            : darkTheme.palette.primary.main
        }`,
      };
    } else if (name === "business") {
      return {
        border: `3px solid ${
          mode === "light"
            ? lightTheme.palette.success.main
            : darkTheme.palette.success.main
        }`,
      };
    }

    return {
      border: "3px solid",
      borderColor: "divider",
    };
  };

  const getPlanFeatures = (plan: SubscriptionPlan) => {
    const features = [];
    const planName = plan.name.toLowerCase();

    // Businesses - handle max_businesses
    if (plan.max_businesses === -1) {
      features.push("Unlimited Businesses");
    } else if (plan.max_businesses > 1) {
      features.push(`Up to ${plan.max_businesses} Businesses`);
    } else if (plan.max_businesses === 1) {
      features.push("1 Business Listing");
    } else if (plan.max_businesses === 0) {
      // Free plan has 0 businesses
      features.push("Personal Tradie Profile");
    }

    // Photos
    if (plan.max_photos === -1) {
      features.push("Unlimited Photos");
    } else if (plan.max_photos > 0) {
      features.push(`Up to ${plan.max_photos} Photos`);
    }

    // Listings
    if (plan.max_listings_per_month === -1) {
      features.push("Unlimited Active Listings");
    } else if (plan.max_listings_per_month === 1) {
      features.push("1 Active Listing");
    } else if (plan.max_listings_per_month > 1) {
      features.push(`Up to ${plan.max_listings_per_month} Active Listings`);
    }

    // Ad Responses - NEW
    const maxAdResponses = plan.features?.max_ad_responses_per_month;
    if (maxAdResponses === -1) {
      features.push("Unlimited Ad Responses");
    } else if (maxAdResponses === 1) {
      features.push("1 Ad Response/Month");
    } else if (maxAdResponses && maxAdResponses > 1) {
      features.push(`${maxAdResponses} Ad Responses/Month`);
    }

    // Business profile type - use allows_business_listing from database
    if (plan.max_businesses > 0) {
      if (planName === "business") {
        features.push("Specialized Business Profile");
      } else {
        features.push("Business Profile");
      }
    }

    // Reviews - use allows_reviews from database
    if (plan.allows_reviews) {
      features.push("Reviews & Ratings");
    }

    // Featured listings - use allows_featured from database
    if (plan.allows_featured) {
      features.push("Featured Listings");
    }

    // Team members - use max_team_members from database
    if (plan.max_team_members && plan.max_team_members > 1) {
      features.push(`Up to ${plan.max_team_members} Team Members`);
    }

    // Always include from features object
    if (plan.features?.unlimited_project_posts) {
      features.push("Unlimited Project Posts");
    }

    // Remove this old one since we're now showing specific ad response limits
    // if (plan.features?.can_respond_to_everything) {
    //   features.push("Respond to All Advertisements");
    // }

    return features;
  };

  // Handle empty plans
  if (!plans || plans.length === 0) {
    return (
      <Box sx={{ pt: 3, pb: 10 }}>
        <Container>
          <Box textAlign="center">
            <Typography variant="h4" fontWeight="bold" mb={2}>
              Pricing Plans
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Loading plans...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 3, pb: 10 }}>
      <Container>
        {showTitle && (
          <MotionBox
            textAlign="center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              mb={3}
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
                userSelect: "none",
              }}
            >
              Simple, Transparent Pricing
            </Typography>
            {showDescription && (
              <>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "success.main", fontWeight: "bold" }}
                >
                  🎉 Pro is FREE until December 31, 2025!
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Start building your business profile today at no cost.
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 6 }}
                >
                  No credit card required • Upgrade anytime • Cancel anytime
                </Typography>
              </>
            )}
          </MotionBox>
        )}

        {/* Billing Toggle */}
        <MotionBox
          display="flex"
          justifyContent="center"
          sx={{ mb: 6 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <FormControl>
            <RadioGroup
              row
              value={billingPeriod}
              onChange={(e) =>
                setBillingPeriod(e.target.value as "monthly" | "yearly")
              }
              sx={{
                justifyContent: "center",
                gap: 3,
              }}
            >
              <FormControlLabel
                value="monthly"
                control={<Radio />}
                label="Monthly"
              />
              <FormControlLabel
                value="yearly"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center">
                    Yearly
                    <Chip
                      label="Save 17%"
                      size="small"
                      color="success"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </MotionBox>

        {/* Pricing Cards */}
        <Center>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", lg: "repeat(3, 1fr)" }}
            gap={8}
          >
            {plans.map((plan, idx) => {
              const savings = getSavings(plan);
              const popular = plan.name.toLowerCase() === "pro";
              const selected = isSelected(plan.name);
              const planColor = getPlanColor(plan.name);
              const features = getPlanFeatures(plan);
              const displayPrice = getPrice(plan);
              const isPromo = plan.name === "pro" && displayPrice === 0;
              const buttonStyle = getButtonStyle(plan.name, selected, popular);
              const borderStyle = getCardBorderStyle(
                plan.name,
                selected,
                popular
              );

              return (
                <MotionCustomCard
                  key={plan.id}
                  initial={{ opacity: 0, y: 30, scale: 1 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{
                    scale: selected ? 1.04 : 1.03,
                  }}
                  transition={{
                    delay: idx * 0.2,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  sx={{
                    scale: popular ? "1.06" : "1",
                    textAlign: "center",
                    p: 3,
                    pt: popular || selected ? 5 : 3,
                    ...borderStyle,
                    backgroundImage:
                      mode === "light"
                        ? "linear-gradient(135deg, #ffffff, #f8fafc)"
                        : `linear-gradient(${grey[800]}, ${grey[900]})`,
                    transition: "box-shadow 0.3s ease",
                    overflow: "visible",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    "&:hover": {
                      boxShadow: 6,
                    },
                    maxWidth: 600,
                  }}
                >
                  {popular && !selected && (
                    <Chip
                      label="Most Popular"
                      sx={{
                        position: "absolute",
                        top: -16,
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontWeight: "bold",
                        zIndex: 1,
                        fontSize: "0.875rem",
                        height: 32,
                        userSelect: "none",
                        backgroundImage:
                          mode === "light"
                            ? `linear-gradient(to bottom, #ed6c02 30%, #e65100 90%)`
                            : `linear-gradient(to bottom, #ffb74d 30%, #ffa726 90%)`,
                        color: mode === "light" ? "white" : "#0d1720",
                      }}
                    />
                  )}

                  {selected && (
                    <Chip
                      label="Current Plan"
                      sx={{
                        position: "absolute",
                        top: -16,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundImage:
                          plan.name === "free"
                            ? mode === "light"
                              ? `linear-gradient(to bottom, #42a5f5 30%, #1e88e5 90%)`
                              : `linear-gradient(to bottom, #90caf9 30%, #64b5f6 90%)`
                            : plan.name === "pro"
                              ? mode === "light"
                                ? `linear-gradient(to bottom, #ed6c02 30%, #e65100 90%)`
                                : `linear-gradient(to bottom, #ffb74d 30%, #ffa726 90%)`
                              : mode === "light"
                                ? `linear-gradient(to bottom, #66bb6a 30%, #43a047 90%)`
                                : `linear-gradient(to bottom, #a5d6a7 30%, #81c784 90%)`,
                        color: mode === "light" ? "white" : "#0d1720",
                        fontWeight: "bold",
                        zIndex: 1,
                        fontSize: "0.875rem",
                        height: 32,
                        userSelect: "none",
                      }}
                    />
                  )}

                  {/* Card Content */}
                  <Box
                    sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                  >
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ userSelect: "none" }}
                    >
                      {plan.display_name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        minHeight: 40,
                        fontFamily: "var(--font-caveat)",
                        fontSize: "1.5rem",
                        fontWeight: 500,
                        userSelect: "none",
                      }}
                    >
                      {plan.name.toLowerCase() === "free" &&
                        '"Perfect for homeowners and those new to the trade"'}
                      {plan.name.toLowerCase() === "pro" &&
                        '"Ideal for trade professionals growing their business"'}
                      {plan.name.toLowerCase() === "business" &&
                        '"Built for franchises and multi-office operations"'}
                    </Typography>

                    <Box sx={{ mb: 2, userSelect: "none" }}>
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        component="span"
                      >
                        ${displayPrice}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        component="span"
                      >
                        /{getPeriod()}
                      </Typography>
                      {isPromo && (
                        <Typography
                          variant="caption"
                          display="block"
                          color="primary"
                          fontWeight="bold"
                          sx={{ mt: 0.5 }}
                        >
                          Then $
                          {billingPeriod === "yearly"
                            ? plan.price_yearly
                            : plan.price_monthly}
                          /{billingPeriod === "yearly" ? "year" : "month"}
                        </Typography>
                      )}
                    </Box>

                    {isPromo && (
                      <Chip
                        label="FREE until Dec 31, 2025"
                        size="small"
                        color="error"
                        sx={{ mb: 2, fontWeight: "bold", userSelect: "none" }}
                      />
                    )}

                    {savings && (
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            plan.name === "pro"
                              ? "warning.main"
                              : selected
                                ? planColor
                                : "success.main",
                          fontWeight: "bold",
                          mb: 2,
                          userSelect: "none",
                        }}
                      >
                        Save ${savings}/year
                      </Typography>
                    )}

                    <Stack spacing={1.5} sx={{ mb: 4, flex: 1 }}>
                      {features.map((feature, i) => {
                        // Check if this is the team members feature
                        const isTeamMembers = feature.includes("Team Members");

                        return (
                          <Box
                            key={i}
                            display="flex"
                            alignItems="flex-start"
                            justifyContent="flex-start"
                            sx={{ textAlign: "left" }}
                          >
                            <Icon
                              icon="mdi:check-circle"
                              style={{
                                color: planColor,
                                marginRight: 12,
                                marginTop: 2,
                                flexShrink: 0,
                                userSelect: "none",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ lineHeight: 1.6, userSelect: "none" }}
                            >
                              {feature}
                            </Typography>
                            {isTeamMembers && (
                              <Chip
                                label="Coming Soon"
                                size="small"
                                color="warning"
                                sx={{
                                  ml: 1,
                                  height: 20,
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                  userSelect: "none",
                                }}
                              />
                            )}
                          </Box>
                        );
                      })}
                    </Stack>

                    <Button
                      variant={buttonStyle.variant}
                      color={buttonStyle.color}
                      fullWidth
                      size="large"
                      onClick={() => handlePlanClick(plan.name)}
                    >
                      {selected
                        ? "Current Plan"
                        : displayPrice === 0
                          ? "Get Started Free"
                          : "Choose Plan"}
                    </Button>
                  </Box>
                </MotionCustomCard>
              );
            })}
          </Box>
        </Center>
      </Container>
    </Box>
  );
}
