import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";
import { EMAIL_COLORS } from "../colors";

export interface BlogUnsubscribeEmailProps {
  customerEmail: string;
  resubscribeUrl: string;
}

export const BlogUnsubscribeEmail: React.FC<BlogUnsubscribeEmailProps> = ({
  customerEmail,
  resubscribeUrl,
}) => {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.headerTitle}>
              Successfully Unsubscribed
            </Heading>
            <Text style={styles.headerSubtitle}>RC Web Solutions Blog</Text>
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>
              Hi there,
            </Text>
            <Text style={styles.paragraph}>
              You have been successfully unsubscribed from our blog notifications.
              The email address <strong>{customerEmail}</strong> will no longer
              receive emails when we publish new blog posts.
            </Text>

            <Section style={styles.infoBox}>
              <Text style={styles.infoText}>
                <strong>What this means:</strong>
              </Text>
              <ul style={styles.list}>
                <li style={styles.listItem}>
                  You won't receive email notifications about new blog posts
                </li>
                <li style={styles.listItem}>
                  You can still visit our blog anytime at{" "}
                  <Link href="https://rcweb.dev/blog" style={styles.link}>
                    rcweb.dev/blog
                  </Link>
                </li>
                <li style={styles.listItem}>
                  You can resubscribe anytime if you change your mind
                </li>
              </ul>
            </Section>

            <Section style={styles.buttonContainer}>
              <Link href={resubscribeUrl} style={styles.button}>
                Resubscribe to Blog
              </Link>
            </Section>

            <Hr style={styles.divider} />

            <Text style={styles.footerText}>
              Questions? Contact us at{" "}
              <Link href="mailto:contactus@rcweb.dev" style={styles.link}>
                contactus@rcweb.dev
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerBrand}>RC Web Solutions</Text>
            <Text style={styles.footerInfo}>
              Professional Web Development Services
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const styles: Record<string, React.CSSProperties> = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    backgroundColor: EMAIL_COLORS.lightGray,
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  header: {
    backgroundColor: EMAIL_COLORS.purple,
    padding: "48px 32px",
    textAlign: "center" as const,
    borderRadius: "16px 16px 0 0",
    borderBottom: `4px solid ${EMAIL_COLORS.purpleDark}`,
  },
  headerTitle: {
    color: EMAIL_COLORS.white,
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
  },
  headerSubtitle: {
    color: EMAIL_COLORS.purpleLight,
    margin: "12px 0 0 0",
    fontSize: "16px",
    fontWeight: 500,
  },
  content: {
    backgroundColor: EMAIL_COLORS.white,
    padding: "40px 32px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  greeting: {
    color: EMAIL_COLORS.dark,
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 24px 0",
  },
  paragraph: {
    color: EMAIL_COLORS.gray,
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 32px 0",
  },
  infoBox: {
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    padding: "24px",
    margin: "32px 0",
  },
  infoText: {
    color: EMAIL_COLORS.dark,
    fontSize: "16px",
    fontWeight: 600,
    margin: "0 0 16px 0",
  },
  list: {
    color: EMAIL_COLORS.gray,
    fontSize: "15px",
    lineHeight: "1.8",
    margin: 0,
    paddingLeft: "20px",
  },
  listItem: {
    marginBottom: "8px",
  },
  buttonContainer: {
    textAlign: "center" as const,
    margin: "32px 0",
  },
  button: {
    backgroundColor: EMAIL_COLORS.purple,
    color: EMAIL_COLORS.white,
    padding: "14px 32px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "16px",
    display: "inline-block",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "32px 0",
  },
  footerText: {
    textAlign: "center" as const,
    color: EMAIL_COLORS.gray,
    fontSize: "14px",
    margin: 0,
  },
  link: {
    color: EMAIL_COLORS.purple,
    textDecoration: "none",
    fontWeight: 600,
  },
  footer: {
    backgroundColor: EMAIL_COLORS.dark,
    padding: "24px 32px",
    textAlign: "center" as const,
    borderRadius: "0 0 16px 16px",
  },
  footerBrand: {
    color: EMAIL_COLORS.gold,
    fontSize: "16px",
    fontWeight: 700,
    margin: "0 0 4px 0",
  },
  footerInfo: {
    color: "#9ca3af",
    fontSize: "12px",
    margin: 0,
  },
};

export default BlogUnsubscribeEmail;

