"use server";

import { createClient } from "@/utils/supabase/server";

interface ForgotPasswordState {
  error?: string;
  success?: boolean;
  isOAuthUser?: boolean;
}

export async function forgotPasswordAction(
  prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  if (!email) {
    return {
      error: "Email is required",
    };
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return {
      error: "Please enter a valid email address",
    };
  }

  // Check if user exists and how they signed up
  const { data: authUser } = await supabase.rpc("get_user_by_email", {
    user_email: email,
  });

  // If user doesn't exist, still show success for security (don't reveal if email exists)
  if (!authUser || authUser.length === 0) {
    return {
      success: true,
    };
  }

  // Check if user signed up with OAuth (Google, etc.)
  const { data: userData } = await supabase.auth.admin.getUserById(
    authUser[0].id
  );

  if (userData?.user?.app_metadata?.provider !== "email") {
    return {
      isOAuthUser: true,
      error: `This account uses ${userData?.user?.app_metadata?.provider || "OAuth"} sign-in. Please log in with ${userData?.user?.app_metadata?.provider || "your OAuth provider"} instead.`,
    };
  }

  // Send password reset email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
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
