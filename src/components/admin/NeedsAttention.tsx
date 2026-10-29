import Link from "next/link";
import type { Route } from "next";
import {
  BellAlertIcon,
  CheckCircleIcon,
  UserPlusIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import { getAttentionItemsAction } from "@/actions/stats/getAttentionItemsAction";
import { ADMIN_ROUTES } from "@/config/adminRoutes";
import {
  daysUntil,
  formatCurrency,
  formatDaysAgo,
  formatDeadline,
} from "@/lib/utils";

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface Row {
  key: string;
  href: Route;
  primary: string;
  secondary: string;
  /** Short status at the right; `urgent` paints it red */
  note: string;
  urgent?: boolean;
}

interface Group {
  key: string;
  title: string;
  icon: IconComponent;
  count: number;
  allHref: Route;
  rows: Row[];
  empty: string;
}

const money = (cents: number) => formatCurrency(cents, true);

export default async function NeedsAttention() {
  const data = await getAttentionItemsAction();
  const now = new Date();

  const groups: Group[] = [
    {
      key: "leads",
      title: "New leads",
      icon: UserPlusIcon,
      count: data.newLeads.count,
      allHref: ADMIN_ROUTES.contacts,
      empty: "Every lead has been answered",
      rows: data.newLeads.items.map((c) => ({
        key: c.id,
        href: ADMIN_ROUTES.contacts,
        primary: c.name,
        secondary: "",
        note: formatDaysAgo(c.createdAt, now),
        // Two days without a reply is already late for a lead
        urgent: daysUntil(c.createdAt, now) <= -2,
      })),
    },
    {
      key: "quotes",
      title: "Open quotes",
      icon: ClipboardDocumentListIcon,
      count: data.openQuotes.count,
      allHref: ADMIN_ROUTES.quotes,
      empty: "No quote is waiting on the customer",
      rows: data.openQuotes.items.map((q) => {
        const days = daysUntil(q.expiresAt, now);
        return {
          key: q.id,
          href: `${ADMIN_ROUTES.quotes}/${q.id}` as Route,
          primary: q.name,
          secondary: `${q.quoteNumber} · ${money(q.totalAmount)}`,
          note: days < 0 ? "expired" : formatDeadline(q.expiresAt, now).replace("due", "expires"),
          urgent: days <= 7,
        };
      }),
    },
    {
      key: "payments",
      title: "Final payments",
      icon: BanknotesIcon,
      count: data.readyForPayment.count,
      allHref: ADMIN_ROUTES.projects,
      empty: "No project is waiting for its final payment",
      rows: data.readyForPayment.items.map((p) => ({
        key: p.id,
        href: `${ADMIN_ROUTES.projects}/${p.id}` as Route,
        primary: p.name,
        secondary: p.planName,
        note: `${money(p.totalAmount / 2)} due`,
      })),
    },
    {
      key: "milestones",
      title: "Overdue milestones",
      icon: FlagIcon,
      count: data.overdueMilestones.count,
      allHref: ADMIN_ROUTES.projects,
      empty: "Every milestone is on schedule",
      rows: data.overdueMilestones.items.map((m) => ({
        key: m.id,
        href: `${ADMIN_ROUTES.projects}/${m.project.id}` as Route,
        primary: m.title,
        secondary: m.project.name,
        note: formatDeadline(m.dueDate, now),
        urgent: true,
      })),
    },
  ];

  const total = groups.reduce((sum, g) => sum + g.count, 0);

  return (
    <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50">
      <div className="flex items-center gap-3 mb-4">
        {total > 0 ? (
          <BellAlertIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gold shrink-0" aria-hidden="true" />
        ) : (
          <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 shrink-0" aria-hidden="true" />
        )}
        <h3 className="text-xl sm:text-2xl text-white font-iceland">Needs attention</h3>
        <span className="ml-auto text-xs text-gray-500 font-inter">
          {total === 0
            ? "All clear"
            : `${total} ${total === 1 ? "item" : "items"} waiting on you`}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {groups.map((group) => {
          const Icon = group.icon;
          return (
            <section
              key={group.key}
              aria-labelledby={`attention-${group.key}`}
              className="min-w-0 rounded-lg bg-gray-700/30 border border-gray-700/50 p-3 sm:p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
                <h4
                  id={`attention-${group.key}`}
                  className="text-sm font-semibold text-gray-300 font-inter truncate"
                >
                  {group.title}
                </h4>
                <span
                  className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold font-inter tabular-nums ${
                    group.count > 0
                      ? "bg-gold/15 text-gold"
                      : "bg-gray-700/60 text-gray-500"
                  }`}
                >
                  {group.count}
                </span>
              </div>

              {group.rows.length === 0 ? (
                <p className="text-xs text-gray-500 font-inter py-2">{group.empty}</p>
              ) : (
                <ul className="divide-y divide-gray-700/50">
                  {group.rows.map((row) => (
                    <li key={row.key}>
                      <Link
                        href={row.href}
                        className="block py-2 -mx-1 px-1 rounded-sm hover:bg-gray-700/40 transition-colors font-inter"
                      >
                        <span className="flex items-baseline gap-2">
                          <span className="min-w-0 flex-1 text-sm text-white truncate">
                            {row.primary}
                          </span>
                          <span
                            className={`shrink-0 text-xs tabular-nums ${
                              row.urgent ? "text-red-400" : "text-gray-400"
                            }`}
                          >
                            {row.note}
                          </span>
                        </span>
                        {row.secondary ? (
                          <span className="block text-xs text-gray-500 truncate">
                            {row.secondary}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {group.count > group.rows.length ? (
                <Link
                  href={group.allHref}
                  className="mt-2 inline-block text-xs text-gold hover:underline font-inter"
                >
                  View all {group.count}
                </Link>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
