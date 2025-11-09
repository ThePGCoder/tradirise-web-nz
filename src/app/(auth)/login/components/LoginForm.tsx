"use client";

import { Box, TextField, Button, Typography, Stack, Link } from "@mui/material";
import { Icon } from "@iconify/react";
import { useActionState, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import SocialProviders from "@/components/auth/SocialProviders";
import { loginAction } from "../action";
import { useNotification } from "@/hooks/useNotification";

interface LoginState {
  error?: string;
  success?: boolean;
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const notification = useNotification();
  const formRef = useRef<HTMLFormElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );

  // Check for URL error parameters (from OAuth callback)
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      notification.error(decodeURIComponent(error));
    }
  }, [searchParams, notification]);

  // Handle login result
  useEffect(() => {
    if (state.success) {
      notification.success("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/home");
      }, 500);
    } else if (state.error) {
      notification.error(state.error);
      // Restore form values after error
      if (formRef.current) {
        const emailInput = formRef.current.elements.namedItem(
          "email"
        ) as HTMLInputElement;
        const passwordInput = formRef.current.elements.namedItem(
          "password"
        ) as HTMLInputElement;
        if (emailInput) emailInput.value = email;
        if (passwordInput) passwordInput.value = password;
      }
    }
  }, [state.success, state.error, notification, router, email, password]);

  return (
    <Box px={2} py={4} width="100%">
      <Stack spacing={2} alignItems="center">
        <Logo
          fontSize={"32px"}
          showCountry={true}
          countryFontSize={10}
          countryIconSize={10}
        />

        <Box component="form" ref={formRef} action={formAction} width="100%">
          <Stack spacing={2}>
            <Box display="flex" alignItems="center" gap={1} width="100%">
              <Box color="primary.main">
                <Icon icon="mdi:email" height={20} />
              </Box>
              <TextField
                size="small"
                label="Email"
                type="email"
                name="email"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                fullWidth
                disabled={isPending}
              />
            </Box>

            <Box display="flex" alignItems="center" gap={1} width="100%">
              <Box color="primary.main">
                <Icon icon="mdi:lock" height={20} />
              </Box>
              <TextField
                size="small"
                label="Password"
                type="password"
                name="password"
                defaultValue={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                fullWidth
                disabled={isPending}
              />
            </Box>

            <Box textAlign="center">
              <Link underline="none" href="/forgot-password">
                <Typography variant="body2">Forgot Password?</Typography>
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              fullWidth
            >
              {isPending ? "Logging in…" : "Log In"}
            </Button>
          </Stack>
        </Box>

        <SocialProviders />

        <Typography variant="body2">
          Don&#39;t have an account?{" "}
          <Link href="/register" underline="none">
            Register
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}
