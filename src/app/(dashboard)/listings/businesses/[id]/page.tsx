// src/app/businesses/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import BusinessDetailClient from "./components/BusinessDetailClient";
import {
  getBusinessEndorsements,
  trackProfileView,
} from "../actions/endorsements";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BusinessDetailPage({ params }: PageProps) {
  // Await params first
  const { id } = await params;

  const supabase = await createClient();

  // Fetch business
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", id)
    .single();

  if (businessError || !business) {
    console.error("Error fetching business:", businessError);
    notFound();
  }

  // Fetch user subscription plan separately
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select(
      `
      *,
      subscription_plans(
        name,
        display_name
      )
    `
    )
    .eq("user_id", business.auth_id)
    .eq("status", "active")
    .single();

  console.log("Subscription data:", subscription);

  // Attach subscription plan to business
  const businessWithPlan = {
    ...business,
    subscription_plan: subscription?.subscription_plans || null,
  };

  // Fetch endorsement data
  const endorsementData = await getBusinessEndorsements(id);

  // Track profile view (optional - runs in background)
  trackProfileView(id).catch(console.error);

  return (
    <BusinessDetailClient
      business={businessWithPlan}
      endorsementData={endorsementData}
    />
  );
}
