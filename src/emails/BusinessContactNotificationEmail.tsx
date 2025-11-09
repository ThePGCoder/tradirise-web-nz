// emails/BusinessContactNotificationEmail.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface BusinessContactNotificationEmailProps {
  businessName: string;
  businessType: string;
  businessId: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
  companyName?: string;
}

export const BusinessContactNotificationEmail = ({
  businessName,

  businessId,
  senderName,
  senderEmail,
  senderPhone,
  message,
  companyName,
}: BusinessContactNotificationEmailProps) => {
  const previewText = `New inquiry from ${senderName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Business Inquiry</Heading>

          <Text style={text}>Hi {businessName},</Text>

          <Text style={text}>
            You&#39;ve received a new inquiry for your business.
          </Text>

          <Section style={section}>
            <Heading as="h2" style={h2}>
              Contact Details
            </Heading>
            <Text style={detailText}>
              <strong>Name:</strong> {senderName}
            </Text>
            <Text style={detailText}>
              <strong>Email:</strong>{" "}
              <Link href={`mailto:${senderEmail}`} style={link}>
                {senderEmail}
              </Link>
            </Text>
            {senderPhone && (
              <Text style={detailText}>
                <strong>Phone:</strong> {senderPhone}
              </Text>
            )}
            {companyName && (
              <Text style={detailText}>
                <strong>Company:</strong> {companyName}
              </Text>
            )}
          </Section>

          <Section style={messageSection}>
            <Heading as="h2" style={h2}>
              Message
            </Heading>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Section style={buttonSection}>
            <Link
              href={`${process.env.NEXT_PUBLIC_APP_URL}/businesses/${businessId}`}
              style={button}
            >
              View Your Business Profile
            </Link>
          </Section>

          <Text style={footerText}>
            Reply directly to this email to contact {senderName}.
          </Text>

          <Text style={footerText}>
            Best regards,
            <br />
            The TradeFort Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default BusinessContactNotificationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
};

const h2 = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "16px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 40px",
};

const detailText = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 0",
};

const section = {
  padding: "24px 40px",
  backgroundColor: "#f8f9fa",
  borderRadius: "4px",
  margin: "24px 40px",
};

const messageSection = {
  padding: "24px 40px",
  backgroundColor: "#f0f7ff",
  borderRadius: "4px",
  margin: "24px 40px",
  borderLeft: "4px solid #0066cc",
};

const messageText = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "24px",
  whiteSpace: "pre-wrap" as const,
  margin: "0",
};

const buttonSection = {
  padding: "24px 40px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#0066cc",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};

const link = {
  color: "#0066cc",
  textDecoration: "underline",
};

const footerText = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "24px",
  padding: "0 40px",
  marginTop: "24px",
};
