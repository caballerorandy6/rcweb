import {
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  LinkIcon,
  MegaphoneIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  UserGroupIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { getLeadsBySourceAction } from "@/actions/stats/getLeadsBySourceAction";
import { getLeadsByUTMAction } from "@/actions/stats/getLeadsByUTMAction";
import { getRevenueAttributionAction } from "@/actions/stats/getRevenueAttributionAction";
import type { LeadStatus } from "@/generated/prisma/enums";
import { LEAD_STATUSES, LEAD_STATUS_CLASSES, LEAD_STATUS_LABELS } from "@/lib/leadStatus";
import { leadSourceColor, leadSourceLabel, utmSourceColor } from "@/lib/leadSources";
import { formatCurrency, formatNumber } from "@/lib/utils";

// The three panels of the Lead sources card. Each one fetches its own data
// so it streams independently inside its tab.

type Icon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const STATUS_ICONS: Record<LeadStatus, Icon> = {
  NEW: SparklesIcon,
  CONTACTED: ClockIcon,
  INTERESTED: UserGroupIcon,
  PROPOSAL_SENT: PaperAirplaneIcon,
  WON: CheckCircleIcon,
  LOST: XCircleIcon,
};

// Revenue is shown in whole dollars
const money = (cents: number) => formatCurrency(cents, true);
const plural = (count: number, noun: string) => `${count} ${noun}${count === 1 ? "" : "s"}`;

/** Figures that sum up the panel, above its content */
function Summary({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400 font-inter mb-4">
      {children}
    </p>
  );
}

function SubHeading({ icon: Icon, children }: { icon: Icon; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-gray-400" aria-hidden="true" />
      <h4 className="text-sm font-semibold text-gray-300 font-inter">{children}</h4>
    </div>
  );
}

function SourceBar({
  label,
  value,
  note,
  percentage,
  color,
}: {
  label: string;
  value: string;
  note: string;
  percentage: number;
  color: string;
}) {
  return (
    <div className="font-inter">
      <div className="flex items-center justify-between mb-1 gap-2">
        <span className="text-xs sm:text-sm text-gray-300 truncate">{label}</span>
        <span className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs sm:text-sm font-semibold text-white">{value}</span>
          <span className="text-[10px] sm:text-xs text-gray-500">({note})</span>
        </span>
      </div>
      <div className="h-2 sm:h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.max(percentage, 2)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function ListRow({
  primary,
  secondary,
  value,
  muted = false,
  network,
}: {
  primary: string;
  secondary?: string;
  value: string;
  muted?: boolean;
  /** Which line holds a utm_source ("google" → "Google") */
  network?: "primary" | "secondary";
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 p-2.5 rounded-lg font-inter ${
        muted ? "bg-gray-700/20 border border-dashed border-gray-600" : "bg-gray-700/30"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm truncate ${muted ? "text-gray-400" : "text-white"} ${
            network === "primary" ? "capitalize" : ""
          }`}
        >
          {primary}
        </p>
        {secondary ? (
          <p className={`text-xs text-gray-500 ${network === "secondary" ? "capitalize" : ""}`}>
            {secondary}
          </p>
        ) : null}
      </div>
      <span className={`text-sm font-bold shrink-0 ${muted ? "text-gray-400" : "text-gold"}`}>
        {value}
      </span>
    </div>
  );
}

function Empty({ icon: Icon, title, hint }: { icon: Icon; title: string; hint: string }) {
  return (
    <div className="text-center py-8">
      <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3" aria-hidden="true" />
      <p className="text-gray-400 font-inter text-sm sm:text-base mx-auto">{title}</p>
      <p className="text-xs sm:text-sm text-gray-500 font-inter mt-1 text-pretty mx-auto">{hint}</p>
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 pt-4 border-t border-gray-700/50">
      <p className="text-[10px] sm:text-xs text-gray-500 font-inter text-pretty">{children}</p>
    </div>
  );
}

/** Tab "By source": pipeline status and where every contact came from */
export async function LeadsBySourcePanel() {
  const data = await getLeadsBySourceAction();

  return (
    <>
      <Summary>
        <span>
          Total: <span className="text-gold font-semibold">{formatNumber(data.total)}</span> leads
        </span>
      </Summary>

      <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 mb-6">
        {LEAD_STATUSES.map((status) => {
          const Icon = STATUS_ICONS[status];
          return (
            <li
              key={status}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-inter ${LEAD_STATUS_CLASSES[status]}`}
            >
              <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <span className="text-xs text-gray-400 block truncate">
                  {LEAD_STATUS_LABELS[status]}
                </span>
                <span className="font-bold text-sm">{formatNumber(data.byStatus[status])}</span>
              </div>
            </li>
          );
        })}
      </ul>

      {data.sources.length > 0 ? (
        <>
          <div className="space-y-3">
            {data.sources.map((source) => (
              <SourceBar
                key={source.source}
                label={leadSourceLabel(source.source)}
                value={formatNumber(source.count)}
                note={`${source.percentage}%`}
                percentage={source.percentage}
                color={leadSourceColor(source.source)}
              />
            ))}
          </div>
          <Hint>
            Sources are recorded automatically by the contact form, the guide download, the
            blog subscription and the other conversion points of the site.
          </Hint>
        </>
      ) : (
        <Empty
          icon={UserGroupIcon}
          title="No leads recorded yet"
          hint="Leads will appear here as they come in from the site and from manual entries."
        />
      )}
    </>
  );
}

/** Tab "Campaigns": utm_source and utm_campaign of the leads that carried them */
export async function CampaignsPanel() {
  const data = await getLeadsByUTMAction();
  const hasData = data.bySources.length > 0 || data.byCampaigns.length > 0;

  return (
    <>
      <Summary>
        <span>
          With UTM: <span className="text-green-400 font-semibold">{formatNumber(data.totalWithUTM)}</span>
        </span>
        <span>
          Direct: <span className="text-gray-300 font-semibold">{formatNumber(data.totalWithoutUTM)}</span>
        </span>
      </Summary>

      {hasData ? (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <SubHeading icon={GlobeAltIcon}>By network</SubHeading>
              {data.bySources.length > 0 ? (
                <div className="space-y-2.5">
                  {data.bySources.map((source) => (
                    <SourceBar
                      key={source.utmSource}
                      label={source.utmSource}
                      value={formatNumber(source.count)}
                      note={`${source.percentage}%`}
                      percentage={source.percentage}
                      color={utmSourceColor(source.utmSource)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 font-inter">No utm_source recorded yet</p>
              )}
            </div>

            <div>
              <SubHeading icon={MegaphoneIcon}>Top campaigns</SubHeading>
              {data.byCampaigns.length > 0 ? (
                <div className="space-y-2">
                  {data.byCampaigns.map((campaign) => (
                    <ListRow
                      key={`${campaign.utmCampaign}-${campaign.utmSource ?? ""}`}
                      primary={campaign.utmCampaign}
                      secondary={campaign.utmSource ?? undefined}
                      network="secondary"
                      value={formatNumber(campaign.count)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 font-inter">No utm_campaign recorded yet</p>
              )}
            </div>
          </div>
          <Hint>
            UTM parameters are captured from the URL the lead arrived on, for example
            ?utm_source=google&utm_campaign=spring_sale.
          </Hint>
        </>
      ) : (
        <Empty
          icon={LinkIcon}
          title="No campaign data yet"
          hint="Add utm_source and utm_campaign to the links you share and the leads they bring will show up here."
        />
      )}
    </>
  );
}

/** Tab "Revenue": paid projects credited to the lead source and campaign of their contact */
export async function RevenuePanel() {
  const data = await getRevenueAttributionAction();

  return (
    <>
      <Summary>
        <span>
          Total: <span className="text-green-400 font-semibold">{money(data.totalRevenue)}</span>
        </span>
        <span>{plural(data.totalPaidProjects, "paid project")}</span>
      </Summary>

      {data.totalPaidProjects > 0 ? (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <SubHeading icon={UserGroupIcon}>By lead source</SubHeading>
              {data.byLeadSource.length > 0 ? (
                <div className="space-y-2.5">
                  {data.byLeadSource.map((source) => (
                    <SourceBar
                      key={source.source}
                      label={leadSourceLabel(source.source)}
                      value={money(source.revenue)}
                      note={plural(source.count, "project")}
                      percentage={source.percentage}
                      color={leadSourceColor(source.source)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 font-inter">No project is linked to a contact yet</p>
              )}
            </div>

            <div>
              <SubHeading icon={MegaphoneIcon}>By campaign network</SubHeading>
              <div className="space-y-2">
                {data.byUTMSource.map((utm) => (
                  <ListRow
                    key={utm.utmSource}
                    primary={utm.utmSource}
                    secondary={plural(utm.count, "project")}
                    network="primary"
                    value={money(utm.revenue)}
                  />
                ))}
                {data.byUTMSource.length === 0 ? (
                  <p className="text-sm text-gray-500 font-inter">No revenue from tracked campaigns yet</p>
                ) : null}
                {data.unattributed.count > 0 ? (
                  <ListRow
                    muted
                    primary="Not linked to a contact"
                    secondary={plural(data.unattributed.count, "project")}
                    value={money(data.unattributed.revenue)}
                  />
                ) : null}
              </div>
            </div>
          </div>
          <Hint>
            A paid project is credited to the contact with the same email, so each source and
            campaign gets the revenue it brought in.
          </Hint>
        </>
      ) : (
        <Empty
          icon={CurrencyDollarIcon}
          title="No revenue yet"
          hint="Once a deposit is paid, the project is credited to the lead source and campaign of its contact."
        />
      )}
    </>
  );
}
