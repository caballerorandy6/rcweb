import { render } from "@react-email/components";
import { createElement } from "react";
import { z } from "zod";
import { requireAdmin } from "@/lib/authGuard";
import { loadMaintenanceReportEmail } from "@/lib/maintenanceReport/loadEmail";
import { MaintenanceReportEmail } from "@/lib/email/templates";

export const dynamic = "force-dynamic";

const ParamsSchema = z.object({ id: z.uuid(), reportId: z.uuid() });

/** GET /subscriptions/[id]/reports/[reportId]: the report email exactly as the customer gets it, with the saved figures */
export async function GET(_request: Request, context: { params: Promise<{ id: string; reportId: string }> }) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return new Response("Not found", { status: 404 });
  }

  const parsed = ParamsSchema.safeParse(await context.params);
  if (!parsed.success) {
    return new Response("Not found", { status: 404 });
  }

  const report = await loadMaintenanceReportEmail(parsed.data.reportId);
  if (!report || report.subscriptionId !== parsed.data.id) {
    return new Response("Not found", { status: 404 });
  }

  const html = await render(createElement(MaintenanceReportEmail, report.email));
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
