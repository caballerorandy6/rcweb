"use client";

import { useState } from "react";
import Image from "next/image";
import {
  createAndSendBatchCampaign,
  continueBatchCampaign,
  getAllCampaigns,
} from "@/actions/campaigns/sendBatchNewsletterAction";

interface Stats {
  contacts: {
    eligible: number;
    total: number;
    percentage: number;
  };
  emails: {
    eligible: number;
    total: number;
    percentage: number;
  };
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  createdAt: Date;
  emailsSent: number;
  totalEmails: number;
  status: string;
  lastBatchSentAt: Date | null;
}

interface SendNewsletterCampaignProps {
  initialStats: Stats;
  initialCampaigns: Campaign[];
}

export default function SendNewsletterCampaign({
  initialStats,
  initialCampaigns,
}: SendNewsletterCampaignProps) {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [testMode, setTestMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [stats] = useState<Stats>(initialStats);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Convert image to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 500KB for emails)
    if (file.size > 500000) {
      setResult({
        success: false,
        message: "Image too large. Please use an image under 500KB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Insert image into content
  const insertImage = () => {
    if (!imageBase64) return;

    const imageHtml = `
<div style="text-align: center; margin: 30px 0;">
  <img src="${imageBase64}" alt="Campaign Image" style="max-width: 100%; height: auto; border-radius: 8px;" />
</div>`;

    // Insert at cursor position or at the end
    setContent((prev) => prev + imageHtml);
    setImageBase64(""); // Clear after insert
  };

  // Manejar el envío del newsletter con lotes
  const handleSend = async () => {
    if (!subject || !content) {
      setResult({
        success: false,
        message: "Please provide both subject and content.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    const response = await createAndSendBatchCampaign(
      subject,
      content,
      testMode
    );

    setResult(response);
    setLoading(false);

    if (response.success && !testMode) {
      // Refresh campaigns list
      const campaignsData = await getAllCampaigns();
      if (campaignsData.success) {
        setCampaigns(campaignsData.campaigns as Campaign[]);
      }

      setSubject("");
      setContent("");
      setImageBase64("");
    }
  };

  // Continuar una campaña existente
  const handleContinueCampaign = async (campaignId: string) => {
    setLoading(true);
    setResult(null);

    const response = await continueBatchCampaign(campaignId);

    setResult(response);
    setLoading(false);

    // Refresh campaigns list
    const campaignsData = await getAllCampaigns();
    if (campaignsData.success) {
      setCampaigns(campaignsData.campaigns as Campaign[]);
    }
  };

  const useOfferTemplate = () => {
    setSubject("🎉 Special Offer Just For You - 20% OFF Web Development | RC Web Solutions");
    setContent(`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Iceland&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Iceland&family=Inter:wght@400;600;700&display=swap');

        .heading-font {
            font-family: 'Iceland', 'Arial', sans-serif;
        }
        .body-font {
            font-family: 'Inter', 'Arial', sans-serif;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

                    <!-- Header with Logo -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 20px; text-align: center;">
                            <h1 style="color: #D4AF37; margin: 0; font-size: 32px; font-weight: bold; font-family: 'Iceland', Arial, sans-serif; letter-spacing: 1px;">RC WEB SOLUTIONS</h1>
                            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; font-family: 'Inter', Arial, sans-serif;">Professional Web Development</p>
                        </td>
                    </tr>

                    <!-- Limited Time Badge -->
                    <tr>
                        <td style="background-color: #FEF3C7; padding: 15px; text-align: center; border-bottom: 2px solid #D4AF37;">
                            <p style="margin: 0; color: #B45309; font-weight: bold; font-size: 14px; font-family: 'Inter', Arial, sans-serif; letter-spacing: 0.5px;">
                                ⏰ LIMITED TIME OFFER - 7 DAYS ONLY
                            </p>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                            <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 48px; text-align: center; font-family: 'Iceland', Arial, sans-serif; letter-spacing: 1px; line-height: 1.2;">
                                GET <span style="color: #D4AF37;">20% OFF</span>
                            </h2>
                            <h3 style="color: #4a5568; margin: 0 0 40px 0; font-size: 22px; text-align: center; font-weight: 600; font-family: 'Inter', Arial, sans-serif; line-height: 1.4;">
                                Professional Web Development Services
                            </h3>

                            <div style="text-align: left; max-width: 540px; margin: 0 auto;">
                                <p style="color: #4a5568; line-height: 1.8; margin: 0 0 20px 0; font-size: 16px; font-family: 'Inter', Arial, sans-serif;">
                                    Hi there! 👋
                                </p>

                                <p style="color: #4a5568; line-height: 1.8; margin: 0 0 20px 0; font-size: 16px; font-family: 'Inter', Arial, sans-serif;">
                                    I wanted to reach out personally because I'm offering an exclusive <strong style="color: #D4AF37;">20% discount</strong> on all web development projects for the next 7 days.
                                </p>

                                <p style="color: #4a5568; line-height: 1.8; margin: 0 0 30px 0; font-size: 16px; font-family: 'Inter', Arial, sans-serif;">
                                    Whether you've been thinking about launching a new website, redesigning your current one, or building a custom web application - this is the perfect opportunity to get started.
                                </p>
                            </div>

                            <!-- What's Included Box -->
                            <div style="background-color: #F9FAFB; border-left: 4px solid #D4AF37; padding: 25px; margin: 0 0 35px 0; text-align: left; border-radius: 8px;">
                                <h4 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 22px; font-family: 'Iceland', Arial, sans-serif; letter-spacing: 0.5px; text-align: center;">THIS OFFER INCLUDES</h4>
                                <ul style="color: #4a5568; line-height: 2; margin: 0; padding-left: 30px; font-family: 'Inter', Arial, sans-serif; font-size: 15px;">
                                    <li style="margin-bottom: 8px;">Full-Stack Web Applications</li>
                                    <li style="margin-bottom: 8px;">E-Commerce Websites</li>
                                    <li style="margin-bottom: 8px;">Landing Pages</li>
                                    <li style="margin-bottom: 8px;">Custom CMS Development</li>
                                    <li style="margin-bottom: 8px;">Website Redesign Projects</li>
                                    <li style="margin-bottom: 8px;">Mobile-Responsive Design</li>
                                </ul>
                            </div>

                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 35px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="https://rcweb.dev/offer" style="display: inline-block; background-color: #D4AF37; color: #1a1a1a; text-decoration: none; padding: 20px 45px; border-radius: 10px; font-weight: bold; font-size: 18px; box-shadow: 0 6px 12px rgba(212, 175, 55, 0.4); font-family: 'Inter', Arial, sans-serif; letter-spacing: 0.5px;">
                                            🚀 CLAIM YOUR 20% DISCOUNT
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <div style="text-align: center; max-width: 540px; margin: 0 auto;">
                                <p style="color: #4a5568; line-height: 1.8; margin: 0 0 20px 0; font-size: 16px; font-family: 'Inter', Arial, sans-serif;">
                                    Simply reply to this email or give me a call at <strong style="color: #D4AF37;">(346) 375-7534</strong> to get started.
                                </p>

                                <p style="color: #4a5568; line-height: 1.8; margin: 0; font-size: 16px; font-family: 'Inter', Arial, sans-serif;">
                                    Looking forward to working with you!
                                </p>

                                <p style="color: #D4AF37; line-height: 1.8; margin: 20px 0 0 0; font-size: 16px; font-family: 'Inter', Arial, sans-serif; font-weight: 600;">
                                    Best regards,<br>
                                    Randy Caballero<br>
                                    <span style="font-size: 14px; color: #9CA3AF;">Founder, RC Web Solutions LLC</span>
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1a1a1a; padding: 35px 20px; text-align: center;">
                            <p style="color: #D4AF37; margin: 0 0 10px 0; font-weight: bold; font-size: 20px; font-family: 'Iceland', Arial, sans-serif; letter-spacing: 1px;">
                                RC WEB SOLUTIONS LLC
                            </p>
                            <p style="color: #9CA3AF; margin: 0 0 20px 0; font-size: 14px; font-family: 'Inter', Arial, sans-serif;">
                                Houston, TX 77085
                            </p>
                            <p style="margin: 0 0 20px 0; line-height: 2;">
                                <a href="tel:3463757534" style="color: #D4AF37; text-decoration: none; margin: 0 15px; font-family: 'Inter', Arial, sans-serif; font-size: 14px;">📞 (346) 375-7534</a><br>
                                <a href="mailto:contactus@rcweb.dev" style="color: #D4AF37; text-decoration: none; margin: 0 15px; font-family: 'Inter', Arial, sans-serif; font-size: 14px;">✉️ contactus@rcweb.dev</a><br>
                                <a href="https://rcweb.dev" style="color: #D4AF37; text-decoration: none; margin: 0 15px; font-family: 'Inter', Arial, sans-serif; font-size: 14px;">🌐 rcweb.dev</a>
                            </p>
                            <div style="border-top: 1px solid #4a5568; padding-top: 20px; margin-top: 20px;">
                                <p style="color: #6B7280; margin: 0 0 10px 0; font-size: 12px; font-family: 'Inter', Arial, sans-serif; line-height: 1.6;">
                                    Offer valid for 7 days. Cannot be combined with other promotions.
                                </p>
                                <p style="color: #6B7280; margin: 0; font-size: 11px; font-family: 'Inter', Arial, sans-serif;">
                                    © 2025 RC Web Solutions LLC. All rights reserved.
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`);
  };

  const useTemplate = () => {
    setSubject("🎃 Halloween Special - Professional Web Development Services");
    setContent(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Halloween Special - RC Web Solutions</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Arial', 'Helvetica', sans-serif; background-color: #0a0a0a; color: #ffffff; line-height: 1.6; padding: 20px 0; }
      .email-container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a0a2e 0%, #0f0617 100%); border: 2px solid #ff6b00; border-radius: 15px; overflow: hidden; }
      .header { background: linear-gradient(135deg, #1e0835 0%, #0a0014 100%); padding: 40px 25px; text-align: center; border-bottom: 3px solid #ff6b00; }
      .pumpkin-emoji { font-size: 60px; margin-bottom: 10px; }
      .logo { font-size: 28px; font-weight: bold; color: #ffa500; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); margin: 15px 0 10px; }
      .subtitle { color: #e0e0e0; font-size: 14px; margin-top: 8px; line-height: 1.5; }
      .main-content { padding: 45px 30px; }
      .halloween-title { text-align: center; font-size: 32px; color: #ff6b00; margin-bottom: 25px; text-shadow: 2px 2px 8px rgba(255, 107, 0, 0.5); font-weight: bold; line-height: 1.3; }
      .greeting { color: #ffffff; font-size: 18px; margin-bottom: 20px; line-height: 1.5; }
      .intro-text { text-align: center; font-size: 16px; color: #d4d4d4; margin-bottom: 30px; line-height: 1.8; padding: 0 10px; }
      .highlight-box { background: rgba(255, 107, 0, 0.1); border-left: 4px solid #ff6b00; padding: 25px 20px; margin: 35px 0; border-radius: 8px; }
      .highlight-text { font-size: 18px; font-weight: bold; color: #ffa500; text-align: center; line-height: 1.6; }
      .pricing-card { background: rgba(255, 255, 255, 0.05); border: 2px solid #ff6b00; border-radius: 12px; padding: 30px 25px; margin-bottom: 30px; }
      .plan-name { font-size: 24px; font-weight: bold; color: #ffa500; margin-bottom: 15px; line-height: 1.3; }
      .plan-price { font-size: 32px; font-weight: bold; color: #ff6b00; margin: 20px 0 15px; line-height: 1.2; }
      .price-range { color: #b0b0b0; font-size: 16px; margin-bottom: 12px; line-height: 1.5; }
      .plan-duration { color: #b0b0b0; font-size: 14px; margin-bottom: 18px; line-height: 1.5; }
      .plan-description { color: #d4d4d4; margin-bottom: 25px; font-size: 15px; line-height: 1.6; }
      .features-list { list-style: none; margin: 25px 0; padding: 0; }
      .features-list li { padding: 10px 0; color: #d4d4d4; font-size: 14px; position: relative; padding-left: 25px; line-height: 1.6; }
      .features-list li:before { content: '🎃'; position: absolute; left: 0; font-size: 16px; top: 8px; }
      .ideal-for { background: rgba(255, 165, 0, 0.1); padding: 15px; border-radius: 8px; color: #ffa500; font-style: italic; font-size: 13px; margin-top: 20px; line-height: 1.5; }
      .cta-button { display: inline-block; background: linear-gradient(135deg, #ff6b00 0%, #ff9500 100%); color: #ffffff; padding: 15px 35px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; margin: 15px 0; text-align: center; box-shadow: 0 4px 15px rgba(255, 107, 0, 0.4); }
      .benefits-section { margin: 45px 0; padding: 35px 30px; background: rgba(255, 165, 0, 0.05); border-radius: 12px; }
      .benefits-title { font-size: 22px; color: #ffa500; margin-bottom: 25px; text-align: center; font-weight: bold; line-height: 1.3; }
      .benefit-item { padding: 15px 0; color: #d4d4d4; font-size: 15px; display: flex; align-items: flex-start; line-height: 1.6; }
      .benefit-icon { font-size: 24px; margin-right: 15px; flex-shrink: 0; }
      .footer { background: #0a0014; padding: 35px 25px; text-align: center; border-top: 2px solid #ff6b00; }
      .footer-text { color: #888; font-size: 13px; margin-bottom: 18px; line-height: 1.6; }
      .social-links { margin: 25px 0; line-height: 1.8; }
      .social-links a { color: #ffa500; text-decoration: none; margin: 0 10px; font-size: 14px; }
      .contact-info { color: #b0b0b0; font-size: 13px; margin: 20px 0; line-height: 1.8; }
      .contact-info a { color: #ffa500; text-decoration: none; }
      @media only screen and (max-width: 600px) {
        .email-container { border-radius: 0; }
        .main-content { padding: 35px 20px; }
        .halloween-title { font-size: 26px; margin-bottom: 20px; }
        .plan-price { font-size: 28px; }
        .pricing-card { padding: 25px 20px; margin-bottom: 25px; }
        .benefits-section { margin: 35px 0; padding: 25px 20px; }
        .benefit-item { padding: 12px 0; }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <div class="pumpkin-emoji">🎃</div>
        <div class="logo">RC Web Solutions LLC</div>
        <div class="subtitle">Transforming Digital Presence for Small & Medium Businesses</div>
      </div>
      <div class="main-content">
        <h1 class="halloween-title">👻 Professional Web Development Services 👻</h1>
        <p class="greeting">Dear Valued Customer,</p>
        <p class="intro-text">
          This Halloween season, take your business to the next level. 🕸️<br />
          <strong>Transform your digital presence</strong> with our professional web development services designed for <strong>small and medium-sized businesses</strong> ready to grow.
        </p>
        <div class="highlight-box">
          <p class="highlight-text">🦇 Flexible Pricing & Payment Plans Available 🦇<br /><span style="font-size: 14px; color: #d4d4d4">50% Deposit • 50% on Completion</span></p>
        </div>
        <div class="pricing-section">
          <div class="pricing-card">
            <div class="plan-name">👻 Landing Pages</div>
            <div class="plan-price">Starting at $800</div>
            <div class="price-range">Price Range: $800 - $1,500</div>
            <div class="plan-duration">1-2 weeks delivery</div>
            <div class="plan-description">Single page focused on conversions</div>
            <ul class="features-list">
              <li>Lead generation</li>
              <li>Service showcase</li>
              <li>Event promotion</li>
              <li>Quick online presence</li>
              <li>Mobile-optimized design</li>
              <li>Contact form integration</li>
              <li>Basic SEO setup</li>
            </ul>
            <div class="ideal-for">✨ Perfect for: New businesses, product launches, event promotion</div>
            <center><a href="https://rcweb.dev/#pricing" class="cta-button">View Details 🚀</a></center>
          </div>
          <div class="pricing-card" style="border-color: #ffa500; border-width: 3px">
            <div style="background: #ffa500; color: #000; display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 10px;">⭐ MOST POPULAR</div>
            <div class="plan-name">🎃 Professional Websites</div>
            <div class="plan-price">Starting at $2,500</div>
            <div class="price-range">Price Range: $2,500 - $5,000</div>
            <div class="plan-duration">3-4 weeks delivery</div>
            <div class="plan-description">5-10 pages with custom design</div>
            <ul class="features-list">
              <li>Small businesses</li>
              <li>Professional services</li>
              <li>Portfolios</li>
              <li>Company websites</li>
              <li>Responsive design</li>
              <li>SEO optimization</li>
              <li>Analytics integration</li>
              <li>30-day support</li>
            </ul>
            <div class="ideal-for">✨ Perfect for: Established businesses, professional services, portfolios</div>
            <center><a href="https://rcweb.dev/#pricing" class="cta-button">Get Started! 🔥</a></center>
          </div>
        </div>
        <div class="benefits-section">
          <div class="benefits-title">🕷️ Why Choose RC Web Solutions? 🕷️</div>
          <div class="benefit-item"><span class="benefit-icon">⚡</span><div><strong>Fast Development:</strong> Your website ready in 2-5 weeks, not months</div></div>
          <div class="benefit-item"><span class="benefit-icon">💰</span><div><strong>Flexible Payment:</strong> 50% upfront, 50% on completion - No surprises</div></div>
          <div class="benefit-item"><span class="benefit-icon">🎨</span><div><strong>Modern Design:</strong> Websites that convert visitors into customers</div></div>
          <div class="benefit-item"><span class="benefit-icon">📱</span><div><strong>100% Responsive:</strong> Perfect on any device</div></div>
          <div class="benefit-item"><span class="benefit-icon">🔒</span><div><strong>Security Included:</strong> Protection and best practices from day one</div></div>
          <div class="benefit-item"><span class="benefit-icon">📞</span><div><strong>Dedicated Support:</strong> Fast responses when you need them</div></div>
        </div>
        <center style="margin: 40px 0">
          <p style="color: #d4d4d4; margin-bottom: 20px; font-size: 16px">Ready to transform your digital presence?</p>
          <a href="https://rcweb.dev/#contact" class="cta-button">Schedule a Free Consultation 📅</a>
          <p style="color: #b0b0b0; margin-top: 15px; font-size: 13px">Or call us directly: <a href="tel:+13463757534" style="color: #ffa500">+1 (346) 375-7534</a></p>
        </center>
      </div>
      <div class="footer">
        <div class="footer-text">RC Web Solutions LLC<br />Houston, Texas, USA</div>
        <div class="social-links">
          <a href="https://www.linkedin.com/company/rcwebsolutions">LinkedIn</a> |
          <a href="https://www.facebook.com/rcwebsolutionsllc">Facebook</a> |
          <a href="https://www.instagram.com/rcwebsolutionsllc">Instagram</a> |
          <a href="https://x.com/RCWeb2025">X (Twitter)</a>
        </div>
        <div class="contact-info">
          Email: <a href="mailto:contactus@rcweb.dev">contactus@rcweb.dev</a><br />
          Web: <a href="https://rcweb.dev">rcweb.dev</a>
        </div>
        <div class="footer-text" style="margin-top: 20px">
          © 2025 RC Web Solutions LLC. All rights reserved.<br />
          <a href="https://rcweb.dev/privacy-policy" style="color: #888; font-size: 12px">Privacy Policy</a> |
          <a href="https://rcweb.dev/terms-of-service" style="color: #888; font-size: 12px">Terms of Service</a>
        </div>
        <div style="margin-top: 20px; font-size: 12px; color: #666">Don't want to receive these emails? <a href="#" style="color: #888">Unsubscribe</a></div>
      </div>
    </div>
  </body>
</html>`);
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-8 px-8 pt-24 sm:pt-32">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold mb-4 font-iceland">
            Send Newsletter
          </h1>

          {/* 3. El JSX ahora funciona porque el estado tiene la estructura esperada */}
          <div className="bg-gray-800/50 p-4 rounded-lg font-inter mb-4">
            <p className="text-white mb-2">
              <span className="text-gold font-bold">
                {stats.emails.eligible}
              </span>{" "}
              emails will be sent
              <span className="text-gray-400 ml-2">
                (from {stats.contacts.eligible} contacts with consent)
              </span>
            </p>
            <p className="text-sm text-gray-400">
              {stats.contacts.percentage}% of {stats.contacts.total} total
              contacts have marketing consent • {stats.emails.total} total
              emails in database
            </p>
          </div>

          {/* Batch Info Alert */}
          {stats.emails.eligible > 100 && (
            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg font-inter">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📬</span>
                <div>
                  <h3 className="text-blue-400 font-semibold mb-1">
                    Batch Campaign Mode
                  </h3>
                  <p className="text-sm text-gray-300 mb-2">
                    You have {stats.emails.eligible} emails to send. Due to
                    Resend&apos;s 100 emails/day limit, your campaign will be
                    sent in batches:
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1 ml-4">
                    <li>• First batch: 100 emails sent immediately</li>
                    <li>
                      • Remaining: {stats.emails.eligible - 100} emails (sent in{" "}
                      {Math.ceil((stats.emails.eligible - 100) / 100)} more
                      batches)
                    </li>
                    <li>• Wait 24 hours between each batch</li>
                    <li>• Track progress in Campaign History below</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form (sin cambios) */}
        <div className="space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Your amazing subject line..."
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-gold focus:outline-none font-inter"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
              Add Image (Optional)
            </label>
            <div className="flex gap-3 items-start">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1 p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-gold focus:outline-none font-inter file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gold file:text-black file:font-semibold hover:file:bg-gold/90"
              />
              {imageBase64 && (
                <button
                  onClick={insertImage}
                  className="px-4 py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition-colors whitespace-nowrap"
                >
                  Insert Image
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1 font-inter">
              Max 500KB • Image will be embedded as base64 in the email
            </p>
            {imageBase64 && (
              <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Preview:</p>
                <Image
                  src={imageBase64}
                  alt="Preview"
                  className="max-w-xs rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
              Email Content (HTML)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="<h1>Your email content here...</h1>..."
              rows={12}
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-gold focus:outline-none font-mono text-sm"
            />
          </div>

          {/* Test Mode Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="testMode"
              checked={testMode}
              onChange={(e) => setTestMode(e.target.checked)}
              className="w-5 h-5 bg-gray-800 border-gray-700 text-gold rounded focus:ring-gold"
            />
            <label htmlFor="testMode" className="text-white font-inter">
              Test Mode
              <span className="text-gray-400 text-sm ml-2">
                (Send only to first contact)
              </span>
            </label>
          </div>

          {/* Result Message */}
          {result && (
            <div
              className={`p-4 rounded-lg font-inter ${
                result.success
                  ? "bg-green-900/50 text-green-400"
                  : "bg-red-900/50 text-red-400"
              }`}
            >
              {result.message}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleSend}
              disabled={loading}
              className={`flex-1 min-w-[200px] py-3 rounded-lg font-semibold transition-colors font-inter ${
                testMode
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gold hover:bg-gold/90 text-black"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading
                ? "Sending..."
                : testMode
                  ? "Send Test Email"
                  : "Send Campaign"}
            </button>

            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-inter"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>

            <button
              onClick={useOfferTemplate}
              className="px-6 py-3 bg-gradient-to-r from-gold to-gold/80 text-black rounded-lg hover:from-gold/90 hover:to-gold/70 transition-all font-inter font-semibold"
            >
              🎉 20% OFF Template
            </button>

            <button
              onClick={useTemplate}
              className="px-6 py-3 border border-gold/50 text-gold rounded-lg hover:bg-gold/10 transition-colors font-inter"
            >
              🎃 Halloween Template
            </button>
          </div>
        </div>

        {/* Email Preview */}
        {showPreview && content && (
          <div className="mt-8 p-6 bg-gray-800/50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gold font-iceland">
                Email Preview
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="bg-white rounded-lg overflow-hidden">
              {/* Desktop Preview */}
              <div className="border-b-2 border-gray-200 p-4">
                <p className="text-sm text-gray-600 font-inter mb-2">
                  Desktop Preview (600px max-width)
                </p>
                <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-[600px]">
                  <div
                    dangerouslySetInnerHTML={{ __html: content }}
                    className="mx-auto"
                    style={{ maxWidth: "600px" }}
                  />
                </div>
              </div>

              {/* Mobile Preview */}
              <div className="p-4">
                <p className="text-sm text-gray-600 font-inter mb-2">
                  Mobile Preview (375px width)
                </p>
                <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-[600px] flex justify-center">
                  <div
                    dangerouslySetInnerHTML={{ __html: content }}
                    style={{ width: "375px" }}
                  />
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-4 font-inter text-center">
              💡 This preview shows how your email will look on desktop and
              mobile devices
            </p>
          </div>
        )}

        {/* Campaigns List */}
        <div className="mt-8">
          <button
            onClick={() => setShowCampaigns(!showCampaigns)}
            className="w-full py-3 px-4 bg-gray-800/50 hover:bg-gray-800 text-white rounded-lg transition-colors font-inter flex items-center justify-between"
          >
            <span className="font-semibold">
              📧 View Campaign History ({campaigns.length})
            </span>
            <span>{showCampaigns ? "▼" : "▶"}</span>
          </button>

          {showCampaigns && campaigns.length > 0 && (
            <div className="mt-4 space-y-4 font-inter">
              {campaigns.map((campaign) => {
                const progress = Math.round(
                  (campaign.emailsSent / campaign.totalEmails) * 100
                );
                const isCompleted = campaign.status === "completed";
                const isInProgress = campaign.status === "in_progress";

                // Calculate time until next batch
                let canSendNext = true;
                let hoursRemaining = 0;
                if (campaign.lastBatchSentAt && isInProgress) {
                  const hoursSinceLastBatch =
                    (new Date().getTime() -
                      new Date(campaign.lastBatchSentAt).getTime()) /
                    (1000 * 60 * 60);
                  canSendNext = hoursSinceLastBatch >= 24;
                  hoursRemaining = Math.ceil(24 - hoursSinceLastBatch);
                }

                return (
                  <div
                    key={campaign.id}
                    className="p-4 bg-gray-800/30 rounded-lg border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold font-inter">
                          {campaign.subject}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Created:{" "}
                          {new Date(campaign.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isCompleted
                            ? "bg-green-900/50 text-green-400"
                            : isInProgress
                              ? "bg-blue-900/50 text-blue-400"
                              : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {campaign.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white font-semibold">
                          {campaign.emailsSent} / {campaign.totalEmails} (
                          {progress}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isCompleted ? "bg-green-500" : "bg-gold"
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Continue Button */}
                    {isInProgress && (
                      <div className="mt-3">
                        {canSendNext ? (
                          <button
                            onClick={() => handleContinueCampaign(campaign.id)}
                            disabled={loading}
                            className="w-full py-2 bg-gold hover:bg-gold/90 text-black rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Continue Campaign (Send Next 100 Emails)
                          </button>
                        ) : (
                          <div className="text-center text-sm text-gray-400 py-2 bg-gray-700/30 rounded-lg">
                            ⏰ Next batch available in ~{hoursRemaining} hours
                            <br />
                            <span className="text-xs">
                              (Resend 100 emails/day limit)
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {isCompleted && (
                      <div className="mt-3 text-center text-sm text-green-400 py-2 bg-green-900/20 rounded-lg">
                        ✓ Campaign completed successfully
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {showCampaigns && campaigns.length === 0 && (
            <div className="mt-4 p-6 bg-gray-800/30 rounded-lg text-center text-gray-400">
              No campaigns yet. Create your first campaign above!
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-gray-800/30 rounded-lg">
          <h3 className="text-gold font-semibold mb-2 font-inter">
            💡 Pro Tips:
          </h3>
          <ul className="text-sm text-gray-400 space-y-1 font-inter">
            <li>• Campaigns automatically pause after 100 emails</li>
            <li>• Continue sending after 24 hours (Resend free plan limit)</li>
            <li>• Always test before sending to all contacts</li>
            <li>• Keep subject lines under 50 characters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
