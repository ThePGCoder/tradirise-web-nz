// utils/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Route configuration
const routes = {
  // Pages that require full authentication (with username)
  protected: [
    "/account",
    "/my-favorites",
    "/my-listings",
    "/settings",
  ] as const,

  // Pages that require auth but NO username check
  onboarding: ["/select-username"] as const,

  // Auth pages (redirect if already logged in with username)
  auth: ["/login", "/register", "/forgot-password"] as const,

  // Special routes that handle their own auth
  special: ["/callback", "/update-password"] as const,
};

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh session if expired
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Check route types
    const isProtectedRoute = routes.protected.some((route) =>
      pathname.startsWith(route)
    );
    const isOnboardingRoute = routes.onboarding.some((route) =>
      pathname.startsWith(route)
    );
    const isAuthRoute = routes.auth.includes(
      pathname as (typeof routes.auth)[number]
    );
    const isSpecialRoute = routes.special.some((route) =>
      pathname.startsWith(route)
    );

    // ========================================
    // SPECIAL ROUTES (callback, update-password)
    // Let them handle their own auth logic
    // ========================================
    if (isSpecialRoute) {
      return response;
    }

    // ========================================
    // UNAUTHENTICATED USERS
    // ========================================
    if (userError || !user) {
      // Block access to protected routes
      if (isProtectedRoute || isOnboardingRoute) {
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // Allow access to public and auth routes
      return response;
    }

    // ========================================
    // AUTHENTICATED USERS
    // ========================================

    // Allow onboarding routes without username check
    if (isOnboardingRoute) {
      return response;
    }

    // Fetch user profile for all other routes
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    // If profile fetch fails, redirect to username selection
    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return NextResponse.redirect(new URL("/select-username", request.url));
    }

    // If user hasn't set username, redirect to username selection
    if (!profile?.username) {
      return NextResponse.redirect(new URL("/select-username", request.url));
    }

    // Redirect from auth pages to home (user already logged in)
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    // Redirect root to home
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    return response;
  } catch (e) {
    console.error("Middleware error:", e);
    // If Supabase client creation fails, allow request through
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
