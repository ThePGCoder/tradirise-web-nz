"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface RegisterState {
  error?: string;
  success?: boolean;
  fieldErrors?: {
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
  };
}

export async function registerAction(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  console.log("=== REGISTRATION START ===");

  const supabase = await createClient();

  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const agreedToTerms = formData.get("agreedToTerms") === "true";
  const agreedToTermsAt = formData.get("agreedToTermsAt") as string;

  console.log("Registration attempt for:", { email, username });

  // Server-side validation
  const fieldErrors: RegisterState["fieldErrors"] = {};

  if (!email) {
    fieldErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    fieldErrors.email = "Please enter a valid email address";
  }

  if (!username) {
    fieldErrors.username = "Username is required";
  } else if (username.trim().length < 3) {
    fieldErrors.username = "Username must be at least 3 characters";
  } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
    fieldErrors.username =
      "Username can only contain letters, numbers, and underscores";
  }

  if (!password) {
    fieldErrors.password = "Password is required";
  } else if (password.length < 6) {
    fieldErrors.password = "Password must be at least 6 characters";
  }

  if (!confirmPassword) {
    fieldErrors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match";
  }

  // Validate terms acceptance
  if (!agreedToTerms) {
    console.log("❌ Terms not accepted");
    return {
      error: "You must agree to the Terms of Service and Privacy Policy",
    };
  }

  // Return field errors if any
  if (Object.keys(fieldErrors).length > 0) {
    console.log("❌ Validation failed:", fieldErrors);
    return { fieldErrors };
  }

  // Check username availability on server
  console.log("Checking username availability...");
  const { data: existingUser, error: checkError } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username.trim())
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    console.error("❌ Error checking username:", checkError);
    return {
      error: "Database error checking username availability",
    };
  }

  if (existingUser) {
    console.log("❌ Username already taken");
    return {
      fieldErrors: {
        username: "Username is already taken",
      },
    };
  }

  // Attempt registration
  console.log("Creating auth user...");
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username.trim(),
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (signUpError) {
    console.error("❌ Auth signup error:", signUpError);
    return {
      error: signUpError.message,
    };
  }

  if (!authData.user) {
    console.error("❌ No user returned from signup");
    return {
      error: "Failed to create user account",
    };
  }

  console.log("✅ Auth user created:", authData.user.id);

  // Store terms acceptance in profile
  console.log("Storing terms acceptance...");
  const { error: profileUpdateError } = await supabase
    .from("profiles")
    .update({
      agreed_to_terms: true,
      agreed_to_terms_at: agreedToTermsAt,
      agreed_to_terms_version: "2025-11-02", // Update this date when you change terms
    })
    .eq("id", authData.user.id);

  if (profileUpdateError) {
    console.error("❌ Error storing terms acceptance:", profileUpdateError);
    // Don't fail registration, but log the error
  } else {
    console.log("✅ Terms acceptance stored");
  }

  console.log("✅ Profile created automatically by trigger");
  console.log("=== REGISTRATION COMPLETE ===");

  // Redirect to home directly after successful registration
  redirect("/home");
}
