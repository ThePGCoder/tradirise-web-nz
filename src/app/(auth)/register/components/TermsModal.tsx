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

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  isAccepted: boolean;
}

export default function TermsModal({
  open,
  onClose,
  onAccept,
  isAccepted,
}: TermsModalProps) {
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
          <Typography variant="h5">Terms of Service</Typography>
          <IconButton onClick={onClose}>
            <Icon icon="mdi:close" />
          </IconButton>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Last Updated: November 3, 2025
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
            1. Acceptance of Terms
          </Typography>
          <Typography paragraph>
            By accessing or using Tradirise (&#34;the Platform&#34;,
            &#34;we&#34;, &#34;us&#34;, &#34;our&#34;), you agree to these Terms
            of Service. If you do not agree, you must not use the Platform.
          </Typography>
          <Typography paragraph>
            Tradirise is operated as a sole proprietorship based in Wellington,
            New Zealand.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            2. Description of Service
          </Typography>
          <Typography paragraph>
            Tradirise is an online job board and marketplace connecting:
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Homeowners seeking trade services</li>
            <li>Employers seeking to hire tradespeople</li>
            <li>Tradespeople and businesses offering trade services</li>
          </Typography>
          <Typography paragraph>
            We provide tools for posting and responding to listings, messaging,
            and managing connections. Payments are handled securely through
            Stripe.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            3. Eligibility
          </Typography>
          <Typography paragraph>
            You must be at least 18 years old to use the Platform. By using the
            Platform, you confirm that you have the legal capacity to enter into
            these Terms and to use the services lawfully.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            4. User Accounts
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            4.1 Account Creation
          </Typography>
          <Typography paragraph>
            To access certain features, you must register an account and provide
            accurate and complete information. You agree to keep your details up
            to date.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            4.2 Account Security
          </Typography>
          <Typography paragraph>
            You are responsible for maintaining the confidentiality of your
            login credentials and all activities that occur under your account.
            Notify us immediately of any unauthorised access or suspected
            breach.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            4.3 Termination or Suspension
          </Typography>
          <Typography paragraph>
            We reserve the right to suspend or terminate any account at our
            discretion, including for misuse of the Platform, fraudulent
            activity, or breach of these Terms.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            5. Subscriptions, Payments & Refunds
          </Typography>
          <Typography paragraph>
            The Platform operates on a simple subscription model. There are no
            fees per lead, per contact, or per quote.
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>
              Subscriptions are billed monthly or yearly, as selected during
              sign-up.
            </li>
            <li>All payments are processed securely via Stripe.</li>
            <li>
              You may cancel your subscription at any time via your account
              settings; cancellation stops future billing but does not
              retroactively refund prior payments, except as noted below.
            </li>
            <li>
              We offer a 7-day money-back guarantee from the date of your
              initial subscription if you are unsatisfied for any reason.
            </li>
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            6. User Responsibilities
          </Typography>
          <Typography paragraph>
            You are solely responsible for your conduct and for verifying the
            identity, qualifications, and suitability of other users you
            interact with. Tradirise does not vet or endorse any particular
            tradesperson, job, or business.
          </Typography>
          <Typography paragraph>
            You agree to comply with all applicable laws and regulations when
            using the Platform.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            7. User Content and Intellectual Property
          </Typography>
          <Typography paragraph>
            You retain ownership of all content you upload, such as profiles,
            job listings, and reviews. By posting on the Platform, you grant
            Tradirise a non-exclusive, royalty-free, worldwide licence to use,
            display, and distribute that content for the operation and promotion
            of the Platform.
          </Typography>
          <Typography paragraph>
            All Platform materials, branding, software, and design are the
            intellectual property of Tradirise and may not be copied, modified,
            or distributed without our prior written consent.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            8. Disclaimers
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            8.1 &#34;As Is&#34; Service
          </Typography>
          <Typography paragraph fontWeight="bold">
            THE PLATFORM IS PROVIDED &#34;AS IS&#34; AND &#34;AS AVAILABLE&#34;
            WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
            BUT NOT LIMITED TO FITNESS FOR A PARTICULAR PURPOSE OR
            NON-INFRINGEMENT.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            8.2 No Guarantees
          </Typography>
          <Typography paragraph>We do not guarantee:</Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>The accuracy or completeness of any listings or profiles</li>
            <li>That the Platform will always be secure or error-free</li>
            <li>That users are licensed, insured, or suitable</li>
            <li>That jobs or opportunities are legitimate or appropriate</li>
            <li>
              The quality of work, services, or outcomes of any connections made
              through the Platform
            </li>
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            9. Limitation of Liability
          </Typography>
          <Typography paragraph fontWeight="bold">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRADIRISE AND ITS OWNER
            SHALL NOT BE LIABLE FOR:
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>
              Any indirect, incidental, special, consequential, or punitive
              damages
            </li>
            <li>Loss of profits, revenue, data, or business opportunities</li>
            <li>
              Personal injury or property damage (except where caused by our
              negligence)
            </li>
            <li>
              Any amount exceeding the total subscription fees you paid in the
              12 months prior to the event giving rise to the claim
            </li>
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            10. Consumer Guarantees Act 1993
          </Typography>
          <Typography paragraph>
            Nothing in these Terms limits any rights you may have under the
            Consumer Guarantees Act 1993 where that Act applies. However, if you
            are using the Platform for business purposes, you agree that the
            provisions of the Consumer Guarantees Act do not apply.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            11. Changes to Terms
          </Typography>
          <Typography paragraph>
            We may update these Terms from time to time. Any changes will be
            effective when posted on the Platform. Continued use of the Platform
            after updates constitutes acceptance of the revised Terms.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            12. Governing Law & Jurisdiction
          </Typography>
          <Typography paragraph>
            These Terms are governed by and construed in accordance with the
            laws of New Zealand. You agree to submit to the exclusive
            jurisdiction of the courts of New Zealand.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            13. Contact Us
          </Typography>
          <Typography paragraph>
            For questions or concerns about these Terms, please contact:
          </Typography>
          <Typography paragraph>
            Email: thepgcoder@gmail.com
            <br />
            Based in Wellington, New Zealand
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
                I have read and agree to these Terms of Service
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
