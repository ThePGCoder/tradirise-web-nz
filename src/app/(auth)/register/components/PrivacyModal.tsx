"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useState, useEffect, useRef } from "react";

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  isAccepted: boolean;
}

export default function PrivacyModal({
  open,
  onClose,
  onAccept,
  isAccepted,
}: PrivacyModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isChecked, setIsChecked] = useState(isAccepted);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsChecked(isAccepted);
  }, [isAccepted]);

  useEffect(() => {
    if (open) {
      setHasScrolledToBottom(false);
      setIsChecked(isAccepted);
    }
  }, [open, isAccepted]);

  const handleScroll = () => {
    if (!contentRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 50;

    if (scrolledToBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    if (isChecked) {
      onAccept();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Privacy Policy</Typography>
          <IconButton onClick={onClose}>
            <Icon icon="mdi:close" />
          </IconButton>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Last Updated: December 24, 2024
        </Typography>
      </DialogTitle>

      <DialogContent
        ref={contentRef}
        onScroll={handleScroll}
        dividers
        sx={{ maxHeight: "60vh" }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            1. Introduction
          </Typography>
          <Typography paragraph>
            Tradirise is committed to protecting your privacy. We comply with
            the Privacy Act 2020 (New Zealand).
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            2. Information We Collect
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            2.1 Information You Provide
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Name, email, phone, address</li>
            <li>Business details and NZBN</li>
            <li>Trade credentials and licenses</li>
            <li>Insurance details</li>
            <li>Job listings and reviews</li>
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            2.2 Automatically Collected
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>IP address and device info</li>
            <li>Browser type and usage patterns</li>
            <li>Cookies and tracking</li>
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            2.3 Payment Information
          </Typography>
          <Typography paragraph>
            Processed by Stripe. We retain transaction records for 7 years (IRD
            requirement).
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            3. How We Use Your Information
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Account management</li>
            <li>Facilitate connections</li>
            <li>Process payments</li>
            <li>Send notifications</li>
            <li>Provide support</li>
            <li>Prevent fraud</li>
            <li>Legal compliance</li>
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            4. How We Share Your Information
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            4.1 With Other Users
          </Typography>
          <Typography paragraph>
            Profile, listings, and reviews are visible to other users.
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            4.2 Service Providers
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Stripe (payments)</li>
            <li>Cloud hosting (AWS, Google Cloud, Vercel)</li>
            <li>Email services</li>
            <li>Analytics tools</li>
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            4.3 Overseas Data Storage
          </Typography>
          <Typography paragraph>
            Data may be stored in Australia, US, or EU with comparable
            safeguards per Privacy Act 2020.
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            4.4 Legal Requirements
          </Typography>
          <Typography paragraph>
            We may disclose information for legal compliance or law enforcement.
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            4.5 Business Transfers
          </Typography>
          <Typography paragraph>
            Information may transfer if Tradirise is sold or merged.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            5. Data Security
          </Typography>
          <Typography paragraph>
            We use encryption, secure authentication, and regular security
            reviews. However, no system is 100% secure.
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            5.1 Data Breach Notification
          </Typography>
          <Typography paragraph>
            We will notify affected individuals and the Privacy Commissioner as
            required by Privacy Act 2020.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            6. Your Rights
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Access your information</li>
            <li>Request corrections</li>
            <li>Request deletion (subject to legal requirements)</li>
            <li>Data portability</li>
            <li>Opt-out of marketing</li>
            <li>Lodge complaints</li>
          </Typography>
          <Typography paragraph sx={{ mt: 1 }}>
            Contact us to exercise these rights. We respond within 20 working
            days.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            7. Cookies
          </Typography>
          <Typography paragraph>
            We use essential, analytics, and performance cookies. Control via
            browser settings.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            8. Data Retention
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Active accounts: retained while active</li>
            <li>Deleted accounts: most data deleted within 30 days</li>
            <li>Transaction records: 7 years (tax compliance)</li>
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            9. Marketing Communications
          </Typography>
          <Typography paragraph>
            Opt-in required. Unsubscribe anytime via email link or account
            settings.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            10. Children&#39;s Privacy
          </Typography>
          <Typography paragraph>
            Platform is for 18+. We don&#39;t knowingly collect minor data.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            11. Third-Party Links
          </Typography>
          <Typography paragraph>
            Not responsible for third-party privacy practices.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            12. Changes to Policy
          </Typography>
          <Typography paragraph>
            We may update this policy. Material changes will be notified.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            13. Contact Us
          </Typography>
          <Typography paragraph>
            Email: thepgcoder@gmail.com
            <br />
            Based in Wellington, New Zealand
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            14. Privacy Commissioner (New Zealand)
          </Typography>
          <Typography paragraph>
            Website: www.privacy.org.nz
            <br />
            Phone: 0800 803 909
            <br />
            Email: enquiries@privacy.org.nz
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            © 2025 Tradirise — All rights reserved.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ flexDirection: "column", gap: 2, p: 2 }}>
        {!hasScrolledToBottom && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.secondary",
            }}
          >
            <Icon icon="mdi:arrow-down" height={20} />
            <Typography variant="caption">
              Please scroll to the bottom to continue
            </Typography>
          </Box>
        )}

        {hasScrolledToBottom && (
          <FormControlLabel
            control={
              <Checkbox
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2">
                I have read and agree to this Privacy Policy
              </Typography>
            }
          />
        )}

        <Box display="flex" gap={2} width="100%">
          <Button onClick={onClose} variant="outlined" fullWidth>
            Cancel
          </Button>
          <Button
            onClick={handleAccept}
            variant="contained"
            fullWidth
            disabled={!hasScrolledToBottom || !isChecked}
          >
            Accept
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
