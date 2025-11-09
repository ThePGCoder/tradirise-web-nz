"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Link,
  IconButton,
  InputAdornment,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";

import Logo from "@/components/Logo";
import SocialProviders from "@/components/auth/SocialProviders";
import { useThemeMode } from "@/hooks/useThemeMode";
import { lightTheme, darkTheme } from "@/styles/theme";
import { createClient } from "@/utils/supabase/client";
import { registerAction } from "../actions";
import { useNotification } from "@/hooks/useNotification";

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

export default function RegisterForm() {
  const { mode } = useThemeMode();
  const supabase = createClient();
  const notification = useNotification();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const actionState = useActionState<RegisterState, FormData>(
    registerAction,
    {}
  );
  const state = actionState[0];
  const formAction = actionState[1];
  const isPending = actionState[2];

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Separate tracking for each policy - NO sessionStorage
  const [termsViewed, setTermsViewed] = useState(false);
  const [privacyViewed, setPrivacyViewed] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [termsError, setTermsError] = useState("");

  // Track if user clicked the link
  const termsLinkClicked = useRef(false);
  const privacyLinkClicked = useRef(false);

  const [checking, setChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [togglePassword, setTogglePassword] = useState(false);
  const [toggleConfirm, setToggleConfirm] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Listen for when user comes back to this tab after clicking link
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // User came back to this tab
        if (termsLinkClicked.current && !termsViewed) {
          setTermsViewed(true);
        }
        if (privacyLinkClicked.current && !privacyViewed) {
          setPrivacyViewed(true);
        }
      }
    };

    // Also listen for window focus
    const handleFocus = () => {
      if (termsLinkClicked.current && !termsViewed) {
        setTermsViewed(true);
      }
      if (privacyLinkClicked.current && !privacyViewed) {
        setPrivacyViewed(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [termsViewed, privacyViewed]);

  // Track when user clicks on terms/privacy links
  const handleTermsClick = () => {
    termsLinkClicked.current = true;
  };

  const handlePrivacyClick = () => {
    privacyLinkClicked.current = true;
  };

  // Debounced username availability check
  useEffect(() => {
    if (!username.trim()) {
      setUsernameAvailable(null);
      setUsernameError("");
      return;
    }

    if (username.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters.");
      setUsernameAvailable(false);
      return;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      setUsernameError(
        "Username can only contain letters, numbers, and underscores."
      );
      setUsernameAvailable(false);
      return;
    }

    setChecking(true);
    setUsernameError("");

    const delayCheck = setTimeout(async () => {
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username.trim())
        .single();

      const isAvailable = !data;
      setUsernameAvailable(isAvailable);
      if (!isAvailable) {
        setUsernameError("Username is already taken");
      }
      setChecking(false);
    }, 600);

    return () => clearTimeout(delayCheck);
  }, [username, supabase]);

  // Password confirmation check
  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  }, [password, confirmPassword]);

  // Handle registration result
  useEffect(() => {
    if (state.success) {
      notification.success(
        "Registration successful! Please check your email for verification."
      );
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else if (state.error) {
      notification.error(state.error);
      if (formRef.current) {
        const emailInput = formRef.current.elements.namedItem(
          "email"
        ) as HTMLInputElement;
        const usernameInput = formRef.current.elements.namedItem(
          "username"
        ) as HTMLInputElement;
        const passwordInput = formRef.current.elements.namedItem(
          "password"
        ) as HTMLInputElement;
        const confirmPasswordInput = formRef.current.elements.namedItem(
          "confirmPassword"
        ) as HTMLInputElement;

        if (emailInput) emailInput.value = email;
        if (usernameInput) usernameInput.value = username;
        if (passwordInput) passwordInput.value = password;
        if (confirmPasswordInput) confirmPasswordInput.value = confirmPassword;
      }
    }

    if (state.fieldErrors) {
      if (state.fieldErrors.email) {
        notification.error(state.fieldErrors.email);
      }
      if (state.fieldErrors.username) {
        notification.error(state.fieldErrors.username);
      }
      if (state.fieldErrors.password) {
        notification.error(state.fieldErrors.password);
      }
      if (state.fieldErrors.confirmPassword) {
        notification.error(state.fieldErrors.confirmPassword);
      }
    }
  }, [
    state.success,
    state.error,
    state.fieldErrors,
    notification,
    router,
    email,
    username,
    password,
    confirmPassword,
  ]);

  const themedColor =
    mode === "light"
      ? lightTheme.palette.primary.main
      : darkTheme.palette.primary.main;

  const handleFormAction = (formData: FormData) => {
    setTermsError("");

    if (!agreedToTerms || !agreedToPrivacy) {
      const missingItems = [];
      if (!agreedToTerms) missingItems.push("Terms of Service");
      if (!agreedToPrivacy) missingItems.push("Privacy Policy");

      const errorMessage = `You must agree to the ${missingItems.join(" and ")}`;
      setTermsError(errorMessage);
      notification.error(errorMessage);
      return;
    }

    if (!usernameAvailable || checking) {
      notification.error("Please choose an available username");
      return;
    }

    const passwordValue = formData.get("password") as string;
    const confirmPasswordValue = formData.get("confirmPassword") as string;

    if (passwordValue !== confirmPasswordValue) {
      notification.error("Passwords do not match");
      return;
    }

    formData.append("agreedToTerms", "true");
    formData.append("agreedToPrivacy", "true");
    formData.append("agreedToTermsAt", new Date().toISOString());

    formAction(formData);
  };

  const getUsernameAdornment = () => {
    if (checking) {
      return (
        <InputAdornment position="end">
          <CircularProgress size={18} />
        </InputAdornment>
      );
    }
    if (usernameAvailable === true && username.trim()) {
      return (
        <InputAdornment position="end">
          <Box color="success.main">
            <Icon icon="mdi:check-circle" height={20} />
          </Box>
        </InputAdornment>
      );
    }
    return null;
  };

  return (
    <Box px={2} py={4} width="100%">
      <Stack spacing={2} alignItems="center">
        <Logo
          fontSize={"32px"}
          showCountry={true}
          countryFontSize={10}
          countryIconSize={10}
        />

        <Box
          component="form"
          ref={formRef}
          action={handleFormAction}
          width="100%"
        >
          <Stack spacing={2}>
            {/* Username */}
            <Box display="flex" alignItems="center" gap={1} width="100%">
              <Icon icon="mdi:account-circle" color={themedColor} height={20} />
              <TextField
                size="small"
                label="Username"
                name="username"
                defaultValue={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                error={
                  !!usernameError ||
                  !!state.fieldErrors?.username ||
                  (usernameAvailable === false &&
                    !checking &&
                    !!username.trim())
                }
                helperText={
                  checking
                    ? "Checking username..."
                    : usernameError ||
                      state.fieldErrors?.username ||
                      (usernameAvailable === false &&
                        !!username.trim() &&
                        "Username is already taken")
                }
                fullWidth
                required
                disabled={isPending}
                InputProps={{
                  endAdornment: getUsernameAdornment(),
                }}
              />
            </Box>

            {/* Email */}
            <Box display="flex" alignItems="center" gap={1} width="100%">
              <Icon icon="mdi:email" color={themedColor} height={20} />
              <TextField
                size="small"
                label="Email"
                name="email"
                type="email"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                error={!!state.fieldErrors?.email}
                helperText={state.fieldErrors?.email}
                fullWidth
                required
                disabled={isPending}
              />
            </Box>

            {/* Password */}
            <Box display="flex" alignItems="center" gap={1} width="100%">
              <Icon icon="mdi:lock" color={themedColor} height={20} />
              <TextField
                size="small"
                label="Password"
                name="password"
                type={togglePassword ? "text" : "password"}
                defaultValue={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                error={!!state.fieldErrors?.password}
                helperText={state.fieldErrors?.password}
                fullWidth
                required
                disabled={isPending}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setTogglePassword(!togglePassword)}
                      edge="end"
                      disabled={isPending}
                      tabIndex={-1}
                    >
                      <Icon
                        icon={togglePassword ? "mdi:eye-off" : "mdi:eye"}
                        height={20}
                      />
                    </IconButton>
                  ),
                }}
              />
            </Box>

            {/* Confirm Password */}
            <Box display="flex" alignItems="center" gap={1} width="100%">
              <Icon icon="mdi:lock" color={themedColor} height={20} />
              <TextField
                size="small"
                label="Confirm Password"
                name="confirmPassword"
                type={toggleConfirm ? "text" : "password"}
                defaultValue={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                error={
                  !!confirmPasswordError || !!state.fieldErrors?.confirmPassword
                }
                helperText={
                  confirmPasswordError || state.fieldErrors?.confirmPassword
                }
                fullWidth
                required
                disabled={isPending}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setToggleConfirm(!toggleConfirm)}
                      edge="end"
                      disabled={isPending}
                      tabIndex={-1}
                    >
                      <Icon
                        icon={toggleConfirm ? "mdi:eye-off" : "mdi:eye"}
                        height={20}
                      />
                    </IconButton>
                  ),
                }}
              />
            </Box>

            {/* Terms and Privacy Policy Acceptance */}
            <Box>
              <Stack spacing={1}>
                {/* Terms of Service Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreedToTerms}
                      onChange={(e) => {
                        setAgreedToTerms(e.target.checked);
                        if (e.target.checked && agreedToPrivacy) {
                          setTermsError("");
                        }
                      }}
                      disabled={!termsViewed || isPending}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I have read and agree to the{" "}
                      <Link
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        onClick={handleTermsClick}
                      >
                        Terms of Service
                      </Link>
                      {!termsViewed && (
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 0.5, fontStyle: "italic" }}
                        >
                          (open link to enable checkbox)
                        </Typography>
                      )}
                    </Typography>
                  }
                />

                {/* Privacy Policy Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreedToPrivacy}
                      onChange={(e) => {
                        setAgreedToPrivacy(e.target.checked);
                        if (e.target.checked && agreedToTerms) {
                          setTermsError("");
                        }
                      }}
                      disabled={!privacyViewed || isPending}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I have read and agree to the{" "}
                      <Link
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        onClick={handlePrivacyClick}
                      >
                        Privacy Policy
                      </Link>
                      {!privacyViewed && (
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 0.5, fontStyle: "italic" }}
                        >
                          (open link to enable checkbox)
                        </Typography>
                      )}
                    </Typography>
                  }
                />

                {termsError && (
                  <FormHelperText error sx={{ ml: 2 }}>
                    {termsError}
                  </FormHelperText>
                )}
              </Stack>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={
                isPending ||
                checking ||
                usernameAvailable !== true ||
                !agreedToTerms ||
                !agreedToPrivacy
              }
            >
              {isPending ? "Creating Account..." : "Register"}
            </Button>
          </Stack>
        </Box>

        <SocialProviders />

        <Typography variant="body2">
          Already have an account?{" "}
          <Link href="/login" underline="none">
            Login
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}
