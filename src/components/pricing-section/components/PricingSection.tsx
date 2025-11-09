// components/PricingSection.tsx (Server Component Wrapper)
import React from "react";
import { createClient } from "@/utils/supabase/server";
import PricingSectionClient from "./PricingSectionClient";

export interface SubscriptionPlan {
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

async function getPlans(): Promise<SubscriptionPlan[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .order("price_monthly", { ascending: true });

    if (error) {
      console.error("Error fetching plans:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Exception while fetching plans:", err);
    return [];
  }
}

interface PricingSectionProps {
  showTitle?: boolean;
  showDescription?: boolean;
  selectedPlan?: string;
  onPlanSelect?: (planName: string) => void;
}

const PricingSection = async ({
  showTitle = true,
  showDescription = true,
  selectedPlan,
  onPlanSelect,
}: PricingSectionProps) => {
  const plans = await getPlans();

  return (
    <PricingSectionClient
      plans={plans}
      showTitle={showTitle}
      showDescription={showDescription}
      selectedPlan={selectedPlan}
      onPlanSelect={onPlanSelect}
    />
  );
};

export default PricingSection;
