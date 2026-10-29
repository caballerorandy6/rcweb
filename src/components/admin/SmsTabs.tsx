import Tabs from "@/components/ui/Tabs";

interface SmsTabsProps {
  children: [React.ReactNode, React.ReactNode]; // [SendCampaign, DeliveryStats]
}

/** SMS page: the campaign form and the delivery report as two tabs */
export default function SmsTabs({ children }: SmsTabsProps) {
  const [sendCampaign, deliveryStats] = children;

  return (
    <div className="min-h-screen bg-gray-900 pb-8 px-8 py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">
        <Tabs
          label="SMS campaigns"
          variant="underline"
          heading={<h1 className="text-4xl text-gold font-iceland">SMS Campaigns</h1>}
          headerClassName="flex flex-col gap-6 mb-8"
          tabs={[
            { id: "send", label: "Send Campaign", content: sendCampaign },
            { id: "stats", label: "Delivery Report", content: deliveryStats },
          ]}
        />
      </div>
    </div>
  );
}
