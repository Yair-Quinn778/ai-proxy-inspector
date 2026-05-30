import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ScoreGauge from "./ScoreGauge";
import type {
  IPInfo,
  DNSResult,
  AIAllServicesResult,
  GoogleRiskResult,
  CloudflareRiskResult,
  IPPurityResult,
  BlacklistResult,
  StreamingAllResult,
  SpeedTestResult,
  ScoreBreakdown,
  DetectionStatus,
} from "@/types";
import { Play, Shield, Globe, Tv, Gauge, AlertTriangle } from "lucide-react";

interface DashboardProps {
  ipInfo: IPInfo | null;
  dnsResult: DNSResult | null;
  aiServices: AIAllServicesResult | null;
  risk: {
    google: GoogleRiskResult | null;
    cloudflare: CloudflareRiskResult | null;
    ipPurity: IPPurityResult | null;
    blacklist: BlacklistResult | null;
  };
  streaming: StreamingAllResult | null;
  speedTest: SpeedTestResult | null;
  score: ScoreBreakdown | null;
  detectionStatus: DetectionStatus;
  onStartDetection: () => void;
}

export default function Dashboard({
  ipInfo,
  dnsResult,
  aiServices,
  risk,
  streaming,
  speedTest,
  score,
  detectionStatus,
  onStartDetection,
}: DashboardProps) {
  const { t } = useTranslation();

  if (detectionStatus === "idle" && !ipInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center glow-purple">
          <Shield size={36} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold">{t("dashboard.title")}</h2>
        <p className="text-gray-400 text-center max-w-md">
          {t("dashboard.description")}
        </p>
        <Button size="lg" onClick={onStartDetection} className="gap-2 glow-blue">
          <Play size={18} />
          {t("dashboard.startFullDetection")}
        </Button>
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { icon: <Shield size={16} />, label: t("dashboard.features.aiServices") },
            { icon: <Globe size={16} />, label: t("dashboard.features.dnsWebRTC") },
            { icon: <AlertTriangle size={16} />, label: t("dashboard.features.riskAnalysis") },
            { icon: <Tv size={16} />, label: t("dashboard.features.streaming") },
            { icon: <Gauge size={16} />, label: t("dashboard.features.speedTest") },
            { icon: <Shield size={16} />, label: t("dashboard.features.scoreReport") },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 p-4 rounded-xl glass text-center"
            >
              <div className="text-gray-400">{item.icon}</div>
              <span className="text-xs text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Score Section */}
      {score && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 flex flex-col items-center justify-center p-6">
            <ScoreGauge score={score.total} grade={score.grade} />
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t("dashboard.scoreBreakdown")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: t("dashboard.ipQuality"), value: score.ip_quality, weight: "30%", color: "bg-blue-500" },
                  { label: t("dashboard.aiAvailability"), value: score.ai_availability, weight: "25%", color: "bg-purple-500" },
                  { label: t("dashboard.streaming"), value: score.streaming, weight: "20%", color: "bg-green-500" },
                  { label: t("dashboard.riskLevel"), value: score.risk, weight: "15%", color: "bg-yellow-500" },
                  { label: t("dashboard.network"), value: score.network, weight: "10%", color: "bg-cyan-500" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {item.label} <span className="text-xs">({item.weight})</span>
                      </span>
                      <span>{item.value}/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-500`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ipInfo && (
          <Card className="p-4">
            <div className="text-xs text-gray-400 mb-1">{t("dashboard.quickStats.ipAddress")}</div>
            <div className="font-mono text-sm truncate">{ipInfo.ip}</div>
            <div className="text-xs text-gray-500 mt-1">
              {ipInfo.city}, {ipInfo.country}
            </div>
          </Card>
        )}
        {ipInfo && (
          <Card className="p-4">
            <div className="text-xs text-gray-400 mb-1">{t("dashboard.quickStats.asnIsp")}</div>
            <div className="font-mono text-sm truncate">{ipInfo.asn}</div>
            <div className="text-xs text-gray-500 mt-1 truncate">{ipInfo.isp}</div>
          </Card>
        )}
        {aiServices && (
          <Card className="p-4">
            <div className="text-xs text-gray-400 mb-1">{t("dashboard.quickStats.aiServices")}</div>
            <div className="text-lg font-bold">
              {aiServices.available_count}/{aiServices.total_count}
            </div>
            <div className="text-xs text-gray-500">{t("dashboard.quickStats.available")}</div>
          </Card>
        )}
        {dnsResult && (
          <Card className="p-4">
            <div className="text-xs text-gray-400 mb-1">{t("dashboard.quickStats.dns")}</div>
            <div className="text-sm font-medium truncate">{dnsResult.dns_provider}</div>
            <Badge
              variant={dnsResult.is_leaking ? "danger" : "success"}
              className="text-[10px] mt-1"
            >
              {dnsResult.is_leaking
                ? t("dashboard.quickStats.leaking")
                : t("dashboard.quickStats.secure")}
            </Badge>
          </Card>
        )}
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {risk.google && (
          <Card className="p-4">
            <div className="text-xs text-gray-400 mb-1">{t("dashboard.riskSummary.googleRisk")}</div>
            <Badge
              variant={
                risk.google.risk_level === "Low"
                  ? "success"
                  : risk.google.risk_level === "Medium"
                  ? "warning"
                  : "danger"
              }
            >
              {risk.google.risk_level === "Low"
                ? t("riskLevel.low")
                : risk.google.risk_level === "Medium"
                ? t("riskLevel.medium")
                : t("riskLevel.high")}
            </Badge>
          </Card>
        )}
        {risk.cloudflare && (
          <Card className="p-4">
            <div className="text-xs text-gray-400 mb-1">{t("dashboard.riskSummary.cloudflareRisk")}</div>
            <Badge
              variant={
                risk.cloudflare.risk === "Low"
                  ? "success"
                  : risk.cloudflare.risk === "Medium"
                  ? "warning"
                  : "danger"
              }
            >
              {risk.cloudflare.risk === "Low"
                ? t("riskLevel.low")
                : risk.cloudflare.risk === "Medium"
                ? t("riskLevel.medium")
                : t("riskLevel.high")}
            </Badge>
          </Card>
        )}
        {risk.ipPurity && (
          <Card className="p-4">
            <div className="text-xs text-gray-400 mb-1">{t("dashboard.riskSummary.ipType")}</div>
            <Badge
              variant={
                risk.ipPurity.ip_type === "Residential"
                  ? "success"
                  : risk.ipPurity.ip_type === "Datacenter"
                  ? "warning"
                  : "danger"
              }
            >
              {risk.ipPurity.ip_type}
            </Badge>
          </Card>
        )}
      </div>

      {/* Speed Summary */}
      {speedTest && (
        <Card className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-400">{t("dashboard.speedSummary.ping")}</div>
              <div className="text-lg font-bold">{speedTest.ping_ms.toFixed(0)} ms</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">{t("dashboard.speedSummary.download")}</div>
              <div className="text-lg font-bold">{speedTest.download_mbps.toFixed(1)} Mbps</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">{t("dashboard.speedSummary.upload")}</div>
              <div className="text-lg font-bold">{speedTest.upload_mbps.toFixed(1)} Mbps</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
