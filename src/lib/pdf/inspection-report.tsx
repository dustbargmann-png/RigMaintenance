import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

const NAVY = "#17324a";
const GOLD = "#b8860b";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica", color: "#1f2937" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  wordmark: { fontSize: 16, fontWeight: 700, color: NAVY },
  wordmarkGold: { color: GOLD },
  companyName: { fontSize: 10, color: "#6b7280", marginTop: 2 },
  title: { fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 2 },
  metaLine: { fontSize: 10, color: "#374151", marginBottom: 2 },
  statusBadge: { fontSize: 10, fontWeight: 700, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 4, alignSelf: "flex-start", marginTop: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 11, fontWeight: 700, color: NAVY, marginTop: 14, marginBottom: 6 },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: NAVY, paddingBottom: 4, marginBottom: 2 },
  tableRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#e5e7eb", paddingVertical: 4 },
  colLabel: { flex: 3 },
  colResponse: { flex: 1, fontWeight: 700 },
  colNotes: { flex: 2, color: "#6b7280" },
  headerText: { fontSize: 9, color: "#6b7280", fontWeight: 700 },
  notesBox: { marginTop: 4, padding: 8, backgroundColor: "#f9fafb", borderRadius: 4 },
  photosGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  photo: { width: 140, height: 140, objectFit: "cover", borderRadius: 4 },
  footer: { position: "absolute", bottom: 24, left: 32, right: 32, fontSize: 8, color: "#9ca3af", textAlign: "center" },
});

const RESPONSE_LABELS: Record<string, string> = {
  pass: "Pass",
  fail: "Fail",
  yes: "Yes",
  no: "No",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pass: { bg: "#f0fdf4", text: "#15803d" },
  fail: { bg: "#fef2f2", text: "#b91c1c" },
  needs_follow_up: { bg: "#fffbeb", text: "#b45309" },
};

const STATUS_LABELS: Record<string, string> = {
  pass: "Pass",
  fail: "Fail",
  needs_follow_up: "Needs follow-up",
};

export type InspectionReportProps = {
  companyName: string;
  unitLabel: string;
  unitDetail: string | null;
  reportTitle: string;
  performedByName: string;
  performedAt: string;
  overallStatus: string;
  items: { label: string; response: string | null; notes: string | null }[];
  logNotes: string | null;
  photoUrls: string[];
  generatedAt: string;
};

export function InspectionReportDocument({
  companyName,
  unitLabel,
  unitDetail,
  reportTitle,
  performedByName,
  performedAt,
  overallStatus,
  items,
  logNotes,
  photoUrls,
  generatedAt,
}: InspectionReportProps) {
  const statusColor = STATUS_COLORS[overallStatus] ?? STATUS_COLORS.pass;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.wordmark}>
              Rig<Text style={styles.wordmarkGold}>Maintenance</Text>
            </Text>
            <Text style={styles.companyName}>{companyName}</Text>
          </View>
          <Text style={{ fontSize: 9, color: "#9ca3af" }}>Generated {generatedAt}</Text>
        </View>

        <Text style={styles.title}>{reportTitle}</Text>
        <Text style={styles.metaLine}>
          Unit: {unitLabel}
          {unitDetail ? ` — ${unitDetail}` : ""}
        </Text>
        <Text style={styles.metaLine}>Performed by: {performedByName}</Text>
        <Text style={styles.metaLine}>Performed at: {performedAt}</Text>

        <Text
          style={[
            styles.statusBadge,
            { backgroundColor: statusColor.bg, color: statusColor.text },
          ]}
        >
          {STATUS_LABELS[overallStatus] ?? overallStatus}
        </Text>

        {items.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Checklist items</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.colLabel, styles.headerText]}>Item</Text>
              <Text style={[styles.colResponse, styles.headerText]}>Result</Text>
              <Text style={[styles.colNotes, styles.headerText]}>Notes</Text>
            </View>
            {items.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.colLabel}>{item.label}</Text>
                <Text style={styles.colResponse}>
                  {item.response ? (RESPONSE_LABELS[item.response] ?? item.response) : "—"}
                </Text>
                <Text style={styles.colNotes}>{item.notes ?? ""}</Text>
              </View>
            ))}
          </View>
        )}

        {logNotes && (
          <View>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesBox}>
              <Text>{logNotes}</Text>
            </View>
          </View>
        )}

        {photoUrls.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Photos</Text>
            <View style={styles.photosGrid}>
              {photoUrls.map((url, i) => (
                <Image key={i} src={url} style={styles.photo} />
              ))}
            </View>
          </View>
        )}

        <Text style={styles.footer} fixed>
          RigMaintenance — rigmaintenance.net
        </Text>
      </Page>
    </Document>
  );
}
