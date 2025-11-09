import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SettingsClient from "./components/SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user settings from database
  const { data: settings } = await supabase
    .from("user_settings")
    .select("email_notifications")
    .eq("user_id", user.id)
    .single();

  return (
    <SettingsClient
      user={user}
      initialEmailNotifications={settings?.email_notifications ?? true}
    />
  );
}
