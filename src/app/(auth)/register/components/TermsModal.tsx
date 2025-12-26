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
          <Typography variant="subtitle1" gutterBottom>
            2.1 Marketplace Platform
          </Typography>
          <Typography paragraph>
            Tradirise is an online job board and marketplace that CONNECTS:
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

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            2.2 What We Are NOT
          </Typography>
          <Typography paragraph fontWeight="medium">
            Tradirise is NOT:
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>A construction or trades company</li>
            <li>An employment agency</li>
            <li>A recruitment service</li>
            <li>A supervisor of work or job sites</li>
            <li>A guarantor of work quality or completion</li>
            <li>An insurer or warranty provider</li>
          </Typography>
          <Typography paragraph>
            We are purely a facilitator connecting independent parties. All
            relationships, contracts, and work arrangements are directly between
            users.
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

          <Typography variant="subtitle1" gutterBottom>
            6.1 General Conduct
          </Typography>
          <Typography paragraph>
            You agree to comply with all applicable laws and regulations when
            using the Platform, including but not limited to the Building Act
            2004, Health and Safety at Work Act 2015, and Fair Trading Act 1986.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            6.2 Independent Contractors
          </Typography>
          <Typography paragraph fontWeight="medium">
            All tradespeople and businesses on the Platform are independent
            contractors. They are NOT employees, agents, or representatives of
            Tradirise.
          </Typography>
          <Typography paragraph>We do NOT:</Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Control how they perform their work</li>
            <li>Supervise their job sites</li>
            <li>Guarantee their qualifications, licenses, or insurance</li>
            <li>Employ or train them</li>
            <li>Set their rates or working hours</li>
            <li>Provide equipment or materials</li>
            <li>Direct their work methods</li>
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            6.3 Verification Responsibility
          </Typography>
          <Typography paragraph fontWeight="medium">
            You are SOLELY responsible for verifying the identity,
            qualifications, and suitability of other users you interact with.
          </Typography>
          <Typography paragraph>This includes:</Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>
              Verifying tradesperson licenses and registrations (e.g., LBP,
              PGDB, EWRB)
            </li>
            <li>
              Confirming appropriate insurance coverage (public liability,
              professional indemnity)
            </li>
            <li>Checking references, reviews, and past work</li>
            <li>Obtaining multiple quotes</li>
            <li>Inspecting credentials and certifications before hiring</li>
            <li>
              Ensuring compliance with Building Code and safety regulations
            </li>
            <li>Verifying business registration (NZBN)</li>
          </Typography>
          <Typography paragraph fontWeight="medium" sx={{ mt: 1 }}>
            Tradirise does NOT verify, endorse, or guarantee any user, listing,
            or service. Any verification badges or profile indicators are
            user-provided information only and do not constitute our endorsement
            or guarantee of quality, safety, or suitability.
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            6.4 Insurance Requirements
          </Typography>
          <Typography paragraph>Tradirise STRONGLY RECOMMENDS that:</Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>
              All tradespeople maintain public liability insurance (minimum $1-2
              million) and professional indemnity insurance
            </li>
            <li>
              All homeowners verify tradesperson insurance before hiring and
              request proof of current coverage
            </li>
            <li>All users obtain appropriate insurance for their activities</li>
          </Typography>
          <Typography paragraph>
            We do NOT verify insurance status. Insurance information on profiles
            is user-provided and not verified by Tradirise. It is YOUR
            responsibility to request and verify current insurance certificates.
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            6.5 Health and Safety
          </Typography>
          <Typography paragraph>
            All users are responsible for compliance with the Health and Safety
            at Work Act 2015 and all applicable safety regulations. Tradirise
            has NO responsibility for:
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Job site safety</li>
            <li>Worker safety equipment or training</li>
            <li>Workplace hazards</li>
            <li>Safety inspections or monitoring</li>
          </Typography>
          <Typography paragraph sx={{ mt: 1 }}>
            <strong>Tradespeople must:</strong>
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Maintain appropriate safety certifications</li>
            <li>Provide their own safety equipment</li>
            <li>Follow all safety regulations</li>
            <li>Ensure work sites are safe</li>
            <li>Comply with all applicable codes and standards</li>
          </Typography>
          <Typography paragraph sx={{ mt: 1 }}>
            <strong>Homeowners must:</strong>
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Ensure work sites are reasonably safe</li>
            <li>Disclose known hazards (e.g., asbestos, electrical issues)</li>
            <li>Not interfere with safety procedures</li>
            <li>Obtain necessary permits and consents</li>
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            6.6 User Indemnification
          </Typography>
          <Typography paragraph fontWeight="bold">
            You agree to indemnify, defend, and hold harmless Tradirise and its
            owner from any and all claims, damages, losses, liabilities, costs,
            and expenses (including reasonable legal fees) arising from:
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Your use of the Platform</li>
            <li>Your breach of these Terms</li>
            <li>Your violation of any laws or regulations</li>
            <li>
              Work performed by or for you through connections made on the
              Platform
            </li>
            <li>Disputes with other users</li>
            <li>Content you post or submit</li>
            <li>
              Any injury, property damage, or loss arising from work arranged
              through the Platform
            </li>
            <li>
              Your failure to verify qualifications, insurance, or licenses
            </li>
            <li>Safety violations or Building Code breaches</li>
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            6.7 Endorsements & Recommendations
          </Typography>

          <Typography paragraph>
            The Platform may allow users to endorse or recommend businesses or
            tradespeople.
          </Typography>

          <Typography paragraph fontWeight="medium">
            Endorsements and recommendations:
          </Typography>

          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Represent personal opinions of individual users only</li>
            <li>Are not reviews, ratings, certifications, or guarantees</li>
            <li>
              Do not constitute verification of work quality, licensing, or
              insurance
            </li>
            <li>
              Do not represent endorsement, approval, or recommendation by
              Tradirise
            </li>
          </Typography>

          <Typography paragraph>
            Only positive endorsements or recommendations may be displayed. The
            absence of negative feedback does not imply overall performance,
            suitability, or reliability.
          </Typography>

          <Typography paragraph fontWeight="medium">
            You remain solely responsible for conducting your own due diligence
            before engaging any business or individual.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            7. Prohibited Conduct
          </Typography>
          <Typography paragraph>You must NOT:</Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>
              Impersonate others or provide false, misleading, or inaccurate
              information
            </li>
            <li>Post fraudulent or misleading listings</li>
            <li>Harass, threaten, intimidate, or abuse other users</li>
            <li>
              Attempt to circumvent the Platform to avoid fees (e.g., exchanging
              contact details to transact off-platform)
            </li>
            <li>Scrape, harvest, or collect user data without authorization</li>
            <li>Post content that infringes intellectual property rights</li>
            <li>Violate any laws or regulations</li>
            <li>Use the Platform for illegal activities</li>
            <li>
              Manipulate, fabricate, or incentivize endorsements,
              recommendations, or reputation signals
            </li>
            <li>Share account credentials with others</li>
            <li>Post spam, advertisements, or irrelevant content</li>
            <li>Interfere with the Platform&#39;s operation or security</li>
          </Typography>
          <Typography paragraph fontWeight="medium">
            Violation may result in immediate account termination, forfeiture of
            subscription fees, and potential legal action.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            8. User Content and Intellectual Property
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
            9. Disclaimers
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            9.1 &#34;As Is&#34; Service
          </Typography>
          <Typography paragraph fontWeight="bold">
            THE PLATFORM IS PROVIDED &#34;AS IS&#34; AND &#34;AS AVAILABLE&#34;
            WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
            BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, OR NON-INFRINGEMENT.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            9.2 No Guarantees
          </Typography>
          <Typography paragraph>We do NOT guarantee:</Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>
              The accuracy, completeness, or reliability of any listings,
              profiles, or user information
            </li>
            <li>
              That the Platform will always be available, secure, or error-free
            </li>
            <li>
              That users are licensed, insured, qualified, or suitable for any
              purpose
            </li>
            <li>
              That jobs, opportunities, or listings are legitimate, appropriate,
              or legal
            </li>
            <li>
              The quality, safety, timeliness, or legality of work or services
            </li>
            <li>
              That connections made through the Platform will result in
              satisfactory outcomes
            </li>
            <li>
              Compliance with Building Code, safety regulations, or trade
              standards
            </li>
          </Typography>
          <Typography paragraph fontWeight="medium">
            Users interact with each other entirely at their own risk.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            10. Limitation of Liability
          </Typography>
          <Typography paragraph fontWeight="bold">
            TO THE MAXIMUM EXTENT PERMITTED BY NEW ZEALAND LAW, TRADIRISE AND
            ITS OWNER SHALL NOT BE LIABLE FOR:
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>
              Any indirect, incidental, special, consequential, or punitive
              damages
            </li>
            <li>
              Loss of profits, revenue, data, goodwill, or business
              opportunities
            </li>
            <li>
              Personal injury or property damage arising from work arranged
              through the Platform (except where caused by our gross negligence
              or willful misconduct)
            </li>
            <li>
              Work quality issues, delays, cancellations, or disputes between
              users
            </li>
            <li>
              Safety violations, Building Code breaches, or regulatory
              non-compliance
            </li>
            <li>Fraudulent conduct by users</li>
            <li>
              Any amount exceeding the total subscription fees you paid in the
              12 months prior to the event giving rise to the claim, or $1,000
              NZD, whichever is less
            </li>
          </Typography>
          <Typography paragraph fontWeight="medium" sx={{ mt: 2 }}>
            This limitation applies regardless of the form of action, whether in
            contract, tort (including negligence), statute, or otherwise.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            11. Consumer Guarantees Act 1993
          </Typography>
          <Typography paragraph>
            Nothing in these Terms limits any rights you may have under the
            Consumer Guarantees Act 1993 where that Act applies to you as a
            consumer. However, if you are acquiring the Platform services for
            business purposes, you acknowledge and agree that the provisions of
            the Consumer Guarantees Act 1993 do not apply.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            12. Dispute Resolution
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            12.1 Direct Resolution
          </Typography>
          <Typography paragraph>
            Users must first attempt to resolve any disputes directly with each
            other in good faith. The Platform may provide messaging tools but is
            not responsible for facilitating or mediating disputes.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            12.2 Platform Mediation (Optional)
          </Typography>
          <Typography paragraph>
            If direct resolution fails, parties may request non-binding
            mediation assistance through the Platform. We are not obligated to
            provide this service and any mediation we provide is informal and
            without prejudice.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            12.3 Disputes Tribunal
          </Typography>
          <Typography paragraph>
            For disputes under $30,000 NZD (or $35,000 with consent), parties
            agree to use the New Zealand Disputes Tribunal as the primary forum
            for resolution before pursuing other legal action.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            12.4 No Class Actions
          </Typography>
          <Typography paragraph fontWeight="medium">
            You agree that any claims against Tradirise must be brought
            individually and not as part of any class action, collective action,
            or representative proceeding. You waive any right to participate in
            a class action against Tradirise.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            13. Changes to Terms
          </Typography>
          <Typography paragraph>
            We may update these Terms from time to time by posting the revised
            version on the Platform with an updated &#34;Last Updated&#34; date.
            Material changes will be notified via email or prominent notice on
            the Platform. Continued use of the Platform after changes
            constitutes acceptance of the revised Terms.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            14. Governing Law & Jurisdiction
          </Typography>
          <Typography paragraph>
            These Terms are governed by and construed in accordance with the
            laws of New Zealand. You agree to submit to the non-exclusive
            jurisdiction of the courts of New Zealand for resolution of any
            disputes.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            15. Severability
          </Typography>
          <Typography paragraph>
            If any provision of these Terms is found to be invalid or
            unenforceable, the remaining provisions shall continue in full force
            and effect. The invalid provision shall be modified to the minimum
            extent necessary to make it valid and enforceable.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            16. Contact Us
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
