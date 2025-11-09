// callback/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, error_description);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error_description || error)}`
    );
  }

  if (code) {
    const supabase = await createClient();

    const { data, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Auth exchange error:", exchangeError);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(exchangeError.message)}`
      );
    }

    if (data.user) {
      try {
        // Check if user has a username in your profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", data.user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          // Error other than "no rows returned"
          console.error("Profile fetch error:", profileError);
          return NextResponse.redirect(
            `${origin}/login?error=profile_fetch_failed`
          );
        }

        // If no profile exists or username is null/empty
        if (!profile || !profile.username) {
          // Redirect to username selection page
          return NextResponse.redirect(`${origin}/select-username`);
        }

        // User has a username, redirect to home
        return NextResponse.redirect(`${origin}/home`);
      } catch (error) {
        console.error("Callback processing error:", error);
        return NextResponse.redirect(
          `${origin}/login?error=callback_processing_failed`
        );
      }
    }
  }

  // No code present, redirect to login
  return NextResponse.redirect(`${origin}/login`);
}
