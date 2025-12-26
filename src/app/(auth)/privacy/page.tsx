"use client";

import CustomCard from "@/components/CustomCard";
import {
  Box,
  Button,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { usePolicyStore } from "@/store/policyStore";

export default function PrivacyPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const privacyViewed = usePolicyStore((state) => state.privacyViewed);
  const setPrivacyViewed = usePolicyStore((state) => state.setPrivacyViewed);
  const [isChecked, setIsChecked] = useState(privacyViewed);

  useEffect(() => {
    setIsChecked(privacyViewed);
  }, [privacyViewed]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 50;

      if (scrolledToBottom && !hasScrolledToBottom) {
        setHasScrolledToBottom(true);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasScrolledToBottom]);

  return (
    <Box
      ref={contentRef}
      p={6}
      sx={{
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <CustomCard>
        <CardContent>
          <Link href="/register" passHref style={{ textDecoration: "none" }}>
            <Button startIcon={<Icon icon="mdi:arrow-left" />} sx={{ mb: 2 }}>
              Back
            </Button>
          </Link>

          <Typography variant="h3" component="h1" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last Updated: December 24, 2024
          </Typography>

          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              1. Introduction
            </Typography>
            <Typography paragraph>
              Tradirise (&#34;we&#34;, &#34;us&#34;, &#34;our&#34;) is committed
              to protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your personal information
              when you use our Platform.
            </Typography>
            <Typography paragraph>
              Tradirise is operated as a sole proprietorship based in
              Wellington, New Zealand, and is subject to the Privacy Act 2020
              (New Zealand). We are committed to complying with the 13 privacy
              principles set out in that Act.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              2. Information We Collect
            </Typography>
            <Typography variant="h6" gutterBottom>
              2.1 Information You Provide
            </Typography>
            <Typography paragraph>
              When you register and use our Platform, we collect personal
              information for the purpose of operating and improving our
              services, connecting users, processing payments, and complying
              with our legal obligations. This includes:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>
                Name and contact information (email, phone number, address)
              </li>
              <li>Username and password</li>
              <li>
                Business name, NZBN, and registration details (if applicable)
              </li>
              <li>
                Profile information (trade skills, experience, certifications,
                licenses)
              </li>
              <li>
                Professional credentials (LBP number, trade registrations)
              </li>
              <li>Insurance details (policy numbers, coverage amounts)</li>
              <li>Job listings and service requests</li>
              <li>Messages sent through the Platform</li>
              <li>Reviews and ratings you provide or receive</li>
              <li>Photos and documents you upload</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              2.2 Automatically Collected Information
            </Typography>
            <Typography paragraph>
              We automatically collect technical information when you use the
              Platform:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>IP address and device information</li>
              <li>Browser type, version, and settings</li>
              <li>Operating system</li>
              <li>Pages visited, time spent, and usage patterns</li>
              <li>Referral source</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Location data (if you enable location services)</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              2.3 Payment Information
            </Typography>
            <Typography paragraph>
              Payment information is collected and processed securely by Stripe,
              our third-party payment processor. We do NOT store full credit
              card details on our servers. We may retain:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>Transaction records for 7 years (IRD requirement)</li>
              <li>Invoices and receipts for tax compliance</li>
              <li>Subscription history and payment status</li>
              <li>Last 4 digits of card numbers for identification purposes</li>
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              3. How We Use Your Information
            </Typography>
            <Typography paragraph>
              We use your information for the following purposes:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>Create and manage your account</li>
              <li>Facilitate job postings and user connections</li>
              <li>Enable secure messaging between users</li>
              <li>Display your profile to other users</li>
              <li>Process payments and manage subscriptions</li>
              <li>
                Send transactional emails and notifications (job alerts, message
                notifications, payment receipts)
              </li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Improve and personalize the Platform experience</li>
              <li>
                Conduct analytics to understand Platform usage and performance
              </li>
              <li>
                Detect, prevent, and address fraud, abuse, and security issues
              </li>
              <li>
                Comply with legal obligations, including tax reporting and law
                enforcement requests
              </li>
              <li>
                Send marketing communications (only with your consent, and you
                may opt out)
              </li>
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              4. How We Share Your Information
            </Typography>
            <Typography variant="h6" gutterBottom>
              4.1 With Other Users
            </Typography>
            <Typography paragraph>
              Your profile information, listings, reviews, and ratings are
              visible to other users of the Platform. This is necessary for the
              Platform to function as a marketplace. Messages are private
              between sender and recipient and are not visible to other users.
            </Typography>

            <Typography variant="h6" gutterBottom>
              4.2 Service Providers
            </Typography>
            <Typography paragraph>
              We share information with trusted third-party service providers
              that support our operations, including:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>
                <strong>Stripe</strong> (payment processing)
              </li>
              <li>
                <strong>Cloud hosting providers</strong> (e.g., AWS, Google
                Cloud, Vercel) for Platform infrastructure
              </li>
              <li>
                <strong>Email services</strong> (e.g., SendGrid, Mailgun) for
                transactional and marketing emails
              </li>
              <li>
                <strong>Analytics tools</strong> (e.g., Google Analytics) for
                usage monitoring
              </li>
              <li>
                <strong>Customer support tools</strong> for managing inquiries
              </li>
            </Typography>
            <Typography paragraph>
              These providers are contractually obligated to protect your
              information and use it only for the purposes we specify.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              4.3 Overseas Data Storage and Processing
            </Typography>
            <Typography paragraph>
              Some of our service providers may store or process information
              outside New Zealand, including in Australia, the United States, or
              the European Union. Where this occurs, we ensure:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>
                Comparable safeguards are in place in accordance with the
                Privacy Act 2020
              </li>
              <li>
                Service providers comply with appropriate data protection
                standards
              </li>
              <li>Contractual protections are in place</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              4.4 Legal Requirements and Law Enforcement
            </Typography>
            <Typography paragraph>
              We may disclose your information if required or permitted by law,
              including:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>
                In response to lawful requests, court orders, subpoenas, or
                legal processes
              </li>
              <li>
                To comply with applicable laws, regulations, or legal
                obligations
              </li>
              <li>
                To cooperate with law enforcement or other government
                investigations
              </li>
              <li>
                To protect our rights, property, or safety, or that of our users
                or the public
              </li>
              <li>
                To prevent or investigate fraud, security issues, or violations
                of our Terms
              </li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              4.5 Business Transfers
            </Typography>
            <Typography paragraph>
              If Tradirise is sold, merged, acquired, or undergoes a business
              restructuring, your information may be transferred to the new
              owner as part of that transaction. We will notify you via email
              and/or a prominent notice on the Platform before your information
              is transferred and becomes subject to a different privacy policy.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              5. Data Security
            </Typography>
            <Typography variant="h6" gutterBottom>
              5.1 Security Measures
            </Typography>
            <Typography paragraph>
              We implement reasonable technical and organizational security
              measures to protect your information, including:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>Encryption of data in transit (HTTPS/TLS)</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Secure authentication mechanisms (password hashing)</li>
              <li>Regular security reviews and updates</li>
              <li>Access controls and authorization systems</li>
              <li>Monitoring for suspicious activity</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              5.2 Limitations
            </Typography>
            <Typography paragraph>
              However, no method of transmission over the internet or electronic
              storage is 100% secure. While we strive to protect your
              information, we cannot guarantee absolute security. You are
              responsible for maintaining the confidentiality of your account
              credentials.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              5.3 Data Breach Notification
            </Typography>
            <Typography paragraph>
              In the event of a privacy breach that causes or is likely to cause
              serious harm to any individuals, we will:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>
                Notify affected individuals as soon as practicable (unless an
                exception applies)
              </li>
              <li>
                Notify the Office of the Privacy Commissioner as required by the
                Privacy Act 2020
              </li>
              <li>Take reasonable steps to contain and remedy the breach</li>
              <li>
                Provide information about the breach, its consequences, and
                steps you can take to protect yourself
              </li>
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              6. Your Rights
            </Typography>
            <Typography paragraph>
              Under the Privacy Act 2020, you have the following rights:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>
                <strong>Access:</strong> Request access to the personal
                information we hold about you
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate or
                incomplete information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and
                associated data (subject to legal retention requirements)
              </li>
              <li>
                <strong>Portability:</strong> Request a copy of your data in a
                commonly used, machine-readable format
              </li>
              <li>
                <strong>Marketing opt-out:</strong> Unsubscribe from marketing
                communications at any time
              </li>
              <li>
                <strong>Complaint:</strong> Lodge a complaint with us or the
                Privacy Commissioner if you believe we have breached your
                privacy
              </li>
            </Typography>
            <Typography paragraph sx={{ mt: 2 }}>
              To exercise these rights, please contact us using the details in
              Section 13. We may need to verify your identity before processing
              requests. We will respond to requests within a reasonable
              timeframe, typically within 20 working days.
            </Typography>
            <Typography paragraph>
              Please note that some information may be retained as required by
              law (e.g., tax records must be kept for 7 years) even after you
              request deletion.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              7. Cookies and Tracking Technologies
            </Typography>
            <Typography variant="h6" gutterBottom>
              7.1 What We Use
            </Typography>
            <Typography paragraph>
              We use cookies and similar technologies for:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>
                <strong>Essential cookies:</strong> Required for Platform
                functionality (login, security, preferences)
              </li>
              <li>
                <strong>Analytics cookies:</strong> Understanding how you use
                the Platform
              </li>
              <li>
                <strong>Performance cookies:</strong> Improving Platform speed
                and reliability
              </li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              7.2 Your Control
            </Typography>
            <Typography paragraph>
              You can control cookies through your browser settings. However,
              disabling certain cookies may affect Platform functionality. Most
              browsers allow you to:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>View and delete cookies</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies (may break Platform functionality)</li>
              <li>Receive warnings before cookies are stored</li>
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              8. Data Retention
            </Typography>
            <Typography paragraph>
              We retain your information for as long as necessary to fulfill the
              purposes described in this policy, unless a longer retention
              period is required or permitted by law.
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>
                <strong>Active accounts:</strong> Information retained while
                your account is active
              </li>
              <li>
                <strong>Deleted accounts:</strong> Most personal information
                deleted within 30 days, except:
                <ul style={{ marginTop: "8px" }}>
                  <li>Transaction records (7 years for tax compliance)</li>
                  <li>
                    Legal or regulatory retention requirements (e.g., dispute
                    records)
                  </li>
                  <li>
                    Aggregated, anonymized data for analytics (indefinitely)
                  </li>
                </ul>
              </li>
              <li>
                <strong>Reviews and ratings:</strong> May be retained in
                anonymized form after account deletion
              </li>
              <li>
                <strong>Backups:</strong> Information in backups deleted
                according to our backup retention schedule
              </li>
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              9. Marketing Communications
            </Typography>
            <Typography paragraph>
              We may send you marketing or promotional messages about Platform
              features, updates, or related services if:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>You have opted in to receive marketing communications</li>
              <li>
                We have a legitimate business reason and you have not opted out
              </li>
            </Typography>
            <Typography paragraph>
              You can withdraw consent or unsubscribe at any time by:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>Clicking the unsubscribe link in any marketing email</li>
              <li>Updating your preferences in your account settings</li>
              <li>Contacting us directly (see Section 13)</li>
            </Typography>
            <Typography paragraph>
              Note: You cannot opt out of transactional emails (e.g., payment
              receipts, security alerts, Terms updates) as these are necessary
              for the Platform&#39;s operation.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              10. Children&#39;s Privacy
            </Typography>
            <Typography paragraph>
              Our Platform is intended for users aged 18 and over. We do not
              knowingly collect personal information from minors under 18. If we
              become aware that we have collected information from a minor, we
              will take steps to delete it promptly. If you believe we have
              information about a minor, please contact us immediately.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              11. Third-Party Links
            </Typography>
            <Typography paragraph>
              The Platform may contain links to third-party websites or services
              (e.g., social media, external resources). We are not responsible
              for the privacy practices of these third parties. We encourage you
              to review their privacy policies before providing any information.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              12. Changes to This Policy
            </Typography>
            <Typography paragraph>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices, legal requirements, or for other
              operational reasons. When we make material changes, we will:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>Update the &#34;Last Updated&#34; date at the top</li>
              <li>Post the revised policy on this page</li>
              <li>
                Notify you via email or prominent notice on the Platform for
                significant changes
              </li>
            </Typography>
            <Typography paragraph>
              Your continued use of the Platform after changes take effect
              constitutes acceptance of the updated policy.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              13. Contact Us
            </Typography>
            <Typography paragraph>
              For any privacy-related questions, requests to exercise your
              rights, or complaints, please contact:
            </Typography>
            <Typography paragraph>
              <strong>Tradirise</strong>
              <br />
              Email: thepgcoder@gmail.com
              <br />
              Based in Wellington, New Zealand
            </Typography>
            <Typography paragraph>
              We aim to respond to all inquiries within 20 working days.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              14. Privacy Commissioner (New Zealand)
            </Typography>
            <Typography paragraph>
              If you believe we have breached your privacy rights or you are
              unsatisfied with our response to your complaint, you may contact
              the Office of the Privacy Commissioner:
            </Typography>
            <Typography paragraph>
              <strong>Office of the Privacy Commissioner</strong>
              <br />
              Website:{" "}
              <a
                href="https://www.privacy.org.nz"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.privacy.org.nz
              </a>
              <br />
              Phone: 0800 803 909
              <br />
              Email: enquiries@privacy.org.nz
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 6 }}>
              © 2025 Tradirise — All rights reserved.
            </Typography>
          </Box>

          {!hasScrolledToBottom && (
            <Box
              sx={{
                position: "fixed",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "primary.main",
                color: "white",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                boxShadow: 3,
                zIndex: 1000,
              }}
            >
              <Icon icon="mdi:arrow-down" height={20} />
              <Typography variant="body2">
                Scroll to bottom to accept
              </Typography>
            </Box>
          )}

          {hasScrolledToBottom && (
            <Box
              sx={{
                mt: 4,
                p: 2,
                border: "2px solid",
                borderColor: "primary.main",
                borderRadius: 2,
                backgroundColor: "action.hover",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) => {
                      setIsChecked(e.target.checked);
                      setPrivacyViewed(e.target.checked);
                    }}
                  />
                }
                label={
                  <Typography variant="body2" fontWeight="medium">
                    I have read and agree to this Privacy Policy
                  </Typography>
                }
              />
              {isChecked && (
                <Box sx={{ mt: 2 }}>
                  <Link
                    href="/register"
                    passHref
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Icon icon="mdi:arrow-left" />}
                    >
                      Return to Registration
                    </Button>
                  </Link>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </CustomCard>
    </Box>
  );
}
