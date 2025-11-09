"use server";

import { createClient } from "@/utils/supabase/server";

interface ResetPasswordState {
  error?: string;
  success?: boolean;
}

export async function sendPasswordResetAction(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prevState: ResetPasswordState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formData: FormData
): Promise<ResetPasswordState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Not authenticated",
    };
  }

  // Check if user signed up with OAuth
  if (user.app_metadata?.provider && user.app_metadata.provider !== "email") {
    return {
      error: `This account uses ${user.app_metadata.provider} sign-in. Password reset is not available for OAuth accounts.`,
    };
  }

  if (!user.email) {
    return {
      error: "No email associated with this account",
    };
  }

  // Send password reset email
  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/update-password`,
  });

  if (error) {
    console.error("Password reset error:", error);
    return {
      error: error.message,
    };
  }

  return {
    success: true,
  };
}
