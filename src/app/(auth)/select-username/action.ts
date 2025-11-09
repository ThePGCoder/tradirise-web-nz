// select-username/action.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface SelectUsernameState {
  error?: string;
  success?: boolean;
  fieldErrors?: {
    username?: string;
  };
}

export async function setUsernameAction(
  prevState: SelectUsernameState,
  formData: FormData
): Promise<SelectUsernameState> {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      redirect("/login");
    }

    const username = formData.get("username") as string;

    // Server-side validation
    const fieldErrors: SelectUsernameState["fieldErrors"] = {};

    if (!username) {
      fieldErrors.username = "Username is required";
    } else if (username.trim().length < 3) {
      fieldErrors.username = "Username must be at least 3 characters";
    } else if (username.trim().length > 20) {
      fieldErrors.username = "Username must be less than 20 characters";
    } else if (!/^[a-z0-9_]+$/.test(username.trim())) {
      fieldErrors.username =
        "Username can only contain lowercase letters, numbers, and underscores";
    }

    // Return field errors if any
    if (Object.keys(fieldErrors).length > 0) {
      return { fieldErrors };
    }

    const cleanUsername = username.toLowerCase().trim();

    // Check username availability on server
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", cleanUsername)
      .single();

    if (existingUser) {
      return {
        fieldErrors: {
          username: "Username is already taken",
        },
      };
    }

    // Use upsert to either update existing profile or create new one
    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          username: cleanUsername,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      )
      .select();

    if (error) {
      console.error("Username upsert error:", error);
      return {
        error: "Failed to set username. Please try again.",
      };
    }

    if (!data || data.length === 0) {
      return {
        error: "Failed to create or update profile",
      };
    }

    // Revalidate the current path to clear any cached data
    revalidatePath("/select-username");

    // Success - redirect to home
    // Note: The NEXT_REDIRECT error in console is expected behavior
    redirect("/home");
  } catch (error) {
    // Handle redirect errors (these are expected)
    if (
      error &&
      typeof error === "object" &&
      error !== null &&
      "digest" in error
    ) {
      const digest = (error as { digest: string }).digest;
      if (digest?.includes("NEXT_REDIRECT")) {
        // This is a successful redirect, re-throw it
        throw error;
      }
    }

    console.error("Username creation error:", error);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
