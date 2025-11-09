// lib/emailService.ts - Mailjet version with notification preferences

import Mailjet from "node-mailjet";
import { render } from "@react-email/render";
import PersonnelContactNotificationEmail from "@/emails/PersonnelContactNotificationEmail";
import PositionContactNotificationEmail from "@/emails/PositionContactNotificationEmail";
import ProjectContactNotificationEmail from "@/emails/ProjectContactNotificationEmail";
import BusinessContactNotificationEmail from "@/emails/BusinessContactNotificationEmail";
import { hasEmailNotificationsEnabled } from "@/utils/email-notifications";

// Mailjet TypeScript interfaces
interface MailjetRecipient {
  Email: string;
  MessageUUID: string;
  MessageID: number;
  MessageHref: string;
}

interface MailjetMessage {
  Status: string;
  CustomID?: string;
  To: MailjetRecipient[];
  Cc: MailjetRecipient[];
  Bcc: MailjetRecipient[];
}

interface MailjetResponseBody {
  Messages: MailjetMessage[];
}

interface MailjetResponse {
  body: MailjetResponseBody;
  response: {
    status: number;
    statusText: string;
  };
}

// Initialize Mailjet client
const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY!,
  apiSecret: process.env.MAILJET_API_SECRET!,
});

// ============================================
// PERSONNEL CONTACT EMAILS
// ============================================

interface SendPersonnelContactEmailParams {
  to: string;
  ownerName: string;
  personnelRole: string;
  personnelId: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
  companyName?: string;
  ownerId: string;
}

export async function sendPersonnelContactNotificationEmail(
  params: SendPersonnelContactEmailParams
) {
  try {
    // Check if owner has email notifications enabled
    const notificationsEnabled = await hasEmailNotificationsEnabled(
      params.ownerId
    );

    if (!notificationsEnabled) {
      console.log(
        `Email notifications disabled for user ${params.ownerId} - skipping personnel contact email`
      );
      return {
        success: true,
        skipped: true,
        reason: "notifications_disabled",
      };
    }

    // Render React email to HTML
    const emailHtml = await render(
      PersonnelContactNotificationEmail({
        ownerName: params.ownerName,
        personnelRole: params.personnelRole,
        personnelId: params.personnelId,
        senderName: params.senderName,
        senderEmail: params.senderEmail,
        senderPhone: params.senderPhone,
        message: params.message,
        companyName: params.companyName,
      })
    );

    // Create plain text version (fallback)
    const emailText = `
Hi ${params.ownerName},

You've received a new contact request for your ${params.personnelRole} listing.

Contact Details:
Name: ${params.senderName}
Email: ${params.senderEmail}
${params.senderPhone ? `Phone: ${params.senderPhone}` : ""}
${params.companyName ? `Company: ${params.companyName}` : ""}

Message:
${params.message}

View your listing: ${process.env.NEXT_PUBLIC_APP_URL}/personnel/${params.personnelId}

Reply directly to this email to contact ${params.senderName}.
    `.trim();

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL!,
            Name: process.env.MAILJET_FROM_NAME || "Personnel Platform",
          },
          To: [
            {
              Email: params.to,
              Name: params.ownerName,
            },
          ],
          Subject: `New contact request from ${params.senderName} for your ${params.personnelRole} listing`,
          TextPart: emailText,
          HTMLPart: emailHtml,
          ReplyTo: {
            Email: params.senderEmail,
            Name: params.senderName,
          },
        },
      ],
    });

    const response = (await request) as unknown as MailjetResponse;

    console.log(
      "Personnel contact email sent successfully:",
      response.body.Messages[0].Status
    );
    return {
      success: true,
      messageId: response.body.Messages[0].To[0].MessageID.toString(),
    };
  } catch (error) {
    console.error("Error sending personnel contact email via Mailjet:", error);
    throw error;
  }
}

// Confirmation emails are always sent (they're sent to the person who initiated contact)
export async function sendPersonnelContactConfirmationEmail(params: {
  to: string;
  senderName: string;
  personnelRole: string;
  ownerName: string;
}) {
  try {
    const emailText = `
Hi ${params.senderName},

Thank you for your interest in the ${params.personnelRole} position.

Your message has been sent to ${params.ownerName}. They will review your inquiry and respond directly to this email address.

Best regards,
The Personnel Platform Team
    `.trim();

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL!,
            Name: process.env.MAILJET_FROM_NAME || "Personnel Platform",
          },
          To: [
            {
              Email: params.to,
              Name: params.senderName,
            },
          ],
          Subject: "Your contact request has been sent",
          TextPart: emailText,
        },
      ],
    });

    const response = (await request) as unknown as MailjetResponse;
    return {
      success: true,
      messageId: response.body.Messages[0].To[0].MessageID.toString(),
    };
  } catch (error) {
    console.error("Error sending personnel confirmation email:", error);
    // Don't throw - confirmation email is not critical
    return { success: false, error };
  }
}

// ============================================
// POSITION CONTACT EMAILS
// ============================================

interface SendPositionContactEmailParams {
  to: string;
  ownerName: string;
  positionTitle: string;
  positionTrade: string;
  positionId: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
  companyName?: string;
  ownerId: string;
}

export async function sendPositionContactNotificationEmail(
  params: SendPositionContactEmailParams
) {
  try {
    // Check if owner has email notifications enabled
    const notificationsEnabled = await hasEmailNotificationsEnabled(
      params.ownerId
    );

    if (!notificationsEnabled) {
      console.log(
        `Email notifications disabled for user ${params.ownerId} - skipping position contact email`
      );
      return {
        success: true,
        skipped: true,
        reason: "notifications_disabled",
      };
    }

    // Render React email to HTML
    const emailHtml = await render(
      PositionContactNotificationEmail({
        ownerName: params.ownerName,
        positionTitle: params.positionTitle,
        positionTrade: params.positionTrade,
        positionId: params.positionId,
        senderName: params.senderName,
        senderEmail: params.senderEmail,
        senderPhone: params.senderPhone,
        message: params.message,
        companyName: params.companyName,
      })
    );

    // Create plain text version (fallback)
    const emailText = `
Hi ${params.ownerName},

You've received a new application for your ${params.positionTitle} position.

Position: ${params.positionTitle}
Trade: ${params.positionTrade}

Applicant Details:
Name: ${params.senderName}
Email: ${params.senderEmail}
${params.senderPhone ? `Phone: ${params.senderPhone}` : ""}
${params.companyName ? `Company: ${params.companyName}` : ""}

Message:
${params.message}

View your listing: ${process.env.NEXT_PUBLIC_APP_URL}/listings/positions/${params.positionId}

Reply directly to this email to contact ${params.senderName}.
    `.trim();

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL!,
            Name: process.env.MAILJET_FROM_NAME || "Personnel Platform",
          },
          To: [
            {
              Email: params.to,
              Name: params.ownerName,
            },
          ],
          Subject: `New application from ${params.senderName} for ${params.positionTitle}`,
          TextPart: emailText,
          HTMLPart: emailHtml,
          ReplyTo: {
            Email: params.senderEmail,
            Name: params.senderName,
          },
        },
      ],
    });

    const response = (await request) as unknown as MailjetResponse;

    console.log(
      "Position application email sent successfully:",
      response.body.Messages[0].Status
    );
    return {
      success: true,
      messageId: response.body.Messages[0].To[0].MessageID.toString(),
    };
  } catch (error) {
    console.error(
      "Error sending position application email via Mailjet:",
      error
    );
    throw error;
  }
}

// Confirmation emails are always sent
export async function sendPositionContactConfirmationEmail(params: {
  to: string;
  senderName: string;
  positionTitle: string;
  ownerName: string;
}) {
  try {
    const emailText = `
Hi ${params.senderName},

Thank you for your interest in the ${params.positionTitle} position.

Your application has been sent to ${params.ownerName}. They will review your inquiry and respond directly to this email address if you're selected.

Best regards,
The Personnel Platform Team
    `.trim();

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL!,
            Name: process.env.MAILJET_FROM_NAME || "Personnel Platform",
          },
          To: [
            {
              Email: params.to,
              Name: params.senderName,
            },
          ],
          Subject: `Your application for ${params.positionTitle} has been sent`,
          TextPart: emailText,
        },
      ],
    });

    const response = (await request) as unknown as MailjetResponse;
    return {
      success: true,
      messageId: response.body.Messages[0].To[0].MessageID.toString(),
    };
  } catch (error) {
    console.error("Error sending position confirmation email:", error);
    // Don't throw - confirmation email is not critical
    return { success: false, error };
  }
}

// ============================================
// PROJECT CONTACT EMAILS
// ============================================

interface SendProjectContactEmailParams {
  to: string;
  ownerName: string;
  projectTitle: string;
  projectType: string;
  projectId: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
  companyName?: string;
  ownerId: string;
}

export async function sendProjectContactNotificationEmail(
  params: SendProjectContactEmailParams
) {
  try {
    // Check if owner has email notifications enabled
    const notificationsEnabled = await hasEmailNotificationsEnabled(
      params.ownerId
    );

    if (!notificationsEnabled) {
      console.log(
        `Email notifications disabled for user ${params.ownerId} - skipping project contact email`
      );
      return {
        success: true,
        skipped: true,
        reason: "notifications_disabled",
      };
    }

    // Render React email to HTML
    const emailHtml = await render(
      ProjectContactNotificationEmail({
        ownerName: params.ownerName,
        projectTitle: params.projectTitle,
        projectType: params.projectType,
        projectId: params.projectId,
        senderName: params.senderName,
        senderEmail: params.senderEmail,
        senderPhone: params.senderPhone,
        message: params.message,
        companyName: params.companyName,
      })
    );

    // Create plain text version (fallback)
    const emailText = `
Hi ${params.ownerName},

You've received a new application for your ${params.projectTitle} project.

Project: ${params.projectTitle}
Type: ${params.projectType}

Applicant Details:
Name: ${params.senderName}
Email: ${params.senderEmail}
${params.senderPhone ? `Phone: ${params.senderPhone}` : ""}
${params.companyName ? `Company: ${params.companyName}` : ""}

Message:
${params.message}

View your listing: ${process.env.NEXT_PUBLIC_APP_URL}/listings/projects/${params.projectId}

Reply directly to this email to contact ${params.senderName}.
    `.trim();

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL!,
            Name: process.env.MAILJET_FROM_NAME || "Personnel Platform",
          },
          To: [
            {
              Email: params.to,
              Name: params.ownerName,
            },
          ],
          Subject: `New application from ${params.senderName} for ${params.projectTitle}`,
          TextPart: emailText,
          HTMLPart: emailHtml,
          ReplyTo: {
            Email: params.senderEmail,
            Name: params.senderName,
          },
        },
      ],
    });

    const response = (await request) as unknown as MailjetResponse;

    console.log(
      "Project application email sent successfully:",
      response.body.Messages[0].Status
    );
    return {
      success: true,
      messageId: response.body.Messages[0].To[0].MessageID.toString(),
    };
  } catch (error) {
    console.error(
      "Error sending project application email via Mailjet:",
      error
    );
    throw error;
  }
}

// Confirmation emails are always sent
export async function sendProjectContactConfirmationEmail(params: {
  to: string;
  senderName: string;
  projectTitle: string;
  projectType: string;
  ownerName: string;
}) {
  try {
    const emailText = `
Hi ${params.senderName},

Thank you for your interest in the ${params.projectTitle} project (${params.projectType}).

Your application has been sent to ${params.ownerName}. They will review your inquiry and respond directly to this email address if you're selected.

Best regards,
The Personnel Platform Team
    `.trim();

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL!,
            Name: process.env.MAILJET_FROM_NAME || "Personnel Platform",
          },
          To: [
            {
              Email: params.to,
              Name: params.senderName,
            },
          ],
          Subject: `Your application for ${params.projectTitle} has been sent`,
          TextPart: emailText,
        },
      ],
    });

    const response = (await request) as unknown as MailjetResponse;
    return {
      success: true,
      messageId: response.body.Messages[0].To[0].MessageID.toString(),
    };
  } catch (error) {
    console.error("Error sending project confirmation email:", error);
    // Don't throw - confirmation email is not critical
    return { success: false, error };
  }
}

// ============================================
// BUSINESS CONTACT EMAILS
// ============================================

interface SendBusinessContactEmailParams {
  to: string;
  businessName: string;
  businessType: string;
  businessId: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
  companyName?: string;
  ownerId: string;
}

export async function sendBusinessContactNotificationEmail(
  params: SendBusinessContactEmailParams
) {
  try {
    // Check if owner has email notifications enabled
    const notificationsEnabled = await hasEmailNotificationsEnabled(
      params.ownerId
    );

    if (!notificationsEnabled) {
      console.log(
        `Email notifications disabled for user ${params.ownerId} - skipping business contact email`
      );
      return {
        success: true,
        skipped: true,
        reason: "notifications_disabled",
      };
    }

    // Render React email to HTML
    const emailHtml = await render(
      BusinessContactNotificationEmail({
        businessName: params.businessName,
        businessType: params.businessType,
        businessId: params.businessId,
        senderName: params.senderName,
        senderEmail: params.senderEmail,
        senderPhone: params.senderPhone,
        message: params.message,
        companyName: params.companyName,
      })
    );

    // Create plain text version (fallback)
    const emailText = `
Hi ${params.businessName},

You've received a new inquiry for your business.

Contact Details:
Name: ${params.senderName}
Email: ${params.senderEmail}
${params.senderPhone ? `Phone: ${params.senderPhone}` : ""}
${params.companyName ? `Company: ${params.companyName}` : ""}

Message:
${params.message}

View your business profile: ${process.env.NEXT_PUBLIC_APP_URL}/businesses/${params.businessId}

Reply directly to this email to contact ${params.senderName}.
    `.trim();

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL!,
            Name: process.env.MAILJET_FROM_NAME || "TradeFort",
          },
          To: [
            {
              Email: params.to,
              Name: params.businessName,
            },
          ],
          Subject: `New inquiry from ${params.senderName}`,
          TextPart: emailText,
          HTMLPart: emailHtml,
          ReplyTo: {
            Email: params.senderEmail,
            Name: params.senderName,
          },
        },
      ],
    });

    const response = (await request) as unknown as MailjetResponse;

    console.log(
      "Business inquiry email sent successfully:",
      response.body.Messages[0].Status
    );
    return {
      success: true,
      messageId: response.body.Messages[0].To[0].MessageID.toString(),
    };
  } catch (error) {
    console.error("Error sending business inquiry email via Mailjet:", error);
    throw error;
  }
}

// Confirmation emails are always sent
export async function sendBusinessContactConfirmationEmail(params: {
  to: string;
  senderName: string;
  businessName: string;
}) {
  try {
    const emailText = `
Hi ${params.senderName},

Thank you for contacting ${params.businessName}.

Your message has been sent successfully. They will review your inquiry and respond directly to this email address.

Best regards,
The TradeFort Team
    `.trim();

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL!,
            Name: process.env.MAILJET_FROM_NAME || "TradeFort",
          },
          To: [
            {
              Email: params.to,
              Name: params.senderName,
            },
          ],
          Subject: `Your message to ${params.businessName} has been sent`,
          TextPart: emailText,
        },
      ],
    });

    const response = (await request) as unknown as MailjetResponse;
    return {
      success: true,
      messageId: response.body.Messages[0].To[0].MessageID.toString(),
    };
  } catch (error) {
    console.error("Error sending business confirmation email:", error);
    // Don't throw - confirmation email is not critical
    return { success: false, error };
  }
}
