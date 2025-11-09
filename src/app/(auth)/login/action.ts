// app/login/action.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export async function loginAction(
  prevState: { error?: string; success?: boolean },
  formData: FormData
) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      error: "Email and password are required",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  // Return success state instead of redirecting immediately
  // This allows the client to show a notification before redirect
  return {
    success: true,
  };
}
