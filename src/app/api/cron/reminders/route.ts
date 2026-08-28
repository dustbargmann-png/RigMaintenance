import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildInspectionAlerts, buildInventoryAlerts, type DashboardAlert } from "@/lib/dashboard";

// Only email things that are actually close — the in-app dashboard shows a
// wider 30-day window, but a daily inbox reminder for something due in three
// weeks is just noise.
const REMINDER_WINDOW_DAYS = 7;
const APP_URL = "https://rigmaintenance.net";

function urgencyLabel(alert: DashboardAlert): { text: string; color: string } {
  if (alert.neverDone) return { text: "Never inspected", color: "#b91c1c" };
  if (alert.daysUntil < 0) return { text: `Overdue by ${-alert.daysUntil}d`, color: "#b91c1c" };
  if (alert.daysUntil === 0) return { text: "Due today", color: "#b91c1c" };
  return { text: `Due in ${alert.daysUntil}d`, color: "#b45309" };
}

function buildEmailHtml(companyName: string, alerts: DashboardAlert[]): string {
  const rows = alerts
    .map((alert) => {
      const urgency = urgencyLabel(alert);
      return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#17324a;">${alert.unitLabel}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#17324a;">${alert.title}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;font-weight:600;color:${urgency.color};">${urgency.text}</td>
        </tr>`;
    })
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#17324a;">RigMaintenance — ${companyName}</h2>
      <p style="color:#374151;font-size:14px;">${alerts.length} item${alerts.length === 1 ? "" : "s"} need attention:</p>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px 12px;font-size:12px;color:#6b7280;border-bottom:2px solid #17324a;">Unit</th>
            <th style="text-align:left;padding:8px 12px;font-size:12px;color:#6b7280;border-bottom:2px solid #17324a;">Item</th>
            <th style="text-align:left;padding:8px 12px;font-size:12px;color:#6b7280;border-bottom:2px solid #17324a;">Status</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin-top:20px;">
        <a href="${APP_URL}" style="background:#17324a;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-size:14px;">Open RigMaintenance</a>
      </p>
    </div>`;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data: companies, error: companiesError } = await supabase
    .from("companies")
    .select("id, name");
  if (companiesError) {
    return NextResponse.json({ error: companiesError.message }, { status: 500 });
  }

  const results: { company: string; alerts: number; sentTo: number; error?: string }[] = [];

  for (const company of companies ?? []) {
    const { data: units, error: unitsError } = await supabase
      .from("units")
      .select("id, label")
      .eq("company_id", company.id);
    if (unitsError) {
      results.push({ company: company.name, alerts: 0, sentTo: 0, error: unitsError.message });
      continue;
    }
    if (!units || units.length === 0) continue;

    const unitIds = units.map((u) => u.id);
    const unitLabelById = new Map(units.map((u) => [u.id, u.label]));

    const [templatesRes, logsRes, inventoryRes, adminsRes] = await Promise.all([
      supabase
        .from("checklist_templates")
        .select("id, name, interval_days")
        .eq("is_active", true)
        .or(`company_id.eq.${company.id},company_id.is.null`),
      supabase
        .from("inspection_logs")
        .select("unit_id, template_id, performed_at")
        .eq("company_id", company.id),
      supabase
        .from("inventory_items")
        .select("id, unit_id, name, warranty_expiration_date, next_maintenance_date")
        .in("unit_id", unitIds),
      supabase.from("users").select("email").eq("company_id", company.id).eq("role", "admin"),
    ]);

    const queryError =
      templatesRes.error?.message ?? logsRes.error?.message ?? inventoryRes.error?.message ?? adminsRes.error?.message;
    if (queryError) {
      results.push({ company: company.name, alerts: 0, sentTo: 0, error: queryError });
      continue;
    }

    const inspectionAlerts = buildInspectionAlerts(units, templatesRes.data ?? [], logsRes.data ?? []);
    const inventoryAlerts = buildInventoryAlerts(inventoryRes.data ?? [], unitLabelById);
    const alerts = [...inspectionAlerts, ...inventoryAlerts]
      .filter((a) => a.daysUntil <= REMINDER_WINDOW_DAYS)
      .sort((a, b) => a.daysUntil - b.daysUntil);

    const admins = adminsRes.data ?? [];
    if (alerts.length === 0 || admins.length === 0) continue;

    const { error: sendError } = await resend.emails.send({
      from: "RigMaintenance <noreply@rigmaintenance.net>",
      to: admins.map((a) => a.email),
      subject: `RigMaintenance: ${alerts.length} item${alerts.length === 1 ? "" : "s"} need attention`,
      html: buildEmailHtml(company.name, alerts),
    });

    results.push({
      company: company.name,
      alerts: alerts.length,
      sentTo: sendError ? 0 : admins.length,
      error: sendError?.message,
    });
  }

  return NextResponse.json({ ok: true, results });
}
