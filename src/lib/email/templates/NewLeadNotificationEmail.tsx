import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Preview,
} from "@react-email/components";

interface NewLeadNotificationEmailProps {
  leadName: string;
  leadEmail?: string;
  leadPhone?: string;
  source: string;
  message?: string;
  createdAt: string;
}

const sourceLabels: Record<string, string> = {
  contact_form: "Contact Form",
  guide_download: "Guide Download",
  exit_intent: "Exit Intent Popup",
  google_places: "Google Places Import",
  sms_opt_in: "SMS Opt-In",
  blog_subscription: "Blog Subscription",
  whatsapp: "WhatsApp",
  schedule_call: "Schedule Call",
  manual: "Manual Entry",
};

export default function NewLeadNotificationEmail({
  leadName,
  leadEmail,
  leadPhone,
  source,
  message,
  createdAt,
}: NewLeadNotificationEmailProps) {
  const sourceLabel = sourceLabels[source] || source;

  return (
    <Html>
      <Head />
      <Preview>New Lead: {leadName} via {sourceLabel}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerText}>New Lead Alert</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>You have a new lead!</Text>

            <Section style={infoBox}>
              <Text style={infoLabel}>Name</Text>
              <Text style={infoValue}>{leadName}</Text>

              {leadEmail && (
                <>
                  <Text style={infoLabel}>Email</Text>
                  <Text style={infoValue}>
                    <Link href={`mailto:${leadEmail}`} style={link}>
                      {leadEmail}
                    </Link>
                  </Text>
                </>
              )}

              {leadPhone && (
                <>
                  <Text style={infoLabel}>Phone</Text>
                  <Text style={infoValue}>
                    <Link href={`tel:${leadPhone}`} style={link}>
                      {leadPhone}
                    </Link>
                  </Text>
                </>
              )}

              <Text style={infoLabel}>Source</Text>
              <Text style={sourceTag}>{sourceLabel}</Text>

              <Text style={infoLabel}>Received</Text>
              <Text style={infoValue}>{createdAt}</Text>
            </Section>

            {message && (
              <>
                <Text style={infoLabel}>Message</Text>
                <Section style={messageBox}>
                  <Text style={messageText}>{message}</Text>
                </Section>
              </>
            )}

            <Hr style={hr} />

            <Link href="https://rcweb.dev/contacts" style={button}>
              View in Admin Panel
            </Link>

            <Text style={tip}>
              Respond quickly! Leads contacted within 5 minutes are 9x more likely to convert.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              RC Web Solutions LLC | Houston, TX
            </Text>
            <Text style={footerText}>
              This is an automated notification from your CRM.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#111827",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#D4AF37",
  padding: "20px",
  borderRadius: "8px 8px 0 0",
  textAlign: "center" as const,
};

const headerText = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
};

const content = {
  backgroundColor: "#1F2937",
  padding: "30px",
  borderRadius: "0 0 8px 8px",
};

const greeting = {
  color: "#FFFFFF",
  fontSize: "20px",
  fontWeight: "600",
  marginBottom: "20px",
};

const infoBox = {
  backgroundColor: "#374151",
  padding: "20px",
  borderRadius: "8px",
  marginBottom: "20px",
};

const infoLabel = {
  color: "#9CA3AF",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  marginBottom: "4px",
  marginTop: "12px",
};

const infoValue = {
  color: "#FFFFFF",
  fontSize: "16px",
  margin: "0 0 8px 0",
};

const sourceTag = {
  display: "inline-block",
  backgroundColor: "#D4AF37",
  color: "#111827",
  padding: "4px 12px",
  borderRadius: "9999px",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0",
};

const link = {
  color: "#D4AF37",
  textDecoration: "none",
};

const messageBox = {
  backgroundColor: "#374151",
  padding: "15px",
  borderRadius: "8px",
  borderLeft: "4px solid #D4AF37",
  marginBottom: "20px",
};

const messageText = {
  color: "#E5E7EB",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const hr = {
  borderColor: "#374151",
  margin: "20px 0",
};

const button = {
  display: "block",
  backgroundColor: "#D4AF37",
  color: "#111827",
  padding: "14px 24px",
  borderRadius: "8px",
  textDecoration: "none",
  textAlign: "center" as const,
  fontWeight: "600",
  fontSize: "16px",
  marginBottom: "20px",
};

const tip = {
  color: "#9CA3AF",
  fontSize: "13px",
  textAlign: "center" as const,
  fontStyle: "italic",
};

const footer = {
  padding: "20px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#6B7280",
  fontSize: "12px",
  margin: "4px 0",
};
