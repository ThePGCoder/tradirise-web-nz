"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useThemeMode } from "@/hooks/useThemeMode";
import { lightTheme, darkTheme } from "@/styles/theme";

export default function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { mode } = useThemeMode();

  const themedColor =
    mode === "light"
      ? lightTheme.palette.primary.main
      : darkTheme.palette.primary.main;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/home"); // redirect to protected route
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      px={2}
    >
      <Card sx={{ width: "100%", maxWidth: 400 }}>
        <CardHeader
          title={
            <Typography variant="h5" fontWeight="bold">
              Reset Your Password
            </Typography>
          }
          subheader="Please enter your new password below."
        />
        <CardContent>
          <Box component="form" onSubmit={handleUpdatePassword}>
            <Stack spacing={3}>
              <TextField
                label="New Password"
                type="password"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Icon
                      icon="mdi:lock"
                      height={22}
                      color={themedColor}
                      style={{ marginRight: 8 }}
                    />
                  ),
                }}
              />
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={18} /> : null}
              >
                {isLoading ? "Saving..." : "Save New Password"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
