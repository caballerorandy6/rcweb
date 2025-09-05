// app/admin/newsletter/page.tsx
"use client";

import { useState, useEffect } from "react";
import { sendNewsletterAction } from "@/actions/sendNewsletterAction";
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

export default function Newsletter() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [testMode, setTestMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // 2. Mapear correctamente los datos de las actions al estado del componente
  useEffect(() => {
    const fetchAllStats = async () => {
      const [contactsData, emailsData] = await Promise.all([
        getNumberOfEligibleContactsAction(),
        getNumberOfEligibleEmailsAction(),
      ]);

      // Aquí está la corrección clave:
      // Se toman los nombres de propiedad que realmente devuelven las actions
      // y se asignan a la estructura del estado del componente.
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
    };

    fetchAllStats();
  }, []);

  const handleSend = async () => {
    if (!subject || !content) {
      setResult({
        success: false,
        message: "Por favor completa todos los campos",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    const response = await sendNewsletterAction(subject, content, testMode);

    setResult(response);
    setLoading(false);

    if (response.success && !testMode) {
      setSubject("");
      setContent("");
    }
  };

  const useTemplate = () => {
    setSubject("🚀 Special Offer for {{name}}!");
    setContent(`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FFD700;">Hi {{name}}!</h1>
        <p>We have an exclusive offer just for you:</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>20% OFF Web Development Services</h2>
          <p>Valid until the end of this month</p>
          <a href="https://rcweb.com" style="display: inline-block; background: #FFD700; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Claim Your Discount
          </a>
        </div>
        <p>Best regards,<br>RC Web Team</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          You received this because you opted in for marketing emails.
          <a href="https://rcweb.com/unsubscribe">Unsubscribe</a>
        </p>
      </div>
    `);
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
          <div className="bg-gray-800/50 p-4 rounded-lg font-inter">
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
          <div className="flex gap-4">
            <button
              onClick={handleSend}
              disabled={loading}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors font-inter ${
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
              onClick={useTemplate}
              className="px-6 py-3 border border-gold/50 text-gold rounded-lg hover:bg-gold/10 transition-colors font-inter"
            >
              Use Template
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-gray-800/30 rounded-lg">
          <h3 className="text-gold font-semibold mb-2 font-inter">
            💡 Pro Tips:
          </h3>
          <ul className="text-sm text-gray-400 space-y-1 font-inter">
            <li>• Always test before sending to all contacts</li>
            <li>• Use {"{{name}}"} for personalization</li>
            <li>• Keep subject lines under 50 characters</li>
            <li>• Include an unsubscribe link</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
