import { createClient } from "@/utils/supabase/server";

/**
 * Check if a user has email notifications enabled
 * @param userId - The user's ID
 * @returns boolean - true if notifications are enabled, false otherwise
 */
export async function hasEmailNotificationsEnabled(
  userId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("user_settings")
    .select("email_notifications")
    .eq("user_id", userId)
    .single();

  // Default to true if no settings found (opt-out model)
  return settings?.email_notifications ?? true;
}
