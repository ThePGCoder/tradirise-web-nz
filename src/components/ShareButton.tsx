// ============================================
// FILE 1: components/ShareButton.tsx
// Main component with both modal and native options
// ============================================

"use client";

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import CustomCard from "@/components/CustomCard";

export interface ShareData {
  url: string;
  title: string;
  description: string;
}

interface ShareButtonProps {
  shareData: ShareData;
  variant?: "icon" | "button" | "text";
  useModal?: boolean; // true = modal with icons, false = native share
  buttonText?: string;
  color?: "primary" | "secondary" | "success" | "info" | "inherit";
}

const ShareButton: React.FC<ShareButtonProps> = ({
  shareData,
  variant = "icon",
  useModal = true,
  buttonText = "Share",
  color = "inherit",
}) => {
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Open modal or trigger native share
  const handleShareClick = async () => {
    if (useModal) {
      setModalOpen(true);
    } else {
      await handleNativeShare();
    }
  };

  // Native share API
  const handleNativeShare = async () => {
    if (!("share" in navigator)) {
      setError("Sharing is not supported on this device.");
      return;
    }

    try {
      await navigator.share({
        title: shareData.title,
        text: shareData.description,
        url: shareData.url,
      });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Share failed:", err);
        setError("Share failed. Please try again.");
      }
    }
  };

  // Social platform share functions
  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareData.url
    )}&quote=${encodeURIComponent(shareData.description)}`;
    openPopup(url, "Facebook");
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareData.url
    )}&text=${encodeURIComponent(shareData.title)}`;
    openPopup(url, "Twitter");
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareData.url
    )}`;
    openPopup(url, "LinkedIn");
  };

  const shareToWhatsApp = () => {
    const text = `${shareData.title}\n\n${shareData.description}\n\n${shareData.url}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setModalOpen(false);
    setSuccess("Opening WhatsApp...");
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(shareData.title);
    const body = encodeURIComponent(
      `${shareData.description}\n\n${shareData.url}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setModalOpen(false);
    setSuccess("Opening email client...");
  };

  const shareViaGmail = () => {
    const subject = encodeURIComponent(shareData.title);
    const body = encodeURIComponent(
      `${shareData.description}\n\n${shareData.url}`
    );
    const url = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
    window.open(url, "_blank");
    setModalOpen(false);
    setSuccess("Opening Gmail...");
  };

  const shareToMessenger = () => {
    const url = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
      shareData.url
    )}&app_id=966242223397117&redirect_uri=${encodeURIComponent(
      shareData.url
    )}`;
    openPopup(url, "Messenger");
  };

  const shareToTelegram = () => {
    //const text = `${shareData.title}\n\n${shareData.url}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(
      shareData.url
    )}&text=${encodeURIComponent(shareData.title)}`;
    window.open(url, "_blank");
    setModalOpen(false);
    setSuccess("Opening Telegram...");
  };

  const shareToReddit = () => {
    const url = `https://reddit.com/submit?url=${encodeURIComponent(
      shareData.url
    )}&title=${encodeURIComponent(shareData.title)}`;
    openPopup(url, "Reddit");
  };

  const shareViaSMS = () => {
    const text = `${shareData.title}\n\n${shareData.url}`;
    // iOS and Android support different formats
    const smsUrl = /iPhone|iPad|iPod/i.test(navigator.userAgent)
      ? `sms:&body=${encodeURIComponent(text)}`
      : `sms:?body=${encodeURIComponent(text)}`;
    window.location.href = smsUrl;
    setModalOpen(false);
    setSuccess("Opening Messages...");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setModalOpen(false);
      setSuccess("Link copied to clipboard!");
    } catch (err) {
      setError("Failed to copy link");
      console.error("Copy failed:", err);
    }
  };

  const openPopup = (url: string, platform: string) => {
    const width = 600;
    const height = 500;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      url,
      `${platform}-share`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    );
    setModalOpen(false);
    setSuccess(`Opening ${platform} share dialog...`);
  };

  // Render button based on variant
  const renderButton = () => {
    // Always render as Button (like FavouriteButton)
    if (variant === "icon") {
      return (
        <Button
          size="small"
          variant="text"
          color={color}
          onClick={handleShareClick}
          sx={{
            minWidth: "auto",
            px: 1,
          }}
        >
          <Icon icon="mdi:share-variant" width={20} height={20} />
        </Button>
      );
    }

    if (variant === "text") {
      return (
        <Button
          size="small"
          variant="text"
          color={color}
          startIcon={<Icon icon="mdi:share-variant" width={16} height={16} />}
          onClick={handleShareClick}
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            textTransform: "none",
            minWidth: { xs: "auto", sm: "64px" },
            px: { xs: 1, sm: 2 },
            "& .MuiButton-startIcon": {
              margin: { xs: 0, sm: "0 8px 0 -4px" },
            },
          }}
        >
          <Box sx={{ display: { xs: "none", sm: "inline" } }}>{buttonText}</Box>
        </Button>
      );
    }

    return (
      <Button
        onClick={handleShareClick}
        variant="contained"
        color={color}
        startIcon={<Icon icon="mdi:share-variant" width={20} height={20} />}
      >
        {buttonText}
      </Button>
    );
  };

  return (
    <>
      {renderButton()}

      {/* Share Modal with CustomCard styling */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            backgroundImage: "none",
          },
        }}
      >
        <CustomCard>
          <DialogTitle>
            <Typography variant="h6" component="span" fontWeight={600}>
              Share
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1.5,
                py: 1,
              }}
            >
              {/* Facebook */}
              <Box
                onClick={shareToFacebook}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  padding: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: theme.transitions.create(
                    ["background-color", "transform"],
                    {
                      duration: theme.transitions.duration.shorter,
                    }
                  ),
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Icon
                  icon="bi:facebook"
                  width={36}
                  height={36}
                  style={{ color: "#1877F2" }}
                />
                <Typography variant="caption" textAlign="center">
                  Facebook
                </Typography>
              </Box>

              {/* Messenger */}
              <Box
                onClick={shareToMessenger}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  padding: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: theme.transitions.create(
                    ["background-color", "transform"],
                    {
                      duration: theme.transitions.duration.shorter,
                    }
                  ),
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Icon
                  icon="bi:messenger"
                  width={36}
                  height={36}
                  style={{ color: "#00B2FF" }}
                />
                <Typography variant="caption" textAlign="center">
                  Messenger
                </Typography>
              </Box>

              {/* WhatsApp */}
              <Box
                onClick={shareToWhatsApp}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  padding: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: theme.transitions.create(
                    ["background-color", "transform"],
                    {
                      duration: theme.transitions.duration.shorter,
                    }
                  ),
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Icon
                  icon="bi:whatsapp"
                  width={36}
                  height={36}
                  style={{ color: "#25D366" }}
                />
                <Typography variant="caption" textAlign="center">
                  WhatsApp
                </Typography>
              </Box>

              {/* Telegram */}
              <Box
                onClick={shareToTelegram}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  padding: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: theme.transitions.create(
                    ["background-color", "transform"],
                    {
                      duration: theme.transitions.duration.shorter,
                    }
                  ),
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Icon
                  icon="bi:telegram"
                  width={36}
                  height={36}
                  style={{ color: "#0088CC" }}
                />
                <Typography variant="caption" textAlign="center">
                  Telegram
                </Typography>
              </Box>

              {/* Twitter */}
              <Box
                onClick={shareToTwitter}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  padding: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: theme.transitions.create(
                    ["background-color", "transform"],
                    {
                      duration: theme.transitions.duration.shorter,
                    }
                  ),
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Icon
                  icon="bi:twitter-x"
                  width={36}
                  height={36}
                  style={{ color: "#1DA1F2" }}
                />
                <Typography variant="caption" textAlign="center">
                  Twitter
                </Typography>
              </Box>

              {/* LinkedIn */}
              <Box
                onClick={shareToLinkedIn}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  padding: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: theme.transitions.create(
                    ["background-color", "transform"],
                    {
                      duration: theme.transitions.duration.shorter,
                    }
                  ),
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Icon
                  icon="bi:linkedin"
                  width={36}
                  height={36}
                  style={{ color: "#0A66C2" }}
                />
                <Typography variant="caption" textAlign="center">
                  LinkedIn
                </Typography>
              </Box>

              {/* Reddit */}
              <Box
                onClick={shareToReddit}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  padding: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: theme.transitions.create(
                    ["background-color", "transform"],
                    {
                      duration: theme.transitions.duration.shorter,
                    }
                  ),
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Icon
                  icon="bi:reddit"
                  width={36}
                  height={36}
                  style={{ color: "#FF4500" }}
                />
                <Typography variant="caption" textAlign="center">
                  Reddit
                </Typography>
              </Box>

              {/* Gmail */}
              <Box
                onClick={shareViaGmail}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  padding: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: theme.transitions.create(
                    ["background-color", "transform"],
                    {
                      duration: theme.transitions.duration.shorter,
                    }
                  ),
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Icon icon="logos:google-gmail" width={36} height={36} />
                <Typography variant="caption" textAlign="center">
                  Gmail
                </Typography>
              </Box>

              {/* Email */}
              <Box
                onClick={shareViaEmail}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  padding: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: theme.transitions.create(
                    ["background-color", "transform"],
                    {
                      duration: theme.transitions.duration.shorter,
                    }
                  ),
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Icon icon="bi:envelope-fill" width={36} height={36} />
                <Typography variant="caption" textAlign="center">
                  Email
                </Typography>
              </Box>

              {/* SMS */}
              <Box
                onClick={shareViaSMS}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  padding: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: theme.transitions.create(
                    ["background-color", "transform"],
                    {
                      duration: theme.transitions.duration.shorter,
                    }
                  ),
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Icon
                  icon="bi:chat-dots-fill"
                  width={36}
                  height={36}
                  style={{ color: "#34C759" }}
                />
                <Typography variant="caption" textAlign="center">
                  SMS
                </Typography>
              </Box>

              {/* Copy Link */}
              <Box
                onClick={copyToClipboard}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  padding: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: theme.transitions.create(
                    ["background-color", "transform"],
                    {
                      duration: theme.transitions.duration.shorter,
                    }
                  ),
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Icon icon="bi:clipboard-fill" width={36} height={36} />
                <Typography variant="caption" textAlign="center">
                  Copy Link
                </Typography>
              </Box>

              {/* Native Share (if available) */}
              {typeof navigator !== "undefined" && "share" in navigator && (
                <Box
                  onClick={handleNativeShare}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    padding: 2,
                    borderRadius: 2,
                    cursor: "pointer",
                    border: "1px dashed",
                    borderColor: "divider",
                    transition: theme.transitions.create(
                      ["background-color", "transform"],
                      {
                        duration: theme.transitions.duration.shorter,
                      }
                    ),
                    "&:hover": {
                      bgcolor: "action.hover",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Icon icon="bi:three-dots" width={36} height={36} />
                  <Typography
                    variant="caption"
                    textAlign="center"
                    fontWeight={600}
                  >
                    More
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
        </CustomCard>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareButton;
