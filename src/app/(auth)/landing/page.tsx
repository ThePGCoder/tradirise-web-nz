// src/app/(auth)/landing/page.tsx (Server Component)
import { redirect } from "next/navigation";
import { getUser } from "@/utils/supabase/server";
import { createClient } from "@/utils/supabase/server";
import LandingSection from "./components/LandingSection";

// Metadata export (only works in server components)
export const metadata = {
  title: "TradeLists NZ - Connect Tradespeople, Clients & Employers",
  description:
    "Connecting tradespeople, clients, employers, and businesses — all in one place. Find work, post jobs, and grow your trade in New Zealand.",
  keywords: [
    "tradespeople",
    "trades",
    "construction",
    "employment",
    "New Zealand",
    "job board",
    "hire tradies",
  ],
  openGraph: {
    title: "TradeLists NZ - Connect Tradespeople, Clients & Employers",
    description:
      "Find work, post jobs, and grow your trade business in New Zealand.",
    type: "website",
  },
};

async function getPlans() {
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

export default async function LandingPage() {
  // Server-side auth check
  const user = await getUser();

  // Redirect authenticated users to home
  if (user) {
    redirect("/home");
  }

  // Fetch plans server-side
  const plans = await getPlans();

  // Render landing section with server-fetched data
  return <LandingSection plans={plans} />;
}
