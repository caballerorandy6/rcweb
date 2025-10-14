"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import {
  createAndSendBatchCampaign,
  continueBatchCampaign,
  getAllCampaigns
} from "@/actions/sendBatchNewsletterAction";
import {
  getNumberOfEligibleContactsAction,
  getNumberOfEligibleEmailsAction,
} from "@/actions/getNewsletterStatsAction";

// 1. Adaptar la interfaz para que use nombres genéricos y consistentes
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

const initialStats: Stats = {
  contacts: { eligible: 0, total: 0, percentage: 0 },
  emails: { eligible: 0, total: 0, percentage: 0 },
};

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

export default function SendNewsletterCampaign() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [testMode, setTestMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  // 2. Mapear correctamente los datos de las actions al estado del componente
  useEffect(() => {
    startTransition(() => {
      const fetchAllStats = async () => {
        const [contactsData, emailsData, campaignsData] = await Promise.all([
          getNumberOfEligibleContactsAction(),
          getNumberOfEligibleEmailsAction(),
          getAllCampaigns(),
        ]);

        // Mapear los datos recibidos a la estructura esperada
        setStats({
          contacts: {
            eligible: contactsData.eligible ?? 0,
            total: contactsData.total ?? 0,
            percentage: contactsData.percentage ?? 0,
          },
          emails: {
            eligible: emailsData.eligibleEmails ?? 0,
            total: emailsData.totalEmails ?? 0,
            percentage: emailsData.consentPercentage ?? 0,
          },
        });

        if (campaignsData.success) {
          setCampaigns(campaignsData.campaigns as Campaign[]);
        }
      };

      fetchAllStats();
    });
  }, []);

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

    const response = await createAndSendBatchCampaign(subject, content, testMode);

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
            <div class="plan-name">👻 Starter Package</div>
            <div class="plan-price">Starting at $1,499</div>
            <div class="price-range">Price Range: $1,499 - $2,999</div>
            <div class="plan-duration">2-3 weeks delivery</div>
            <div class="plan-description">Perfect for small businesses starting their digital journey</div>
            <ul class="features-list">
              <li>5-7 page responsive website</li>
              <li>Mobile-optimized design</li>
              <li>Basic SEO setup</li>
              <li>Contact form integration</li>
              <li>Social media links</li>
              <li>Google Analytics setup</li>
              <li>1 month free support</li>
            </ul>
            <div class="ideal-for">✨ Ideal for: Local businesses, freelancers, personal brands</div>
            <center><a href="https://rcweb.dev/#pricing" class="cta-button">View Details 🚀</a></center>
          </div>
          <div class="pricing-card" style="border-color: #ffa500; border-width: 3px">
            <div style="background: #ffa500; color: #000; display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 10px;">⭐ MOST POPULAR</div>
            <div class="plan-name">🎃 Growth Package</div>
            <div class="plan-price">Starting at $3,499</div>
            <div class="price-range">Price Range: $3,499 - $5,999</div>
            <div class="plan-duration">3-5 weeks delivery</div>
            <div class="plan-description">Scale your business with advanced features and premium functionality</div>
            <ul class="features-list">
              <li>10-15 page dynamic website</li>
              <li>Custom animations & interactions</li>
              <li>Advanced SEO optimization</li>
              <li>CMS integration (blog/news)</li>
              <li>Email marketing integration</li>
              <li>Lead capture & automation</li>
              <li>Google My Business setup</li>
              <li>3 months free support</li>
            </ul>
            <div class="ideal-for">✨ Ideal for: Growing startups, service businesses, B2B companies</div>
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
                    You have {stats.emails.eligible} emails to send. Due to Resend&apos;s 100 emails/day limit, your campaign will be sent in batches:
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1 ml-4">
                    <li>• First batch: 100 emails sent immediately</li>
                    <li>• Remaining: {stats.emails.eligible - 100} emails (sent in {Math.ceil((stats.emails.eligible - 100) / 100)} more batches)</li>
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
            <p className="text-xs text-gray-500 mt-1 font-inter">
              Use {"{{name}}"} to personalize
            </p>
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
              placeholder="<h1>Hello {{name}}!</h1>..."
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
              disabled={isPending || loading}
              className={`flex-1 min-w-[200px] py-3 rounded-lg font-semibold transition-colors font-inter ${
                testMode
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gold hover:bg-gold/90 text-black"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading || isPending
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
              onClick={useTemplate}
              className="px-6 py-3 border border-gold/50 text-gold rounded-lg hover:bg-gold/10 transition-colors font-inter"
            >
              Use Template
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
              💡 This preview shows how your email will look on desktop and mobile devices
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
            <div className="mt-4 space-y-4">
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
                          Created: {new Date(campaign.createdAt).toLocaleString()}
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
                          {campaign.emailsSent} / {campaign.totalEmails} ({progress}%)
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
            <li>• Use {"{{name}}"} for personalization</li>
            <li>• Keep subject lines under 50 characters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
