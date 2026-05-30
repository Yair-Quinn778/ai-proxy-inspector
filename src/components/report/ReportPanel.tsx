import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DetectionRecord } from "@/types";
import { getHistory, exportCSV, exportJSON } from "@/lib/tauri";
import {
  FileText,
  Download,
  History,
  FileSpreadsheet,
  FileJson,
} from "lucide-react";

export default function ReportPanel() {
  const { t } = useTranslation();
  const [records, setRecords] = useState<DetectionRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      setRecords(data);
    } catch (e) {
      console.error("Failed to load history:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleExportCSV = async () => {
    try {
      const csv = await exportCSV();
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-proxy-inspector-report-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed:", e);
    }
  };

  const handleExportJSON = async () => {
    try {
      const json = await exportJSON();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-proxy-inspector-report-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed:", e);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            {t("report.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="gap-2"
            >
              <FileSpreadsheet size={16} />
              {t("report.exportCsv")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJSON}
              className="gap-2"
            >
              <FileJson size={16} />
              {t("report.exportJson")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History size={20} />
            {t("report.detectionHistory")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-gray-400">
              <History size={40} className="mb-3 opacity-50" />
              <p>{t("report.noHistory")}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("report.time")}</TableHead>
                  <TableHead>{t("report.ip")}</TableHead>
                  <TableHead>{t("report.asn")}</TableHead>
                  <TableHead>{t("report.country")}</TableHead>
                  <TableHead>{t("report.city")}</TableHead>
                  <TableHead>{t("report.isp")}</TableHead>
                  <TableHead>{t("report.dnsProvider")}</TableHead>
                  <TableHead>{t("report.googleRisk")}</TableHead>
                  <TableHead>{t("report.cfRisk")}</TableHead>
                  <TableHead>{t("report.ipType")}</TableHead>
                  <TableHead>{t("report.score")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-xs text-gray-400 whitespace-nowrap">
                      {r.timestamp?.replace("T", " ").slice(0, 19)}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {r.ip}
                    </TableCell>
                    <TableCell className="text-xs">{r.asn || "-"}</TableCell>
                    <TableCell className="text-xs">
                      {r.country || "-"}
                    </TableCell>
                    <TableCell className="text-xs">{r.city || "-"}</TableCell>
                    <TableCell className="text-xs max-w-[120px] truncate">
                      {r.isp || "-"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {r.dns_provider || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          r.google_risk === "Low"
                            ? "success"
                            : r.google_risk === "Medium"
                            ? "warning"
                            : "danger"
                        }
                        className="text-[10px]"
                      >
                        {r.google_risk || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          r.cf_risk === "Low"
                            ? "success"
                            : r.cf_risk === "Medium"
                            ? "warning"
                            : "danger"
                        }
                        className="text-[10px]"
                      >
                        {r.cf_risk || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="text-[10px]"
                      >
                        {r.ip_type || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {r.score !== null && (
                        <span
                          className={`text-xs font-bold ${
                            r.score >= 85
                              ? "text-green-400"
                              : r.score >= 70
                              ? "text-blue-400"
                              : r.score >= 50
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {r.score}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
