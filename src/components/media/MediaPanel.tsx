import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { StreamingAllResult, TikTokResult, YouTubePremiumResult } from "@/types";
import { statusBadgeColor } from "@/lib/utils";
import { Tv, Music, Play, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface MediaPanelProps {
  streaming: StreamingAllResult | null;
  tiktok: TikTokResult | null;
  youtube: YouTubePremiumResult | null;
  loading: boolean;
}

const statusIcon = (status: string) => {
  switch (status) {
    case "available":
      return <CheckCircle size={14} className="text-green-400" />;
    case "blocked":
    case "unavailable":
      return <XCircle size={14} className="text-red-400" />;
    default:
      return <AlertCircle size={14} className="text-gray-400" />;
  }
};

export default function MediaPanel({
  streaming,
  tiktok,
  youtube,
  loading,
}: MediaPanelProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("media.streamingServices")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!streaming && !tiktok && !youtube) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("media.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-12 text-gray-400">
            <Tv size={40} className="mb-3 opacity-50" />
            <p>{t("media.noData")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {streaming && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tv size={20} />
              {t("media.streamingServices")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl font-bold">
                {streaming.unlocked_count}
                <span className="text-lg text-gray-400">
                  /{streaming.total_count}
                </span>
              </div>
              <div className="text-sm text-gray-400">{t("media.servicesUnlocked")}</div>
              <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-700"
                  style={{
                    width: `${(streaming.unlocked_count / streaming.total_count) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {streaming.services.map((svc) => (
                <div
                  key={svc.service}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <div className="text-gray-400">
                    <Play size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{svc.service}</div>
                    <div className="text-xs text-gray-500">{svc.details}</div>
                  </div>
                  <Badge
                    className={`text-xs border ${statusBadgeColor(svc.status)}`}
                    variant="outline"
                  >
                    <span className="flex items-center gap-1">
                      {statusIcon(svc.status)}
                      {svc.status}
                    </span>
                  </Badge>
                  {svc.region !== "Unknown" && (
                    <Badge variant="secondary" className="text-xs">
                      {svc.region}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tiktok && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music size={20} />
                {t("media.tiktok")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{t("media.region")}</span>
                  <Badge variant="secondary">{tiktok.region}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{t("media.uploadAccess")}</span>
                  <Badge variant={tiktok.upload ? "success" : "danger"}>
                    {tiktok.upload ? t("media.available") : t("media.blocked")}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{t("risk.riskLevel")}</span>
                  <Badge variant="secondary">{tiktok.risk_level}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {youtube && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play size={20} />
                {t("media.youtubePremium")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{t("media.premiumRegion")}</span>
                  <Badge variant="secondary">{youtube.premium}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{t("media.cdnRegion")}</span>
                  <Badge variant="secondary">{youtube.cdn_region}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
