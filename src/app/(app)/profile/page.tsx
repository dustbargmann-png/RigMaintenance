import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import { buildInspectionAlerts, buildInventoryAlerts } from "@/lib/dashboard";
import { SubmitButton } from "@/components/submit-button";
import { changePassword } from "./actions";

type InspectionLogRow = { unit_id: string; template_id: string; performed_at: string };

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  const user = await getCurrentUser();
  if (!user) return null;

  let companyStats: {
    inviteCode: string;
    unitCount: number;
    technicianCount: number;
    needsAttentionCount: number;
  } | null = null;

  if (user.role === "admin") {
    const supabase = await createClient();

    const [
      { data: company },
      { count: unitCount },
      { count: technicianCount },
      { data: units },
      { data: templates },
      { data: logs },
      { data: inventoryItems },
    ] = await Promise.all([
      supabase.from("companies").select("invite_code").eq("id", user.companyId).single(),
      supabase.from("units").select("id", { count: "exact", head: true }),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "technician"),
      supabase.from("units").select("id, label"),
      supabase.from("checklist_templates").select("id, name, interval_days").eq("is_active", true),
      supabase.from("inspection_logs").select("unit_id, template_id, performed_at").not("template_id", "is", null),
      supabase
        .from("inventory_items")
        .select("id, unit_id, name, warranty_expiration_date, next_maintenance_date"),
    ]);

    const unitLabelById = new Map((units ?? []).map((u) => [u.id, u.label]));
    const alerts = [
      ...buildInspectionAlerts(units ?? [], templates ?? [], (logs ?? []) as InspectionLogRow[]),
      ...buildInventoryAlerts(inventoryItems ?? [], unitLabelById),
    ];

    companyStats = {
      inviteCode: company?.invite_code ?? "",
      unitCount: unitCount ?? 0,
      technicianCount: technicianCount ?? 0,
      needsAttentionCount: alerts.length,
    };
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Profile</h1>

      {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && (
        <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">Password updated.</p>
      )}

      <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="font-medium">{user.name}</p>
          {user.role === "admin" ? (
            <span className="rounded-full bg-gold-50 px-2 py-0.5 text-xs font-medium text-gold-700">
              Admin
            </span>
          ) : (
            <span className="rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-700">
              Technician
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">{user.email}</p>
        <p className="text-sm text-gray-600">{user.companyName}</p>
      </div>

      {companyStats && (
        <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="font-semibold">Company overview</h2>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold text-navy-800">{companyStats.unitCount}</p>
              <p className="text-xs text-gray-500">Units</p>
            </div>
            <div>
              <p className="text-lg font-bold text-navy-800">{companyStats.technicianCount}</p>
              <p className="text-xs text-gray-500">Technicians</p>
            </div>
            <div>
              <p className="text-lg font-bold text-navy-800">{companyStats.needsAttentionCount}</p>
              <p className="text-xs text-gray-500">Needs attention</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
            <div>
              <p className="text-xs text-gray-500">Invite code</p>
              <p className="font-mono text-sm text-navy-700">{companyStats.inviteCode}</p>
            </div>
            <Link
              href="/team"
              className="min-h-11 flex-shrink-0 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold active:bg-gray-100"
            >
              Manage team →
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="font-semibold">Change password</h2>
        <form action={changePassword} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">New password</span>
            <input
              name="password"
              type="password"
              minLength={6}
              required
              className="min-h-12 rounded-md border border-gray-300 px-4 text-base"
            />
          </label>
          <SubmitButton className="min-h-12 rounded-md bg-navy-700 px-4 text-base font-semibold text-white active:bg-navy-800">
            Update password
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
