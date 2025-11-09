"use client";

import {
  Box,
  Typography,
  Button,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";

interface SubscriptionPlans {
  id: string;
  name: string;
  display_name: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
}

interface UserSubscription {
  id: string;
  plan_id: string;
  status: string;
  billing_period: "monthly" | "yearly";
  current_period_end: string;
  cancel_at_period_end: boolean;
  subscription_plans: SubscriptionPlans;
}

type ChipColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "default";

const SettingsTab: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchCurrentSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/subscription", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Please log in to view subscription details");
        } else {
          setError("Failed to fetch subscription details");
        }
        return;
      }

      const data = await response.json();
      setCurrentPlan(data.subscription);
    } catch (err) {
      console.error("Error fetching subscription:", err);
      setError("Failed to load subscription details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentSubscription();
  }, []);

  const handleCancelSubscription = async () => {
    if (!currentPlan) {
      setError("No active subscription found");
      return;
    }

    setCanceling(true);
    setError(null);

    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: currentPlan.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      setCurrentPlan((prev) =>
        prev
          ? {
              ...prev,
              cancel_at_period_end: true,
            }
          : null
      );

      setSuccess(
        "Subscription will be canceled at the end of your billing period"
      );
      setCancelDialogOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel subscription"
      );
    } finally {
      setCanceling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (
    status: string,
    cancelAtPeriodEnd: boolean
  ): ChipColor => {
    if (cancelAtPeriodEnd) return "warning";
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "canceled":
        return "error";
      case "past_due":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string, cancelAtPeriodEnd: boolean) => {
    if (cancelAtPeriodEnd) return "Canceling";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

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

  return (
    <Box py={3}>
      <Typography variant="h6" gutterBottom sx={{ userSelect: "none" }}>
        Subscription Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      {currentPlan ? (
        <CustomCard>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
              <Chip
                label={currentPlan.subscription_plans.display_name}
                color="primary"
                variant="filled"
                sx={{ userSelect: "none" }}
              />
              <Chip
                label={getStatusText(
                  currentPlan.status,
                  currentPlan.cancel_at_period_end
                )}
                color={getStatusColor(
                  currentPlan.status,
                  currentPlan.cancel_at_period_end
                )}
                sx={{ userSelect: "none" }}
              />
            </Box>

            <Stack spacing={2}>
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ userSelect: "none" }}
                >
                  Billing Period
                </Typography>
                <Typography variant="body1" sx={{ userSelect: "none" }}>
                  {currentPlan.billing_period === "monthly"
                    ? "Monthly"
                    : "Yearly"}{" "}
                  billing
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ userSelect: "none" }}
                >
                  Price
                </Typography>
                <Typography variant="body1" sx={{ userSelect: "none" }}>
                  $
                  {currentPlan.billing_period === "monthly"
                    ? currentPlan.subscription_plans.price_monthly
                    : currentPlan.subscription_plans.price_yearly}{" "}
                  {currentPlan.subscription_plans.currency}/
                  {currentPlan.billing_period === "monthly" ? "month" : "year"}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ userSelect: "none" }}
                >
                  {currentPlan.cancel_at_period_end
                    ? "Valid until"
                    : "Next billing date"}
                </Typography>
                <Typography variant="body1" sx={{ userSelect: "none" }}>
                  {formatDate(currentPlan.current_period_end)}
                </Typography>
              </Box>

              {currentPlan.cancel_at_period_end && (
                <Alert severity="info" sx={{ userSelect: "none" }}>
                  Your subscription is scheduled to cancel on{" "}
                  {formatDate(currentPlan.current_period_end)}. You&#39;ll
                  continue to have access until then.
                </Alert>
              )}
            </Stack>

            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              {!currentPlan.cancel_at_period_end && (
                <Button
                  variant="text"
                  color="error"
                  startIcon={<Icon icon="mdi:cancel" />}
                  onClick={() => setCancelDialogOpen(true)}
                  sx={{ userSelect: "none" }}
                >
                  Cancel Subscription
                </Button>
              )}

              <Button
                variant="text"
                startIcon={<Icon icon="mdi:refresh" />}
                onClick={fetchCurrentSubscription}
                sx={{ userSelect: "none" }}
              >
                Refresh
              </Button>
            </Box>
          </CardContent>
        </CustomCard>
      ) : (
        <CustomCard>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Icon
              icon="mdi:information-outline"
              width={48}
              height={48}
              color="text.secondary"
            />
            <Typography variant="h6" sx={{ mt: 2, mb: 1, userSelect: "none" }}>
              No Active Subscription
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ userSelect: "none" }}
            >
              You don&#39;t have an active subscription. Visit the Plans tab to
              choose a plan.
            </Typography>
          </CardContent>
        </CustomCard>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => !canceling && setCancelDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              userSelect: "none",
            }}
          >
            <Icon icon="mdi:alert-circle-outline" color="error" />
            Cancel Subscription
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2, userSelect: "none" }}>
            Are you sure you want to cancel your subscription?
          </Typography>
          <Alert severity="warning" sx={{ mb: 2, userSelect: "none" }}>
            Your subscription will remain active until{" "}
            {currentPlan && formatDate(currentPlan.current_period_end)}. After
            that, you&#39;ll lose access to premium features.
          </Alert>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ userSelect: "none" }}
          >
            You can reactivate your subscription at any time before the
            cancellation date.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            disabled={canceling}
            sx={{ userSelect: "none" }}
          >
            Keep Subscription
          </Button>
          <Button
            onClick={handleCancelSubscription}
            color="error"
            variant="text"
            disabled={canceling}
            startIcon={
              canceling ? (
                <Icon icon="mdi:loading" className="animate-spin" />
              ) : (
                <Icon icon="mdi:cancel" />
              )
            }
            sx={{ userSelect: "none" }}
          >
            {canceling ? "Canceling..." : "Cancel Subscription"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsTab;
