// src/app/businesses/page.tsx
import React from "react";
//import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import BusinessesClient from "./components/BusinessesClient";
import { Business } from "@/types/business";

const ITEMS_PER_PAGE = 20;

interface BusinessesPageProps {
  searchParams: Promise<{ page?: string }>;
}

const Businesses: React.FC<BusinessesPageProps> = async ({ searchParams }) => {
  const supabase = await createClient();

  /*
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }*/

  // Get page from search params
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // Fetch businesses data with pagination
  const {
    data: businesses,
    error,
    count,
  } = await supabase
    .from("businesses")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching businesses:", error);
    throw new Error("Failed to load businesses data");
  }

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

  return (
    <BusinessesClient
      initialBusinesses={businesses as Business[]}
      currentPage={page}
      totalPages={totalPages}
      totalCount={count || 0}
    />
  );
};

export default Businesses;
