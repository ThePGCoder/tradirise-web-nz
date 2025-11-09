// components/ContactPositionDialog.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";

interface ContactPositionDialogProps {
  open: boolean;
  onClose: () => void;
  positionId: string;
  positionTitle: string;
  positionTrade: string;
  onSuccess?: () => void;
}

const ContactPositionDialog: React.FC<ContactPositionDialogProps> = ({
  open,
  onClose,
  positionId,
  positionTitle,
  positionTrade,
  onSuccess,
}) => {
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/positions/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          positionId,
          message: message.trim(),
          senderPhone: phone.trim() || undefined,
          companyName: company.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send contact request");
      }

      setSuccess(true);

      // Wait a moment to show success message
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setMessage("");
      setPhone("");
      setCompany("");
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="span">
          Apply for {positionTitle}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {positionTrade}
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Application sent successfully! The employer will receive your
              contact details.
            </Alert>
          )}

          <TextField
            label="Your Message"
            multiline
            rows={4}
            fullWidth
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Introduce yourself and explain why you're interested in this position..."
            disabled={loading || success}
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 1000 }}
            helperText={`${message.length}/1000 characters`}
          />

          <TextField
            label="Phone Number (Optional)"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+64 21 234 5678"
            disabled={loading || success}
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 20 }}
          />

          <TextField
            label="Company Name (Optional)"
            fullWidth
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Your company or business name"
            disabled={loading || success}
            sx={{ mb: 1 }}
            inputProps={{ maxLength: 100 }}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 2 }}
          >
            Your email address and the information above will be shared with the
            employer.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            color="error"
            startIcon={<Icon icon="mdi:close" width={16} height={16} />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || success || !message.trim()}
            startIcon={
              loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Icon icon="mdi:send" width={16} height={16} />
              )
            }
          >
            {loading ? "Sending..." : success ? "Sent!" : "Send Application"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ContactPositionDialog;
