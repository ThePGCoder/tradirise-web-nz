"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  CircularProgress,
  InputAdornment,
  Alert,
} from "@mui/material";
import { createClient } from "@/utils/supabase/client";
import Logo from "@/components/Logo";
import { Icon } from "@iconify/react";
import { useThemeMode } from "@/hooks/useThemeMode";
import { darkTheme, lightTheme } from "@/styles/theme";
import { useActionState } from "react";
import { useNotification } from "@/hooks/useNotification";
import { useRouter } from "next/navigation";

interface SelectUsernameState {
  error?: string;
  success?: boolean;
  fieldErrors?: {
    username?: string;
  };
}

interface SelectUsernameFormProps {
  setUsernameAction: (
    prevState: SelectUsernameState,
    formData: FormData
  ) => Promise<SelectUsernameState>;
}

export default function SelectUsernameForm({
  setUsernameAction,
}: SelectUsernameFormProps) {
  const { mode } = useThemeMode();
  const supabase = createClient();
  const notification = useNotification();
  const router = useRouter();

  const actionState = useActionState<SelectUsernameState, FormData>(
    setUsernameAction,
    {}
  );
  const state = actionState[0];
  const formAction = actionState[1];
  const isPending = actionState[2];

  const [username, setUsername] = useState("");
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState("");

  const themedColor =
    mode === "light"
      ? lightTheme.palette.primary.main
      : darkTheme.palette.primary.main;

  // Handle result
  useEffect(() => {
    if (state.success) {
      notification.success("Username set successfully!");
      setTimeout(() => {
        router.push("/home");
      }, 500);
    } else if (state.error) {
      notification.error(state.error);
    }

    if (state.fieldErrors?.username) {
      notification.error(state.fieldErrors.username);
    }
  }, [state.success, state.error, state.fieldErrors, notification, router]);

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck || usernameToCheck.length < 3) {
      setIsAvailable(null);
      setUsernameError("");
      return;
    }

    // Basic client-side validation
    if (usernameToCheck.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      setIsAvailable(false);
      return;
    } else if (!/^[a-z0-9_]+$/.test(usernameToCheck)) {
      setUsernameError(
        "Username can only contain lowercase letters, numbers, and underscores"
      );
      setIsAvailable(false);
      return;
    }

    setChecking(true);
    setUsernameError("");

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", usernameToCheck.toLowerCase())
        .limit(1);

      setChecking(false);

      if (error && error.code !== "PGRST116") {
        console.error("Username check error:", error);
        setUsernameError("Error checking username availability");
        setIsAvailable(null);
        return;
      }

      const available = !data || data.length === 0;
      setIsAvailable(available);
      if (!available) {
        setUsernameError("Username is already taken");
      }
    } catch (error) {
      console.error("Username check catch error:", error);
      setChecking(false);
      setIsAvailable(null);
      setUsernameError("Error checking username availability");
    }
  };

  // Debounced username checking
  useEffect(() => {
    if (!username || username.length < 3) {
      setIsAvailable(null);
      setUsernameError("");
      return;
    }

    const timeoutId = setTimeout(() => {
      checkUsernameAvailability(username);
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [username, supabase]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(newUsername);
  };

  // Enhanced form action that includes client-side validation
  const handleFormAction = (formData: FormData) => {
    if (!isAvailable || checking) {
      notification.error("Please choose an available username");
      return;
    }

    formAction(formData);
  };

  return (
    <Box component="form" action={handleFormAction} px={3} py={4}>
      <Stack spacing={3} alignItems="center">
        <Logo fontSize={"32px"} />

        <Typography variant="h5" textAlign="center" fontWeight={600}>
          Choose Your Username
        </Typography>

        <Typography variant="body2" textAlign="center" color="text.secondary">
          Welcome! Please select a username to complete your account setup.
        </Typography>

        <Box display="flex" alignItems="center" gap={1} width="100%">
          <Icon icon="mdi:account-circle" color={themedColor} height={20} />
          <TextField
            size="small"
            label="Username"
            name="username"
            defaultValue={username}
            onChange={handleUsernameChange}
            autoComplete="username"
            error={
              !!usernameError ||
              !!state.fieldErrors?.username ||
              (isAvailable === false && !checking && !!username.trim())
            }
            helperText={
              checking
                ? "Checking username..."
                : usernameError ||
                  state.fieldErrors?.username ||
                  (isAvailable === false &&
                    !!username.trim() &&
                    "Username is already taken")
            }
            fullWidth
            required
            disabled={isPending}
            InputProps={{
              endAdornment: checking && (
                <InputAdornment position="end">
                  <CircularProgress size={18} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {username.length >= 3 && isAvailable !== null && (
          <Alert
            severity={isAvailable ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {isAvailable
              ? `@${username} is available!`
              : `@${username} is already taken`}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={
            isPending || isAvailable !== true || username.length < 3 || checking
          }
          fullWidth
          size="large"
        >
          {isPending ? "Setting Username..." : "Continue"}
        </Button>

        <Typography variant="caption" color="text.secondary" textAlign="center">
          Username can only contain lowercase letters, numbers, and underscores
        </Typography>
      </Stack>
    </Box>
  );
}
