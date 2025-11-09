"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useThemeMode } from "@/hooks/useThemeMode";
import { lightTheme, darkTheme } from "@/styles/theme";
import { useActionState } from "react";
import { useNotification } from "@/hooks/useNotification";
import { forgotPasswordAction } from "./actions";

interface ForgotPasswordState {
  error?: string;
  success?: boolean;
  isOAuthUser?: boolean;
}

export default function ForgotPasswordForm() {
  const { mode } = useThemeMode();
  const notification = useNotification();
  const formRef = useRef<HTMLFormElement>(null);

  const [email, setEmail] = useState("");

  const actionState = useActionState<ForgotPasswordState, FormData>(
    forgotPasswordAction,
    {}
  );
  const state = actionState[0];
  const formAction = actionState[1];
  const isPending = actionState[2];

  const themedColor =
    mode === "light"
      ? lightTheme.palette.primary.main
      : darkTheme.palette.primary.main;

  // Handle result
  useEffect(() => {
    if (state.success) {
      notification.success(
        "Password reset instructions have been sent to your email."
      );
    } else if (state.error) {
      notification.error(state.error);
      // Restore form values after error
      if (formRef.current) {
        const emailInput = formRef.current.elements.namedItem(
          "email"
        ) as HTMLInputElement;
        if (emailInput) emailInput.value = email;
      }
    }
  }, [state.success, state.error, notification, email]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      px={2}
    >
      {state.success ? (
        <Card sx={{ width: "100%", maxWidth: 400 }}>
          <CardHeader
            title={
              <Typography variant="h5" fontWeight="bold">
                Check Your Email
              </Typography>
            }
            subheader="Password reset instructions sent"
          />
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                If you registered using your email and password, you will
                receive a password reset email at <strong>{email}</strong>.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please check your inbox and spam folder.
              </Typography>
              <Button variant="text" fullWidth href="/login" sx={{ mt: 2 }}>
                Back to Login
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ width: "100%", maxWidth: 400 }}>
          <CardHeader
            title={
              <Typography variant="h5" fontWeight="bold">
                Reset Your Password
              </Typography>
            }
            subheader="Type in your email and we'll send you a link to reset your password"
          />
          <CardContent>
            <Box component="form" ref={formRef} action={formAction}>
              <Stack spacing={3}>
                <Box display="flex" alignItems="center" gap={1} width="100%">
                  <Icon icon="mdi:email" color={themedColor} height={20} />
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

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isPending}
                >
                  {isPending ? "Sending..." : "Send reset email"}
                </Button>

                <Typography variant="body2" align="center">
                  Remember your password?{" "}
                  <Link href="/login" underline="hover">
                    Login
                  </Link>
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
