import CustomCard from "@/components/CustomCard";
import { Box, Button, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function TermsPage() {
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
            Terms of Service
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last Updated: November 3, 2025
          </Typography>

          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              1. Acceptance of Terms
            </Typography>
            <Typography paragraph>
              By accessing or using Tradelists NZ (&#34;the Platform&#34;,
              &#34;we&#34;, &#34;us&#34;, &#34;our&#34;), you agree to these
              Terms of Service. If you do not agree, you must not use the
              Platform.
            </Typography>
            <Typography paragraph>
              Tradelists NZ is operated as a sole proprietorship based in
              Wellington, New Zealand.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              2. Description of Service
            </Typography>
            <Typography paragraph>
              Tradelists NZ is an online job board and marketplace connecting:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>Homeowners seeking trade services</li>
              <li>Employers seeking to hire tradespeople</li>
              <li>Tradespeople and businesses offering trade services</li>
            </Typography>
            <Typography paragraph>
              We provide tools for posting and responding to listings,
              messaging, and managing connections. Payments are handled securely
              through Stripe.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              3. Eligibility
            </Typography>
            <Typography paragraph>
              You must be at least 18 years old to use the Platform. By using
              the Platform, you confirm that you have the legal capacity to
              enter into these Terms and to use the services lawfully.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              4. User Accounts
            </Typography>
            <Typography variant="h6" gutterBottom>
              4.1 Account Creation
            </Typography>
            <Typography paragraph>
              To access certain features, you must register an account and
              provide accurate and complete information. You agree to keep your
              details up to date.
            </Typography>

            <Typography variant="h6" gutterBottom>
              4.2 Account Security
            </Typography>
            <Typography paragraph>
              You are responsible for maintaining the confidentiality of your
              login credentials and all activities that occur under your
              account. Notify us immediately of any unauthorised access or
              suspected breach.
            </Typography>

            <Typography variant="h6" gutterBottom>
              4.3 Termination or Suspension
            </Typography>
            <Typography paragraph>
              We reserve the right to suspend or terminate any account at our
              discretion, including for misuse of the Platform, fraudulent
              activity, or breach of these Terms.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
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

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              6. User Responsibilities
            </Typography>
            <Typography paragraph>
              You are solely responsible for your conduct and for verifying the
              identity, qualifications, and suitability of other users you
              interact with. Tradelists NZ does not vet or endorse any
              particular tradesperson, job, or business.
            </Typography>
            <Typography paragraph>
              You agree to comply with all applicable laws and regulations when
              using the Platform.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              7. User Content and Intellectual Property
            </Typography>
            <Typography paragraph>
              You retain ownership of all content you upload, such as profiles,
              job listings, and reviews. By posting on the Platform, you grant
              Tradelists NZ a non-exclusive, royalty-free, worldwide licence to
              use, display, and distribute that content for the operation and
              promotion of the Platform.
            </Typography>
            <Typography paragraph>
              All Platform materials, branding, software, and design are the
              intellectual property of Tradelists NZ and may not be copied,
              modified, or distributed without our prior written consent.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              8. Disclaimers
            </Typography>
            <Typography variant="h6" gutterBottom>
              8.1 &#34;As Is&#34; Service
            </Typography>
            <Typography paragraph fontWeight="bold">
              THE PLATFORM IS PROVIDED &#34;AS IS&#34; AND &#34;AS
              AVAILABLE&#34; WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO FITNESS FOR A PARTICULAR
              PURPOSE OR NON-INFRINGEMENT.
            </Typography>

            <Typography variant="h6" gutterBottom>
              8.2 No Guarantees
            </Typography>
            <Typography paragraph>We do not guarantee:</Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>The accuracy or completeness of any listings or profiles</li>
              <li>That the Platform will always be secure or error-free</li>
              <li>That users are licensed, insured, or suitable</li>
              <li>That jobs or opportunities are legitimate or appropriate</li>
              <li>
                The quality of work, services, or outcomes of any connections
                made through the Platform
              </li>
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              9. Limitation of Liability
            </Typography>
            <Typography paragraph fontWeight="bold">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRADELISTS NZ AND ITS
              OWNER SHALL NOT BE LIABLE FOR:
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

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              10. Consumer Guarantees Act 1993
            </Typography>
            <Typography paragraph>
              Nothing in these Terms limits any rights you may have under the
              Consumer Guarantees Act 1993 where that Act applies. However, if
              you are using the Platform for business purposes, you agree that
              the provisions of the Consumer Guarantees Act do not apply.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              11. Changes to Terms
            </Typography>
            <Typography paragraph>
              We may update these Terms from time to time. Any changes will be
              effective when posted on the Platform. Continued use of the
              Platform after updates constitutes acceptance of the revised
              Terms.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              12. Governing Law & Jurisdiction
            </Typography>
            <Typography paragraph>
              These Terms are governed by and construed in accordance with the
              laws of New Zealand. You agree to submit to the exclusive
              jurisdiction of the courts of New Zealand.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
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

            <Typography variant="body2" color="text.secondary" sx={{ mt: 6 }}>
              © 2025 Tradelists NZ — All rights reserved.
            </Typography>
          </Box>
        </CardContent>
      </CustomCard>
    </Box>
  );
}
