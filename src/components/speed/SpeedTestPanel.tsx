import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SpeedTestResult } from "@/types";
import { formatSpeed } from "@/lib/utils";
import { Gauge, ArrowDown, ArrowUp, Clock, Wifi } from "lucide-react";

interface SpeedTestPanelProps {
  result: SpeedTestResult | null;
  loading: boolean;
}

export default function SpeedTestPanel({
  result,
  loading,
}: SpeedTestPanelProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("speed.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("speed.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-12 text-gray-400">
            <Gauge size={40} className="mb-3 opacity-50" />
            <p>{t("speed.noData")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      icon: <Clock size={24} className="text-blue-400" />,
      label: t("speed.ping"),
      value: `${result.ping_ms.toFixed(0)} ms`,
      color: "bg-blue-500",
    },
    {
      icon: <ArrowDown size={24} className="text-green-400" />,
      label: t("speed.download"),
      value: formatSpeed(result.download_mbps),
      color: "bg-green-500",
    },
    {
      icon: <ArrowUp size={24} className="text-purple-400" />,
      label: t("speed.upload"),
      value: formatSpeed(result.upload_mbps),
      color: "bg-purple-500",
    },
    {
      icon: <Wifi size={24} className="text-yellow-400" />,
      label: t("speed.jitter"),
      value: `${result.jitter_ms.toFixed(1)} ms`,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge size={20} />
            {t("speed.networkSpeed")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <Card
                key={metric.label}
                className="p-4 bg-white/[0.02] border-white/5"
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  {metric.icon}
                  <div className="text-xs text-gray-400">{metric.label}</div>
                  <div className="text-xl font-bold">{metric.value}</div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{t("speed.packetLoss")}</span>
              <span
                className={`text-lg font-bold ${
                  result.packet_loss_pct < 1
                    ? "text-green-400"
                    : result.packet_loss_pct < 5
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {result.packet_loss_pct.toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
