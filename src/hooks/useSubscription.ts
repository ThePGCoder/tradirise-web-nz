// hooks/useSubscription.ts
/*
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export interface SubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  priceMonthly: number;
  priceYearly: number;
  maxBusinesses: number;
  maxPhotos: number;
  maxJobListings: number;
  canAdvertiseProfile: boolean;
  canBoost: boolean;
  hasFeaturedPlacement: boolean;
  hasPrioritySupport: boolean;
}

export interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  status: "active" | "canceled" | "past_due" | "incomplete";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  businessesUsed: number;
  photosUsed: number;
  jobListingsUsed: number;
  plan: SubscriptionPlan;
}

export interface AddonPurchase {
  id: string;
  addonType: string;
  amount: number;
  targetId?: string;
  expiresAt?: Date;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

interface UseSubscriptionReturn {
  subscription: UserSubscription | null;
  plans: SubscriptionPlan[];
  addons: AddonPurchase[];
  loading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
  canUseFeature: (feature: keyof SubscriptionPlan) => boolean;
  hasRemainingQuota: (
    quotaType: "businesses" | "photos" | "jobListings"
  ) => boolean;
  getRemainingQuota: (
    quotaType: "businesses" | "photos" | "jobListings"
  ) => number;
}

export function useSubscription(userId?: string): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null
  );
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [addons, setAddons] = useState<AddonPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchSubscriptionData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      // Fetch user subscription with plan details
      const { data: subscriptionData, error: subscriptionError } =
        await supabase
          .from("user_subscriptions")
          .select(
            `
          *,
          plan:subscription_plans(*)
        `
          )
          .eq("user_id", userId)
          .single();

      if (subscriptionError && subscriptionError.code !== "PGRST116") {
        throw subscriptionError;
      }

      // If no subscription exists, create a free tier subscription
      if (!subscriptionData) {
        const { data: freePlan } = await supabase
          .from("subscription_plans")
          .select("*")
          .eq("name", "free")
          .single();

        if (freePlan) {
          const { data: newSubscription, error: insertError } = await supabase
            .from("user_subscriptions")
            .insert({
              user_id: userId,
              plan_id: freePlan.id,
              status: "active",
            })
            .select(
              `
              *,
              plan:subscription_plans(*)
            `
            )
            .single();

          if (insertError) throw insertError;

          setSubscription({
            id: newSubscription.id,
            planId: newSubscription.plan_id,
            planName: freePlan.name,
            status: newSubscription.status,
            currentPeriodStart: new Date(newSubscription.current_period_start),
            currentPeriodEnd: new Date(newSubscription.current_period_end),
            cancelAtPeriodEnd: newSubscription.cancel_at_period_end,
            businessesUsed: newSubscription.businesses_used,
            photosUsed: newSubscription.photos_used,
            jobListingsUsed: newSubscription.job_listings_used_this_month,
            plan: freePlan,
          });
        }
      } else {
        setSubscription({
          id: subscriptionData.id,
          planId: subscriptionData.plan_id,
          planName: subscriptionData.plan.name,
          status: subscriptionData.status,
          currentPeriodStart: new Date(subscriptionData.current_period_start),
          currentPeriodEnd: new Date(subscriptionData.current_period_end),
          cancelAtPeriodEnd: subscriptionData.cancel_at_period_end,
          businessesUsed: subscriptionData.businesses_used,
          photosUsed: subscriptionData.photos_used,
          jobListingsUsed: subscriptionData.job_listings_used_this_month,
          plan: subscriptionData.plan,
        });
      }

      // Fetch all available plans
      const { data: plansData, error: plansError } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("price_monthly");

      if (plansError) throw plansError;
      setPlans(plansData || []);

      // Fetch user's addon purchases
      const { data: addonsData, error: addonsError } = await supabase
        .from("addon_purchases")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (addonsError) throw addonsError;
      setAddons(
        addonsData?.map((addon) => ({
          id: addon.id,
          addonType: addon.addon_type,
          amount: addon.amount,
          targetId: addon.target_id,
          expiresAt: addon.expires_at ? new Date(addon.expires_at) : undefined,
          status: addon.status,
          createdAt: new Date(addon.created_at),
        })) || []
      );
    } catch (err: any) {
      console.error("Error fetching subscription data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = async () => {
    setLoading(true);
    await fetchSubscriptionData();
  };

  // Helper function to check if user can use a specific feature
  const canUseFeature = (feature: keyof SubscriptionPlan): boolean => {
    if (!subscription) return false;

    switch (feature) {
      case "canAdvertiseProfile":
        return subscription.plan.canAdvertiseProfile;
      case "canBoost":
        return subscription.plan.canBoost;
      case "hasFeaturedPlacement":
        return subscription.plan.hasFeaturedPlacement;
      case "hasPrioritySupport":
        return subscription.plan.hasPrioritySupport;
      default:
        return false;
    }
  };

  // Helper function to check remaining quota
  const hasRemainingQuota = (
    quotaType: "businesses" | "photos" | "jobListings"
  ): boolean => {
    return getRemainingQuota(quotaType) > 0;
  };

  const getRemainingQuota = (
    quotaType: "businesses" | "photos" | "jobListings"
  ): number => {
    if (!subscription) return 0;

    switch (quotaType) {
      case "businesses":
        return Math.max(
          0,
          subscription.plan.maxBusinesses - subscription.businessesUsed
        );
      case "photos":
        return Math.max(
          0,
          subscription.plan.maxPhotos - subscription.photosUsed
        );
      case "jobListings":
        return Math.max(
          0,
          subscription.plan.maxJobListings - subscription.jobListingsUsed
        );
      default:
        return 0;
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [userId]);

  return {
    subscription,
    plans,
    addons,
    loading,
    error,
    refreshSubscription,
    canUseFeature,
    hasRemainingQuota,
    getRemainingQuota,
  };
}

// Usage quota update functions
export async function incrementUsage(
  userId: string,
  quotaType: "businesses_used" | "photos_used" | "job_listings_used_this_month",
  amount: number = 1
) {
  const supabase = createClient();

  const { error } = await supabase.rpc("increment_usage", {
    user_id: userId,
    quota_type: quotaType,
    increment_by: amount,
  });

  if (error) {
    console.error("Error incrementing usage:", error);
    throw error;
  }
}

// Create the SQL function for usage increment
export const createUsageIncrementFunction = `
CREATE OR REPLACE FUNCTION increment_usage(
  user_id UUID,
  quota_type TEXT,
  increment_by INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
  UPDATE user_subscriptions 
  SET 
    businesses_used = CASE 
      WHEN quota_type = 'businesses_used' THEN businesses_used + increment_by
      ELSE businesses_used 
    END,
    photos_used = CASE 
      WHEN quota_type = 'photos_used' THEN photos_used + increment_by
      ELSE photos_used 
    END,
    job_listings_used_this_month = CASE 
      WHEN quota_type = 'job_listings_used_this_month' THEN job_listings_used_this_month + increment_by
      ELSE job_listings_used_this_month 
    END,
    updated_at = NOW()
  WHERE user_subscriptions.user_id = increment_usage.user_id;
END;
$$ LANGUAGE plpgsql;
`;
*/
