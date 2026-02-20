"use client";

import { useState } from "react";

interface SmsTabsProps {
  children: [React.ReactNode, React.ReactNode]; // [SendCampaign, DeliveryStats]
}

export default function SmsTabs({ children }: SmsTabsProps) {
  const [activeTab, setActiveTab] = useState<"send" | "stats">("send");

  const [sendCampaignComponent, deliveryStatsComponent] = children;

  return (
    <div className="min-h-screen bg-gray-900 pb-8 px-8 py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">
        {/* Tabs Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold mb-6 font-iceland">
            SMS Campaigns
          </h1>

          <div className="flex gap-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab("send")}
              className={`px-6 py-3 font-semibold transition-colors font-inter relative ${
                activeTab === "send"
                  ? "text-gold"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Send Campaign
              {activeTab === "send" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("stats")}
              className={`px-6 py-3 font-semibold transition-colors font-inter relative ${
                activeTab === "stats"
                  ? "text-gold"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Delivery Report
              {activeTab === "stats" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "send" && sendCampaignComponent}
          {activeTab === "stats" && deliveryStatsComponent}
        </div>
      </div>
    </div>
  );
}
