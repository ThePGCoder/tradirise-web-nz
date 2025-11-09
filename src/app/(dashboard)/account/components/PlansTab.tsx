"use client";

import {
  Box,
  Typography,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";
import PricingSection from "@/components/PricingSection";

interface SubscriptionPlans {
  id: string;
  name: string;
  display_name: string;
}

interface UserSubscription {
  id: string;
  plan_id: string;
  status: string;
  billing_period: "monthly" | "yearly";
  subscription_plans: SubscriptionPlans;
}

interface PlanData {
  id: string;
  name: string;
}

const PlansTab: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downgradeDialogOpen, setDowngradeDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [pendingPlanChange, setPendingPlanChange] = useState<{
    plan: PlanData;
    billingPeriod: "monthly" | "yearly";
  } | null>(null);

  const fetchCurrentPlan = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/plans", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Please log in to view plans");
        } else {
          setError("Failed to load plans");
        }
        return;
      }

      const data = await response.json();
      console.log("📋 Current plan data:", data.currentPlan);
      setCurrentPlan(data.currentPlan);
    } catch (err) {
      console.error("Error fetching current plan:", err);
      setError("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const processPlanChange = async (
    plan: PlanData,
    billingPeriod: "monthly" | "yearly"
  ) => {
    try {
      // Create checkout session (or handle free plan)
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          billingPeriod,
        }),
      });

      console.log("📡 Checkout response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ Checkout error response:", errorData);

        // Check if this is a successful plan update (not an error)
        if (errorData.success) {
          setError(null);
          setSuccessMessage("Plan updated successfully!");
          setSuccessDialogOpen(true);
          // Refresh current plan
          await fetchCurrentPlan();
          return;
        }

        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const data = await res.json();
      console.log("✅ Checkout response data:", data);

      // If it's a successful plan change without redirect (e.g., Free plan)
      if (data.success) {
        setSuccessMessage(data.message || "Plan updated successfully!");
        setSuccessDialogOpen(true);
        await fetchCurrentPlan();
        return;
      }

      // If we got a checkout URL, redirect to Stripe
      if (data.url) {
        console.log("🔗 Redirecting to Stripe:", data.url);
        window.location.href = data.url;
      } else {
        console.warn("⚠️ No URL in response, not redirecting");
      }
    } catch (error) {
      console.error("💥 Plan change error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to process plan change"
      );
    }
  };

  const handlePlanSelect = async (planName: string) => {
    console.log("🎯 Plan selected:", planName);
    console.log("📊 Current plan name:", currentPlan?.subscription_plans?.name);

    try {
      // Get the plan details
      const supabase = createClient();
      const { data: plan, error: planError } = await supabase
        .from("subscription_plans")
        .select("id, name")
        .eq("name", planName)
        .single();

      if (planError || !plan) {
        console.error("Error finding plan:", planError);
        setError("Failed to find selected plan");
        return;
      }

      console.log("✅ Plan found:", plan);
      console.log("🔄 Current plan_id:", currentPlan?.plan_id);
      console.log("🆕 New plan_id:", plan.id);

      // Check if user is already on this plan
      if (currentPlan?.plan_id === plan.id) {
        console.log("⚠️ User is already on this plan");
        setError("You are already subscribed to this plan");
        return;
      }

      // Determine billing period (default to monthly, or match current if available)
      let billingPeriod: "monthly" | "yearly" = "monthly";
      if (currentPlan?.billing_period) {
        billingPeriod = currentPlan.billing_period;
      }

      console.log("💳 Billing period:", billingPeriod);

      // Show confirmation for downgrade to Free
      if (plan.name === "free") {
        setPendingPlanChange({ plan, billingPeriod });
        setDowngradeDialogOpen(true);
        return;
      }

      // Process the plan change
      await processPlanChange(plan, billingPeriod);
    } catch (error) {
      console.error("💥 Checkout error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to process plan change"
      );
    }
  };

  const handleDowngradeConfirm = async () => {
    setDowngradeDialogOpen(false);
    if (pendingPlanChange) {
      await processPlanChange(
        pendingPlanChange.plan,
        pendingPlanChange.billingPeriod
      );
      setPendingPlanChange(null);
    }
  };

  const handleDowngradeCancel = () => {
    setDowngradeDialogOpen(false);
    setPendingPlanChange(null);
    console.log("❌ User canceled downgrade");
  };

  const getPlanChipColor = (
    planName: string
  ): "info" | "primary" | "success" => {
    const name = planName.toLowerCase();
    if (name.includes("free")) return "info";
    if (name.includes("pro") || name.includes("basic")) return "primary";
    return "success";
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
    <Box sx={{ width: "100%" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {currentPlan && (
        <Box
          sx={{
            textAlign: "center",
            py: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Current Plan:
          </Typography>
          <Chip
            label={`${currentPlan.subscription_plans.display_name} (${currentPlan.billing_period})`}
            color={getPlanChipColor(currentPlan.subscription_plans.name)}
            sx={{ fontWeight: 600 }}
          />
        </Box>
      )}

      <PricingSection
        showTitle={true}
        showDescription={true}
        selectedPlan={currentPlan?.subscription_plans?.name}
        onPlanSelect={handlePlanSelect}
      />

      {/* Downgrade Confirmation Dialog */}
      <Dialog
        open={downgradeDialogOpen}
        onClose={handleDowngradeCancel}
        aria-labelledby="downgrade-dialog-title"
        aria-describedby="downgrade-dialog-description"
      >
        <DialogTitle id="downgrade-dialog-title">
          Confirm Downgrade to Free Plan
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="downgrade-dialog-description">
            Are you sure you want to downgrade to the Free plan? This will
            cancel your current subscription immediately. You can upgrade again
            at any time.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDowngradeCancel} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDowngradeConfirm}
            variant="contained"
            color="info"
            autoFocus
          >
            Yes, Downgrade to Free
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        aria-labelledby="success-dialog-title"
        aria-describedby="success-dialog-description"
      >
        <DialogTitle id="success-dialog-title">
          Plan Updated Successfully
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="success-dialog-description">
            {successMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSuccessDialogOpen(false)}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlansTab;
