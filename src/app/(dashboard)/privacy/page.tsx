import CustomCard from "@/components/CustomCard";
import { Box, Button, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function PrivacyPage() {
  return (
    <Box py={4}>
      <CustomCard>
        <CardContent>
          {/* Back button */}
          <Link href="/register" passHref style={{ textDecoration: "none" }}>
            <Button startIcon={<Icon icon="mdi:arrow-left" />} sx={{ mb: 2 }}>
              Back
            </Button>
          </Link>

          <Typography variant="h3" component="h1" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last Updated: November 3, 2025
          </Typography>

          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              1. Introduction
            </Typography>
            <Typography paragraph>
              Tradelists NZ (&#34;we&#34;, &#34;us&#34;, &#34;our&#34;) is
              committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your personal
              information when you use our Platform.
            </Typography>
            <Typography paragraph>
              Tradelists NZ is operated as a sole proprietorship based in
              Wellington, New Zealand, and is subject to the Privacy Act 2020
              (New Zealand).
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
              <li>Name and contact information (email, phone)</li>
              <li>Username and password</li>
              <li>Business name and registration details (if applicable)</li>
              <li>Profile information (skills, experience, certifications)</li>
              <li>Job listings and service requests</li>
              <li>Messages sent through the Platform</li>
              <li>Reviews and ratings</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              2.2 Automatically Collected Information
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and usage patterns</li>
              <li>Cookies and tracking technologies</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              2.3 Payment Information
            </Typography>
            <Typography paragraph>
              Payment information is collected and processed securely by Stripe.
              We do not store full credit card details on our servers. We may
              retain transaction history and payment receipts for accounting and
              tax compliance.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              3. How We Use Your Information
            </Typography>
            <Typography paragraph>We use your information to:</Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>Create and manage your account</li>
              <li>Facilitate job postings and user connections</li>
              <li>Enable secure messaging between users</li>
              <li>Process payments and subscriptions</li>
              <li>Send transactional emails and notifications</li>
              <li>Provide customer support</li>
              <li>Improve and personalise the Platform</li>
              <li>Detect and prevent fraud and abuse</li>
              <li>Comply with legal and regulatory obligations</li>
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              4. How We Share Your Information
            </Typography>
            <Typography variant="h6" gutterBottom>
              4.1 With Other Users
            </Typography>
            <Typography paragraph>
              Your profile information, listings, and reviews are visible to
              other users. Messages are private between sender and recipient.
            </Typography>

            <Typography variant="h6" gutterBottom>
              4.2 Service Providers
            </Typography>
            <Typography paragraph>
              We may share information with third-party providers that support
              our operations, including:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>Stripe (payment processing)</li>
              <li>Cloud hosting and storage (e.g. AWS, Google Cloud)</li>
              <li>Email and notification services</li>
              <li>Analytics and monitoring tools</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              4.3 Overseas Data Storage
            </Typography>
            <Typography paragraph>
              Some of our service providers may store or process information
              outside New Zealand (e.g., in Australia, the US, or the EU). Where
              this occurs, we ensure comparable safeguards are in place in
              accordance with the Privacy Act 2020.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              4.4 Legal Requirements
            </Typography>
            <Typography paragraph>
              We may disclose your information if required by law or in response
              to lawful requests, subpoenas, or investigations by authorities.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              5. Data Security
            </Typography>
            <Typography paragraph>
              We implement reasonable security measures including encryption,
              secure authentication, and regular reviews. However, no method of
              transmission or storage is completely secure, and we cannot
              guarantee absolute security.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              6. Your Rights
            </Typography>
            <Typography paragraph>You have the right to:</Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your data in a portable format</li>
            </Typography>
            <Typography paragraph>
              To exercise these rights, please contact us using the details
              below. We may need to verify your identity before processing
              requests.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              7. Cookies
            </Typography>
            <Typography paragraph>
              We use cookies and similar technologies for essential
              functionality, analytics, and improving your experience. You can
              control cookies through your browser settings, but disabling them
              may affect Platform performance.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              8. Data Retention
            </Typography>
            <Typography paragraph>
              We retain your information while your account is active or as
              required for the purposes described in this policy. When you
              delete your account, most personal information is deleted within
              30 days, though some records may be retained as required by law.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              9. Marketing Communications
            </Typography>
            <Typography paragraph>
              We may send you marketing or promotional messages if you have
              opted in. You can withdraw consent or unsubscribe at any time by
              following the link in our emails or contacting us directly.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              10. Children
            </Typography>
            <Typography paragraph>
              Our Platform is intended for users aged 18 and over. We do not
              knowingly collect personal information from minors.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              11. Changes to This Policy
            </Typography>
            <Typography paragraph>
              We may update this Privacy Policy from time to time. The updated
              version will be posted on this page, and the “Last Updated” date
              will be revised accordingly.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              12. Contact Us
            </Typography>
            <Typography paragraph>
              For any privacy-related questions, requests, or complaints, please
              contact:
            </Typography>
            <Typography paragraph>
              Email: thepgcoder@gmail.com
              <br />
              Based in Wellington, New Zealand
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              13. Privacy Commissioner (New Zealand)
            </Typography>
            <Typography paragraph>
              If you believe we have breached your privacy rights, you may
              contact the Office of the Privacy Commissioner:
            </Typography>
            <Typography paragraph>
              Website: www.privacy.org.nz
              <br />
              Phone: 0800 803 909
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 6 }}>
              © 2025 Tradelists NZ — All rights reserved.
            </Typography>
          </Box>
        </CardContent>
      </CustomCard>
    </Box>
  );
}
