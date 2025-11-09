"use client";

import { createClient } from "@/utils/supabase/client";
import {
  Box,
  Typography,
  Button,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TextField,
  Stack,
  Switch,
  Divider,
  Card,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { useThemeMode } from "@/hooks/useThemeMode";
import CustomCard from "@/components/CustomCard";
import PageHeader from "@/components/PageHeader";
import { useActionState } from "react";
import { useNotification } from "@/hooks/useNotification";
import { sendPasswordResetAction } from "../actions";
import Center from "@/global/Center";

interface SettingsClientProps {
  user: User;
  initialEmailNotifications: boolean;
}

interface ResetPasswordState {
  error?: string;
  success?: boolean;
}

const SettingsClient: React.FC<SettingsClientProps> = ({
  user,
  initialEmailNotifications,
}) => {
  const { mode, toggleTheme } = useThemeMode();
  const supabase = createClient();
  const router = useRouter();
  const notification = useNotification();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(
    initialEmailNotifications
  );
  const [saving, setSaving] = useState(false);

  // Password reset action state
  const actionState = useActionState<ResetPasswordState, FormData>(
    sendPasswordResetAction,
    {}
  );
  const resetState = actionState[0];
  const resetAction = actionState[1];
  const resetPending = actionState[2];

  // Handle password reset result
  useEffect(() => {
    if (resetState.success) {
      notification.success("Password reset email sent! Check your inbox.");
    } else if (resetState.error) {
      notification.error(resetState.error);
    }
  }, [resetState.success, resetState.error, notification]);

  const saveEmailNotifications = async (value: boolean) => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/update-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailNotifications: value,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      setEmailNotifications(value);
      notification.success("Settings saved successfully");
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to save settings";
      notification.error(errorMsg);
      // Revert the change on error
      setEmailNotifications(!value);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmationText !== "DELETE") {
      setError("Please type 'DELETE' to confirm");
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const response = await fetch("/api/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      // Sign out the user
      await supabase.auth.signOut();

      notification.success("Account deleted successfully");

      // Redirect to home page
      router.push("/");
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete account";
      setError(errorMsg);
      notification.error(errorMsg);
      setDeleting(false);
    }
  };

  const isConfirmationValid = confirmationText === "DELETE";
  const isOAuthUser =
    user.app_metadata?.provider && user.app_metadata.provider !== "email";

  return (
    <Box margin="auto" width="100%" maxWidth={1400} px={2} pb={6}>
      <PageHeader title="Settings" />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Theme Settings */}
      <CustomCard sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Appearance
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Theme Mode
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant={mode === "light" ? "contained" : "text"}
                  startIcon={<Icon icon="mdi:white-balance-sunny" />}
                  onClick={() => mode === "dark" && toggleTheme()}
                >
                  Light
                </Button>
                <Button
                  variant={mode === "dark" ? "contained" : "text"}
                  startIcon={<Icon icon="mdi:moon-waning-crescent" />}
                  onClick={() => mode === "light" && toggleTheme()}
                >
                  Dark
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </CustomCard>

      {/* Notification Settings */}
      <CustomCard sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body1">Email Notifications</Typography>
                <Typography variant="body2" color="text.secondary">
                  Receive updates about new quotes and messages
                </Typography>
              </Box>
              <Switch
                checked={emailNotifications}
                onChange={(e) => saveEmailNotifications(e.target.checked)}
                disabled={saving}
              />
            </Box>
          </Stack>
        </CardContent>
      </CustomCard>

      {/* Account Information */}
      <CustomCard sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Sign-in Method
              </Typography>
              <Typography variant="body1">
                {isOAuthUser
                  ? `${user.app_metadata.provider} (OAuth)`
                  : "Email & Password"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Account Created
              </Typography>
              <Typography variant="body1">
                {new Date(user.created_at).toLocaleDateString("en-NZ", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CustomCard>

      {/* Security Settings - Password Reset */}
      {!isOAuthUser && (
        <CustomCard sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Security
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body1" gutterBottom>
                  Password
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Send a password reset link to your email address
                </Typography>
                <Box component="form" action={resetAction}>
                  <Button
                    type="submit"
                    variant="outlined"
                    startIcon={<Icon icon="mdi:lock-reset" />}
                    disabled={resetPending}
                  >
                    {resetPending ? "Sending..." : "Reset Password"}
                  </Button>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </CustomCard>
      )}

      {/* Credits Section */}
      <CustomCard sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Credits & Acknowledgments
          </Typography>

          {/* Developer Credit */}
          <Center>
            <Box sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Designed & Built By
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Box display="flex" fontSize="1.2rem">
                  <Box color={blue[500]}>&nbsp;&#123;</Box>
                  <Box fontStyle="italic" fontFamily="corinthia">
                    the
                  </Box>
                  <Box fontWeight={500} fontFamily="poppins">
                    PGCoder
                  </Box>
                  <Box color={blue[500]}>...&#125;</Box>
                </Box>
              </Box>
            </Box>
          </Center>

          <Divider sx={{ my: 2 }} />

          {/* Technology Stack */}
          <Center>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Built With
            </Typography>
          </Center>

          {/* Grid of Technologies */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
              mt: 2,
            }}
          >
            {/* Next.js */}
            <Card
              variant="outlined"
              sx={{
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent>
                <Stack
                  flexDirection="column"
                  alignItems="center"
                  textAlign="center"
                  spacing={1}
                >
                  <Icon icon="devicon:nextjs" width={40} height={40} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Next.js
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      React Framework
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Material-UI */}
            <Card
              variant="outlined"
              sx={{
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent>
                <Stack
                  flexDirection="column"
                  alignItems="center"
                  textAlign="center"
                  spacing={1}
                >
                  <Icon icon="devicon:materialui" width={40} height={40} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Material-UI
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Components
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Supabase */}
            <Card
              variant="outlined"
              sx={{
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent>
                <Stack
                  flexDirection="column"
                  alignItems="center"
                  textAlign="center"
                  spacing={1}
                >
                  <Icon icon="devicon:supabase" width={40} height={40} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Supabase
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Backend & Auth
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Stripe */}
            <Card
              variant="outlined"
              sx={{
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent>
                <Stack
                  flexDirection="column"
                  alignItems="center"
                  textAlign="center"
                  spacing={1}
                >
                  <Icon icon="logos:stripe" width={40} height={40} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Stripe
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Payments
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Google */}
            <Card
              variant="outlined"
              sx={{
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent>
                <Stack
                  flexDirection="column"
                  alignItems="center"
                  textAlign="center"
                  spacing={1}
                >
                  <Icon icon="devicon:google" width={40} height={40} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Google
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      OAuth
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* TypeScript */}
            <Card
              variant="outlined"
              sx={{
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent>
                <Stack
                  flexDirection="column"
                  alignItems="center"
                  textAlign="center"
                  spacing={1}
                >
                  <Icon icon="devicon:typescript" width={40} height={40} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      TypeScript
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Language
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Iconify */}
            <Card
              variant="outlined"
              sx={{
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent>
                <Stack
                  flexDirection="column"
                  alignItems="center"
                  textAlign="center"
                  spacing={1}
                >
                  <Icon icon="simple-icons:iconify" width={40} height={40} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Iconify
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Icons
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Mailjet */}
            <Card
              variant="outlined"
              sx={{
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent>
                <Stack
                  flexDirection="column"
                  alignItems="center"
                  textAlign="center"
                  spacing={1}
                >
                  <Icon icon="logos:mailjet-icon" width={40} height={40} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Mailjet
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Email Service
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
            <Center>
              <Typography variant="caption" color="text.secondary">
                Built with ❤️ in New Zealand
              </Typography>
            </Center>
          </Box>
        </CardContent>
      </CustomCard>

      {/* Danger Zone */}
      <CustomCard sx={{ border: "1px solid", borderColor: "error.main" }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Icon
              icon="mdi:alert-octagon"
              color="error"
              width={24}
              height={24}
            />
            <Typography variant="h6" color="error" sx={{ ml: 1 }}>
              Danger Zone
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Once you delete your account, there is no going back. This action
            cannot be undone.
          </Typography>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Account deletion will:</strong>
            </Typography>
            <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
              <li>Cancel any active subscriptions</li>
              <li>Remove your profile and business listings</li>
              <li>Delete your photos and portfolio</li>
              <li>Remove access to all premium features</li>
            </ul>
            <Typography variant="body2">
              <strong>Note:</strong> Payment records will be retained for legal
              and accounting purposes.
            </Typography>
          </Alert>

          <Button
            variant="text"
            color="error"
            startIcon={<Icon icon="mdi:delete-forever" />}
            onClick={() => setDeleteDialogOpen(true)}
            size="large"
          >
            Delete Account
          </Button>
        </CardContent>
      </CustomCard>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Icon icon="mdi:alert-circle-outline" color="error" />
            Delete Account
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you absolutely sure you want to delete your account?
          </Typography>

          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>This action is permanent and cannot be undone.</strong>
            </Typography>
          </Alert>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your account will be permanently deleted, including:
          </Typography>

          <ul style={{ margin: "0 0 16px 20px", color: "text.secondary" }}>
            <li>Profile information</li>
            <li>Business listings</li>
            <li>Photos and portfolio</li>
            <li>Messages and quotes</li>
            <li>Subscription access</li>
          </ul>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" sx={{ mb: 1 }}>
            To confirm deletion, type <strong>DELETE</strong> in the box below:
          </Typography>

          <TextField
            fullWidth
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Type DELETE to confirm"
            variant="outlined"
            size="small"
            error={confirmationText.length > 0 && !isConfirmationValid}
            helperText={
              confirmationText.length > 0 && !isConfirmationValid
                ? "Please type 'DELETE' exactly"
                : ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={!isConfirmationValid || deleting}
            startIcon={
              deleting ? (
                <Icon icon="mdi:loading" className="animate-spin" />
              ) : (
                <Icon icon="mdi:delete-forever" />
              )
            }
          >
            {deleting ? "Deleting Account..." : "Delete Account"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsClient;
