// select-username/page.tsx
import { Box, Paper } from "@mui/material";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SelectUsernameForm from "./components/SelectUsernameForm";
import { setUsernameAction } from "./action";

export default async function SelectUsernamePage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Check if user already has a username
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  // If profile exists and has a username, redirect to home
  if (!profileError && profile && profile.username) {
    redirect("/home");
  }

  // If there's an error other than "no rows returned", handle it
  if (profileError && profileError.code !== "PGRST116") {
    console.error("Profile fetch error:", profileError);
    redirect("/login?error=profile_fetch_failed");
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      p={2}
    >
      <Paper elevation={3} sx={{ maxWidth: 400, width: "100%" }}>
        <SelectUsernameForm setUsernameAction={setUsernameAction} />
      </Paper>
    </Box>
  );
}
