// app/my-listings/businesses/view/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import BusinessViewClient from "./components/BusinessViewClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BusinessViewPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch business owned by the user
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", id)
    .eq("auth_id", user.id)
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

  // Attach subscription plan to business
  const businessWithPlan = {
    ...business,
    subscription_plan: subscription?.subscription_plans || null,
  };

  return <BusinessViewClient business={businessWithPlan} />;
}
