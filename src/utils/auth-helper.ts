import { redirect } from "next/navigation";
import { getUser } from "@/utils/supabase/server";
import { createClient } from "@/utils/supabase/server";

export async function requireAuth(redirectTo: string = "/login") {
  const user = await getUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}

export async function requireProfile(redirectTo: string = "/select-username") {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (error || !profile?.username) {
    redirect(redirectTo);
  }

  return { user, profile };
}
