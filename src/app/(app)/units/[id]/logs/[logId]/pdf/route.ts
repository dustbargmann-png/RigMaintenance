import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import type { ChecklistItem, InspectionLogItem, InspectionLogPhoto } from "@/lib/types";
import { InspectionReportDocument } from "@/lib/pdf/inspection-report";

type LogWithRelations = {
  id: string;
  performed_at: string;
  overall_status: string;
  notes: string | null;
  template_id: string | null;
  companies: { name: string } | { name: string }[] | null;
  units: { label: string; make: string | null; model: string | null } | { label: string; make: string | null; model: string | null }[] | null;
  users: { name: string } | { name: string }[] | null;
  checklist_templates: { name: string } | { name: string }[] | null;
  inventory_items: { name: string } | { name: string }[] | null;
};

function one<T>(rel: T | T[] | null): T | null {
  return Array.isArray(rel) ? (rel[0] ?? null) : rel;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; logId: string }> },
) {
  const { id: unitId, logId } = await params;
  const supabase = await createClient();

  const { data: log, error: logError } = await supabase
    .from("inspection_logs")
    .select(
      "*, companies(name), units(label, make, model), users(name), checklist_templates(name), inventory_items(name)",
    )
    .eq("id", logId)
    .eq("unit_id", unitId)
    .maybeSingle<LogWithRelations>();

  if (logError || !log) {
    return NextResponse.json({ error: logError?.message ?? "Log not found" }, { status: 404 });
  }

  const company = one(log.companies);
  const unit = one(log.units);
  const performedBy = one(log.users);
  const template = one(log.checklist_templates);
  const inventoryItem = one(log.inventory_items);

  const { data: photos, error: photosError } = await supabase
    .from("inspection_log_photos")
    .select("*")
    .eq("inspection_log_id", logId)
    .returns<InspectionLogPhoto[]>();
  if (photosError) {
    return NextResponse.json({ error: photosError.message }, { status: 500 });
  }

  let items: { label: string; response: string | null; notes: string | null }[] = [];

  if (log.template_id) {
    const [{ data: checklistItems, error: itemsError }, { data: logItems, error: logItemsError }] = await Promise.all([
      supabase
        .from("checklist_items")
        .select("*")
        .eq("template_id", log.template_id)
        .order("sort_order", { ascending: true })
        .returns<ChecklistItem[]>(),
      supabase
        .from("inspection_log_items")
        .select("*")
        .eq("inspection_log_id", logId)
        .returns<InspectionLogItem[]>(),
    ]);
    if (itemsError || logItemsError) {
      return NextResponse.json(
        { error: itemsError?.message ?? logItemsError?.message },
        { status: 500 },
      );
    }

    const byItemId = new Map((logItems ?? []).map((li) => [li.checklist_item_id, li]));
    items = (checklistItems ?? []).map((ci) => {
      const logItem = byItemId.get(ci.id);
      return { label: ci.label, response: logItem?.response ?? null, notes: logItem?.notes ?? null };
    });
  }

  const unitDetail = unit ? [unit.make, unit.model].filter(Boolean).join(" ") || null : null;

  const buffer = await renderToBuffer(
    InspectionReportDocument({
      companyName: company?.name ?? "",
      unitLabel: unit?.label ?? "Unit",
      unitDetail,
      reportTitle: template ? template.name : inventoryItem ? `Service: ${inventoryItem.name}` : "Service log",
      performedByName: performedBy?.name ?? "Unknown",
      performedAt: new Date(log.performed_at).toLocaleString(),
      overallStatus: log.overall_status,
      items,
      logNotes: log.notes,
      photoUrls: (photos ?? []).map((p) => p.photo_url),
      generatedAt: new Date().toLocaleString(),
    }),
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="inspection-${logId}.pdf"`,
    },
  });
}
