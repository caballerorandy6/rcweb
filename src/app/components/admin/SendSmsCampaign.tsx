"use client";

import { useState, useEffect, useTransition } from "react";
import { sendSmsCampaignAction } from "@/actions/campaigns/sendSMSCampaignAction";
import { getSmsStatsAction } from "@/actions/stats/getSmsStatsAction";

interface SmsStats {
  eligibleContacts: number;
  totalContacts: number;
  totalPhones: number;
  estimatedCost: number;
  consentPercentage: number;
}

interface SendSmsCampaignProps {
  initialStats: SmsStats;
}

export default function SendSmsCampaign({ initialStats }: SendSmsCampaignProps) {
  const [message, setMessage] = useState("");
  const [testMode, setTestMode] = useState(true);
  const [stats, setStats] = useState<SmsStats>(initialStats);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [charCount, setCharCount] = useState(0);

  // Actualizar contador de caracteres
  useEffect(() => {
    setCharCount(message.length);
  }, [message]);

  const handleSend = async () => {
    if (!message) {
      setResult({
        success: false,
        message: "Please enter a message",
      });
      return;
    }

    if (message.length > 160) {
      const segments = Math.ceil(message.length / 160);
      const confirm = window.confirm(
        `Your message is ${message.length} characters and will be sent as ${segments} SMS segments (cost: $${(0.0079 * segments * stats.eligibleContacts).toFixed(2)}). Continue?`
      );
      if (!confirm) return;
    }

    startTransition(async () => {
      const response = await sendSmsCampaignAction(message, testMode);
      setResult(response);

      if (response.success && !testMode) {
        setMessage("");
        setCharCount(0);
        // Recargar estadísticas
        const newStats = await getSmsStatsAction();
        setStats(newStats);
      }
    });
  };

  // Templates predefinidos
  const templates = [
    {
      name: "Small Business Pro",
      text: "RC Web Solutions: Get more customers online! Professional websites for small businesses. FREE consult: https://rcweb.dev +1 (346)375-7534 Reply STOP",
    },
    {
      name: "Special Offer",
      text: "Hi! RC Web: 20% OFF this week only. Visit rcweb.com/offer Reply STOP to unsubscribe",
    },
    {
      name: "Appointment",
      text: "Reminder: Your consultation is tomorrow at 3 PM. Reply YES to confirm.",
    },
    {
      name: "New Service",
      text: "RC Web now offers mobile apps! 15% off for existing clients. Info: rcweb.com",
    },
  ];

  const smsSegments = Math.ceil(charCount / 160);
  const segmentCost = 0.0079 * smsSegments;

  return (
    <div className="min-h-screen bg-gray-900 pb-8 px-8 py-24 lg:py-32">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold mb-4 font-iceland">
            Send SMS Campaign
          </h1>

          {/* Stats */}
          <div className="bg-gray-800/50 p-4 rounded-lg font-inter">
            <p className="text-white mb-2">
              <span className="text-gold font-bold">
                {stats.eligibleContacts}
              </span>{" "}
              phone numbers will receive this SMS
            </p>
            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
              <div>
                <span className="text-gray-400">Total phones in database:</span>
                <span className="text-white ml-2">{stats.totalPhones}</span>
              </div>
              <div>
                <span className="text-gray-400">With consent:</span>
                <span className="text-green-400 ml-2">
                  {stats.consentPercentage}%
                </span>
              </div>
              <div>
                <span className="text-gray-400">Cost per SMS:</span>
                <span className="text-yellow-400 ml-2">$0.0079</span>
              </div>
              <div>
                <span className="text-gray-400">Estimated total cost:</span>
                <span className="text-green-400 ml-2 font-bold">
                  ${(segmentCost * stats.eligibleContacts).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Message Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-300 font-inter">
                SMS Message
              </label>
              <div className="text-sm font-inter">
                <span
                  className={`${charCount > 160 ? "text-red-400" : "text-gray-400"}`}
                >
                  {charCount}/160
                </span>
                {charCount > 160 && (
                  <span className="text-red-400 ml-2">
                    ({smsSegments} segments @ ${segmentCost.toFixed(3)} each)
                  </span>
                )}
              </div>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message here... (Always include: Reply STOP to unsubscribe)"
              rows={4}
              maxLength={480} // Max 3 SMS segments
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-400 focus:outline-none font-inter"
            />
            <p className="text-xs text-gray-500 mt-1 font-inter">
              Always include opt-out instructions in your message.
            </p>
          </div>

          {/* Templates */}
          <div>
            <p className="text-sm text-gray-400 mb-2 font-inter">
              Quick Templates:
            </p>
            <div className="flex flex-wrap gap-2">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(template.text)}
                  className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 hover:text-white transition-colors font-inter"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Test Mode Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="testMode"
              checked={testMode}
              onChange={(e) => setTestMode(e.target.checked)}
              className="w-5 h-5 bg-gray-800 border-gray-700 text-blue-400 rounded focus:ring-blue-400"
            />
            <label htmlFor="testMode" className="text-white font-inter">
              Test Mode
              <span className="text-gray-400 text-sm ml-2">
                (Send only to first contact - Cost: ${segmentCost.toFixed(4)})
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

          {/* Send Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSend}
              disabled={isPending || !message}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors font-inter ${
                testMode
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-blue-400 hover:bg-blue-500 text-black"
              } ${isPending || !message ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isPending
                ? "Sending..."
                : testMode
                  ? `Send Test SMS ($${segmentCost.toFixed(4)})`
                  : `Send to ${stats.eligibleContacts} Contacts ($${(segmentCost * stats.eligibleContacts).toFixed(2)})`}
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-2 font-inter">
              📱 Twilio Pricing
            </h3>
            <ul className="text-sm text-gray-400 space-y-1 font-inter">
              <li>• 1 SMS (160 chars) = $0.0079</li>
              <li>• 100 SMS = $0.79</li>
              <li>• 1,000 SMS = $7.90</li>
              <li>• Multi-segment messages cost per segment</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-800/30 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-2 font-inter">
              ⚖️ Compliance Requirements
            </h3>
            <ul className="text-sm text-gray-400 space-y-1 font-inter">
              <li>• Always include &quot;Reply STOP&quot;</li>
              <li>• Send only 8 AM - 9 PM local time</li>
              <li>• Identify your business</li>
              <li>• Honor opt-outs immediately</li>
            </ul>
          </div>
        </div>

        {/* Character Count Guide */}
        <div className="mt-4 p-4 bg-gray-800/30 rounded-lg">
          <h3 className="text-blue-400 font-semibold mb-2 font-inter">
            📊 SMS Length Guide
          </h3>
          <div className="text-sm text-gray-400 space-y-1 font-inter">
            <div>• 1-160 characters = 1 SMS</div>
            <div>• 161-306 characters = 2 SMS (153 chars each)</div>
            <div>• 307-459 characters = 3 SMS (153 chars each)</div>
            <div className="text-yellow-400 mt-2">
              💡 Keep messages under 160 characters for best cost efficiency
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
