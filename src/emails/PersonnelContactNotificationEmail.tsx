// emails/ContactNotificationEmail.tsx
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
  Button,
} from "@react-email/components";
import * as React from "react";

interface PersonnelContactNotificationEmailProps {
  ownerName: string;
  personnelRole: string;
  personnelId: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
  companyName?: string;
}

export const PersonnelContactNotificationEmail = ({
  ownerName = "John Doe",
  personnelRole = "Electrician",
  personnelId = "123",
  senderName = "Jane Smith",
  senderEmail = "jane@example.com",
  senderPhone,
  message = "I would like to discuss this opportunity.",
  companyName,
}: PersonnelContactNotificationEmailProps) => {
  const previewText = `New contact request from ${senderName} for your ${personnelRole} listing`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Request</Heading>

          <Text style={text}>Hi {ownerName},</Text>

          <Text style={text}>
            You&#39;ve received a new contact request for your{" "}
            <strong>{personnelRole}</strong> listing.
          </Text>

          <Section style={contactBox}>
            <Heading as="h2" style={h2}>
              Contact Details
            </Heading>

            <Text style={contactItem}>
              <strong>Name:</strong> {senderName}
            </Text>

            <Text style={contactItem}>
              <strong>Email:</strong>{" "}
              <Link href={`mailto:${senderEmail}`} style={link}>
                {senderEmail}
              </Link>
            </Text>

            {senderPhone && (
              <Text style={contactItem}>
                <strong>Phone:</strong>{" "}
                <Link href={`tel:${senderPhone}`} style={link}>
                  {senderPhone}
                </Link>
              </Text>
            )}

            {companyName && (
              <Text style={contactItem}>
                <strong>Company:</strong> {companyName}
              </Text>
            )}
          </Section>

          <Section style={messageBox}>
            <Heading as="h2" style={h2}>
              Message
            </Heading>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Section style={buttonContainer}>
            <Button
              style={button}
              href={`${process.env.NEXT_PUBLIC_APP_URL}/personnel/${personnelId}`}
            >
              View Listing
            </Button>
          </Section>

          <Text style={footer}>
            Reply directly to this email to contact {senderName}, or use the
            contact details above.
          </Text>

          <Text style={footerGray}>
            This is an automated notification from your personnel listing
            platform.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PersonnelContactNotificationEmail;

// Styles
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
  maxWidth: "600px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "40px 0 20px",
  padding: "0 40px",
};

const h2 = {
  color: "#1a1a1a",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 15px",
};

const text = {
  color: "#484848",
  fontSize: "16px",
  lineHeight: "24px",
  padding: "0 40px",
  margin: "0 0 10px",
};

const contactBox = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  margin: "24px 40px",
  padding: "24px",
  border: "1px solid #e1e4e8",
};

const contactItem = {
  color: "#484848",
  fontSize: "15px",
  lineHeight: "22px",
  margin: "8px 0",
};

const messageBox = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  margin: "24px 40px",
  padding: "24px",
  border: "1px solid #e1e4e8",
};

const messageText = {
  color: "#484848",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const link = {
  color: "#1976d2",
  textDecoration: "underline",
};

const buttonContainer = {
  padding: "0 40px",
  margin: "32px 0",
};

const button = {
  backgroundColor: "#1976d2",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
};

const footer = {
  color: "#484848",
  fontSize: "14px",
  lineHeight: "20px",
  padding: "0 40px",
  margin: "32px 0 0",
};

const footerGray = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  padding: "0 40px",
  margin: "8px 0 0",
};
