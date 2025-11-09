// lib/business-utils.ts
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar_url?: string;
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      return {
        id: profile.id,
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        username: profile.username || profile.email?.split("@")[0] || "User",
        email: profile.email || "",
        avatar_url: profile.avatar_url,
      };
    }

    return null;
  } catch (err) {
    console.error("Error fetching current user:", err);
    return null;
  }
}

export async function getBusinessById(businessId: string) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const { data: business, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .eq("auth_id", user.id)
      .single();

    if (error || !business) {
      console.error("Error fetching business:", error);
      return null;
    }

    return business;
  } catch (err) {
    console.error("Error fetching business:", err);
    return null;
  }
}

export async function getBusinessWithSubscription(businessId: string) {
  const supabase = await createClient();

  try {
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
      .eq("id", businessId)
      .eq("auth_id", user.id)
      .single();

    if (businessError || !business) {
      console.error("Error fetching business:", businessError);
      return null;
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
    return {
      ...business,
      subscription_plan: subscription?.subscription_plans || null,
    };
  } catch (err) {
    console.error("Error fetching business with subscription:", err);
    return null;
  }
}
