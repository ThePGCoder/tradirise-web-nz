// app/components/LandingSectionServer.tsx (Server Component)

import { createClient } from "@/utils/supabase/server";
import LandingSection from "./LandingSection";
import { Box, CircularProgress } from "@mui/material";

async function getPlans() {
  const supabase = await createClient();

  const { data: plans, error } = await supabase
    .from("plans")
    .select("*")
    .order("price", { ascending: true });

  if (error) {
    console.error("Error fetching plans:", error);
    return [];
  }

  return plans || [];
}

export default async function LandingSectionServer() {
  const plans = await getPlans();

  return <LandingSection plans={plans} />;
}

// Loading component for Suspense boundary
export function LandingSectionLoading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  );
}
