import { Suspense } from "react";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import Tabs from "@/components/ui/Tabs";
import {
  CampaignsPanel,
  LeadsBySourcePanel,
  RevenuePanel,
} from "@/components/admin/LeadSourcesPanels";
import LeadSourcesPanelSkeleton from "@/components/skeletons/LeadSourcesPanelSkeleton";

/**
 * Where leads come from and what they turn into, in one card: lead source,
 * UTM campaigns and attributed revenue. Each tab streams on its own and
 * switching tabs happens in the browser without fetching again.
 */
export default function LeadSources() {
  return (
    <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50">
      <Tabs
        label="Lead sources"
        heading={
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gold shrink-0" aria-hidden="true" />
            <h3 className="text-xl sm:text-2xl text-white font-iceland">Lead sources</h3>
          </div>
        }
        headerClassName="flex flex-col sm:flex-row sm:items-center gap-3 mb-5"
        listClassName="self-start sm:self-auto sm:ml-auto"
        tabs={[
          {
            id: "source",
            label: "By source",
            content: (
              <Suspense fallback={<LeadSourcesPanelSkeleton />}>
                <LeadsBySourcePanel />
              </Suspense>
            ),
          },
          {
            id: "campaigns",
            label: "Campaigns",
            content: (
              <Suspense fallback={<LeadSourcesPanelSkeleton />}>
                <CampaignsPanel />
              </Suspense>
            ),
          },
          {
            id: "revenue",
            label: "Revenue",
            content: (
              <Suspense fallback={<LeadSourcesPanelSkeleton />}>
                <RevenuePanel />
              </Suspense>
            ),
          },
        ]}
      />
    </div>
  );
}
