import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  GoogleRiskResult,
  CloudflareRiskResult,
  IPPurityResult,
  BlacklistResult,
} from "@/types";
import { riskColor } from "@/lib/utils";
import {
  AlertTriangle,
  Shield,
  Server,
  Search,
  Globe,
  Lock,
} from "lucide-react";

interface RiskPanelProps {
  google: GoogleRiskResult | null;
  cloudflare: CloudflareRiskResult | null;
  purity: IPPurityResult | null;
  blacklist: BlacklistResult | null;
  loading: boolean;
}

function RiskLevelBadge({ level }: { level: string }) {
  const { t } = useTranslation();
  const variant =
    level.toLowerCase() === "low"
      ? "success"
      : level.toLowerCase() === "medium"
      ? "warning"
      : "danger";
  const label =
    level.toLowerCase() === "low"
      ? t("riskLevel.low")
      : level.toLowerCase() === "medium"
      ? t("riskLevel.medium")
      : level;
  return (
    <Badge variant={variant as any} className="text-xs font-medium">
      {label}
    </Badge>
  );
}

export default function RiskPanel({
  google,
  cloudflare,
  purity,
  blacklist,
  loading,
}: RiskPanelProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!google && !cloudflare && !purity && !blacklist) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("risk.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-12 text-gray-400">
            <Shield size={40} className="mb-3 opacity-50" />
            <p>{t("risk.noData")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {google && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search size={20} />
              {t("risk.googleRisk")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1">
                <div className="text-xs text-gray-400">{t("risk.riskLevel")}</div>
                <RiskLevelBadge level={google.risk_level} />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-400">{t("risk.captchaProbability")}</div>
                <div className={`text-lg font-bold ${riskColor(google.captcha_probability)}`}>
                  {google.captcha_probability}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-400">{t("risk.searchAvailable")}</div>
                <Badge
                  variant={google.search_available ? "success" : "danger"}
                  className="text-xs"
                >
                  {google.search_available ? t("risk.yes") : t("risk.no")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {cloudflare && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe size={20} />
              {t("risk.cloudflareRisk")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1">
                <div className="text-xs text-gray-400">{t("risk.overallRisk")}</div>
                <RiskLevelBadge level={cloudflare.risk} />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-400">{t("risk.botRisk")}</div>
                <div className={`text-lg font-bold ${riskColor(cloudflare.bot_risk)}`}>
                  {cloudflare.bot_risk}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-400">{t("risk.challengeProbability")}</div>
                <div className={`text-lg font-bold ${riskColor(cloudflare.challenge_probability)}`}>
                  {cloudflare.challenge_probability}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {purity && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server size={20} />
              {t("risk.ipPurity")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] text-center">
                <div className="text-xs text-gray-400 mb-1">{t("risk.ipType")}</div>
                <Badge
                  variant={
                    purity.ip_type === "Residential" ? "success" : "warning"
                  }
                  className="text-sm"
                >
                  {purity.ip_type}
                </Badge>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] text-center">
                <div className="text-xs text-gray-400 mb-1">{t("risk.vpn")}</div>
                <Badge
                  variant={purity.is_vpn ? "danger" : "success"}
                  className="text-sm"
                >
                  {purity.is_vpn ? t("risk.yes") : t("risk.no")}
                </Badge>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] text-center">
                <div className="text-xs text-gray-400 mb-1">{t("risk.proxy")}</div>
                <Badge
                  variant={purity.is_proxy ? "danger" : "success"}
                  className="text-sm"
                >
                  {purity.is_proxy ? t("risk.yes") : t("risk.no")}
                </Badge>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] text-center">
                <div className="text-xs text-gray-400 mb-1">{t("risk.confidence")}</div>
                <div className="text-lg font-bold">{purity.confidence.toFixed(0)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {blacklist && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} />
              {t("risk.blacklistCheck")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-lg ${
                  blacklist.blacklisted ? "bg-red-500/10" : "bg-green-500/10"
                }`}
              >
                {blacklist.blacklisted ? (
                  <AlertTriangle size={24} className="text-red-400" />
                ) : (
                  <Shield size={24} className="text-green-400" />
                )}
              </div>
              <div>
                <div className="font-medium">
                  {blacklist.blacklisted
                    ? t("risk.listedOn", { count: blacklist.blacklist_count })
                    : t("risk.notBlacklisted")}
                </div>
              </div>
            </div>
            {blacklist.sources.length > 0 && (
              <div className="space-y-1">
                {blacklist.sources.map((src, i) => (
                  <div
                    key={i}
                    className="text-xs text-gray-400 font-mono p-2 rounded bg-white/[0.02]"
                  >
                    {src}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
