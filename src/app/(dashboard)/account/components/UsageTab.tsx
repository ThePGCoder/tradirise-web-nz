"use client";

import {
  Box,
  Typography,
  CardContent,
  LinearProgress,
  Grid,
  Alert,
  Chip,
  Stack,
  Divider,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";

interface SubscriptionPlans {
  id: string;
  name: string;
  display_name: string;
  max_businesses: number;
  max_photos: number;
  max_listings_per_month: number;
  features?: {
    max_ad_responses_per_month?: number;
  };
}

interface UsageData {
  businesses_used: number;
  photos_used: number;
  listings_used_this_month: number;
  ad_responses_used_this_month: number;
  listings_reset_date: string;
  ad_responses_reset_date: string;
  current_period_end: string;
  subscription_plans: SubscriptionPlans;
}

const UsageTab: React.FC = () => {
  const theme = useTheme();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/usage", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Please log in to view your usage");
        } else {
          setError("Failed to load usage data");
        }
        return;
      }

      const data = await response.json();
      setUsage(data.usage);
    } catch (err) {
      console.error("Error fetching usage:", err);
      setError("Failed to load usage data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  const calculatePercentage = (used: number, max: number) => {
    if (max === -1) return 0; // Unlimited
    return Math.min((used / max) * 100, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isUnlimited = (max: number) => max === -1;

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress size={100} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!usage) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No usage data available</Alert>
      </Box>
    );
  }

  const usageItems = [
    {
      label: "Businesses",
      used: usage.businesses_used,
      max: usage.subscription_plans.max_businesses,
      icon: "mdi:store",
      colorKey: "info",
      resetDate: null,
    },
    {
      label: "Work Photos",
      used: usage.photos_used,
      max: usage.subscription_plans.max_photos,
      icon: "mdi:image-multiple",
      colorKey: "primary",
      resetDate: null,
    },
    {
      label: "Listings This Month",
      used: usage.listings_used_this_month,
      max: usage.subscription_plans.max_listings_per_month,
      icon: "mdi:format-list-bulleted",
      colorKey: "success",
      resetDate: usage.listings_reset_date,
    },
    {
      label: "Ad Responses This Month",
      used: usage.ad_responses_used_this_month || 0,
      max: usage.subscription_plans.features?.max_ad_responses_per_month || 0,
      icon: "mdi:message-reply-text",
      colorKey: "warning",
      resetDate: usage.ad_responses_reset_date,
    },
  ];

  return (
    <Box sx={{ py: 3, userSelect: "none" }}>
      <Typography variant="h5" gutterBottom>
        Usage & Limits
      </Typography>

      <CustomCard sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Current Plan
            </Typography>
            <Chip
              label={usage.subscription_plans.display_name}
              color="primary"
            />
          </Box>

          <Stack spacing={1} divider={<Divider />}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Listings reset on
              </Typography>
              <Typography variant="body1">
                {formatDate(usage.listings_reset_date)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Ad responses reset on
              </Typography>
              <Typography variant="body1">
                {usage.ad_responses_reset_date
                  ? formatDate(usage.ad_responses_reset_date)
                  : formatDate(usage.listings_reset_date)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Current period ends
              </Typography>
              <Typography variant="body1">
                {formatDate(usage.current_period_end)}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CustomCard>

      <Grid container spacing={3}>
        {usageItems.map((item) => {
          const percentage = calculatePercentage(item.used, item.max);

          const unlimited = isUnlimited(item.max);
          const color =
            theme.palette[
              item.colorKey as "info" | "warning" | "success" | "primary"
            ].main;

          return (
            <Grid size={{ xs: 12, md: 6, lg: 3 }} key={item.label}>
              <CustomCard sx={{ height: "100%" }}>
                <CardContent
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        backgroundColor: `${color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                        userSelect: "none",
                      }}
                    >
                      <Box
                        sx={{
                          color: color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          userSelect: "none",
                        }}
                      >
                        <Icon icon={item.icon} width={24} height={24} />
                      </Box>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {item.label}
                      </Typography>
                      {item.resetDate && (
                        <Typography variant="caption" color="text.secondary">
                          Resets {formatDate(item.resetDate)}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {item.used}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ alignSelf: "flex-end" }}
                      >
                        {unlimited ? "/ Unlimited" : `/ ${item.max}`}
                      </Typography>
                    </Box>

                    {!unlimited && (
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        color={
                          item.colorKey as
                            | "primary"
                            | "secondary"
                            | "error"
                            | "info"
                            | "success"
                            | "warning"
                        }
                        sx={{ height: 18, borderRadius: 4 }}
                      />
                    )}
                  </Box>

                  {/* Fixed height container for alerts/chips to keep cards consistent */}
                  <Box sx={{ minHeight: 56, mt: "auto" }}>
                    {!unlimited && percentage >= 100 && (
                      <Alert severity="error">
                        Limit reached. Upgrade to continue.
                      </Alert>
                    )}

                    {!unlimited && percentage >= 90 && percentage < 100 && (
                      <Alert severity="warning">
                        You&#39;re approaching your limit!
                      </Alert>
                    )}

                    {unlimited && (
                      <Chip
                        label="Unlimited"
                        size="small"
                        color="success"
                        icon={<Icon icon="mdi:infinity" />}
                      />
                    )}
                  </Box>
                </CardContent>
              </CustomCard>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default UsageTab;
