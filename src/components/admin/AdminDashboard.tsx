import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  PlusCircleIcon,
  UserPlusIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import { ADMIN_LOGIN_ROUTE, ADMIN_ROUTES } from "@/config/adminRoutes";
import NeedsAttention from "@/components/admin/NeedsAttention";
import NeedsAttentionSkeleton from "@/components/skeletons/NeedsAttentionSkeleton";
import StatsGrid from "@/components/admin/StatsGrid";
import StatsGridSkeleton from "@/components/skeletons/StatsGridSkeleton";
import LeadsBySource from "@/components/admin/LeadsBySource";
import LeadsBySourceSkeleton from "@/components/skeletons/LeadsBySourceSkeleton";
import LeadsTrendChartWrapper from "@/components/admin/LeadsTrendChartWrapper";
import LeadsTrendChartSkeleton from "@/components/skeletons/LeadsTrendChartSkeleton";
import LeadsByUTM from "@/components/admin/LeadsByUTM";
import LeadsByUTMSkeleton from "@/components/skeletons/LeadsByUTMSkeleton";
import RevenueAttribution from "@/components/admin/RevenueAttribution";
import RevenueAttributionSkeleton from "@/components/skeletons/RevenueAttributionSkeleton";
import SearchPerformance from "@/components/admin/SearchPerformance";
import SearchPerformanceSkeleton from "@/components/skeletons/SearchPerformanceSkeleton";
import GoogleReviews from "@/components/admin/GoogleReviews";
import GoogleReviewsSkeleton from "@/components/skeletons/GoogleReviewsSkeleton";

const ICON = "w-4 h-4";

// The things the admin does most, one click from the top of the page
const quickActions = [
  { label: "New quote", href: `${ADMIN_ROUTES.quotes}/new`, icon: PlusCircleIcon, primary: true },
  { label: "Add contact", href: `${ADMIN_ROUTES.contacts}?action=new`, icon: UserPlusIcon },
  { label: "Newsletter", href: ADMIN_ROUTES.newsletter, icon: EnvelopeIcon },
  { label: "SMS", href: ADMIN_ROUTES.sms, icon: ChatBubbleLeftRightIcon },
] as const;

function DashboardSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3 border-b border-gray-800 pb-2">
        <h2 id={id} className="text-2xl text-white font-iceland text-pretty">
          {title}
        </h2>
        <p className="text-xs text-gray-500 font-inter">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default async function AdminDashboard() {
  const session = await auth();

  // The layout already checks the session; kept as a second guard
  if (!session || session.user.role !== "ADMIN") {
    redirect(ADMIN_LOGIN_ROUTE);
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header: title, who is signed in, and the quick actions */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl text-gold font-iceland text-pretty">
            Dashboard
          </h1>
          <p className="text-gray-400 font-inter text-sm sm:text-base mt-1">
            Signed in as <span className="text-gold">{session.user.name}</span>
          </p>
        </div>
        <nav aria-label="Quick actions" className="flex flex-wrap gap-2">
          {quickActions.map(({ label, href, icon: Icon, ...action }) => (
            <Button
              key={href}
              href={href}
              size="sm"
              variant={"primary" in action ? "primary" : "secondary"}
            >
              <Icon className={ICON} aria-hidden="true" />
              {label}
            </Button>
          ))}
        </nav>
      </header>

      <DashboardSection
        id="at-a-glance"
        title="Business at a glance"
        description="Where things stand right now"
      >
        <Suspense fallback={<NeedsAttentionSkeleton />}>
          <NeedsAttention />
        </Suspense>
        <Suspense fallback={<StatsGridSkeleton />}>
          <StatsGrid />
        </Suspense>
      </DashboardSection>

      <DashboardSection
        id="pipeline"
        title="Pipeline & revenue"
        description="Where leads come from and what they turn into"
      >
        <Suspense fallback={<LeadsTrendChartSkeleton />}>
          <LeadsTrendChartWrapper />
        </Suspense>
        <Suspense fallback={<LeadsBySourceSkeleton />}>
          <LeadsBySource />
        </Suspense>
        <Suspense fallback={<LeadsByUTMSkeleton />}>
          <LeadsByUTM />
        </Suspense>
        <Suspense fallback={<RevenueAttributionSkeleton />}>
          <RevenueAttribution />
        </Suspense>
      </DashboardSection>

      <DashboardSection
        id="online-presence"
        title="Online presence"
        description="How the site shows up on Google"
      >
        <Suspense fallback={<SearchPerformanceSkeleton />}>
          <SearchPerformance />
        </Suspense>
        <Suspense fallback={<GoogleReviewsSkeleton />}>
          <GoogleReviews />
        </Suspense>
      </DashboardSection>
    </div>
  );
}
