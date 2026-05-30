import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { AIAllServicesResult } from "@/types";
import { statusBadgeColor, formatLatency } from "@/lib/utils";
import {
  MessageCircle,
  Bot,
  Sparkles,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface AIServicePanelProps {
  services: AIAllServicesResult | null;
  loading: boolean;
}

const serviceIcons: Record<string, React.ReactNode> = {
  ChatGPT: <MessageCircle size={18} />,
  Claude: <Bot size={18} />,
  Gemini: <Sparkles size={18} />,
  Grok: <Sparkles size={18} />,
  Perplexity: <Sparkles size={18} />,
  Copilot: <Bot size={18} />,
  Poe: <MessageCircle size={18} />,
  DeepSeek: <Bot size={18} />,
};

const statusIcon = (status: string) => {
  switch (status) {
    case "available":
      return <CheckCircle size={14} className="text-green-400" />;
    case "blocked":
    case "unavailable":
      return <XCircle size={14} className="text-red-400" />;
    case "error":
      return <AlertCircle size={14} className="text-yellow-400" />;
    default:
      return <AlertCircle size={14} className="text-gray-400" />;
  }
};

export default function AIServicePanel({
  services,
  loading,
}: AIServicePanelProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("ai.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!services) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("ai.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-12 text-gray-400">
            <Bot size={40} className="mb-3 opacity-50" />
            <p>{t("ai.noData")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("ai.status")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="text-3xl font-bold">
              {services.available_count}
              <span className="text-lg text-gray-400">
                /{services.total_count}
              </span>
            </div>
            <div className="text-sm text-gray-400">{t("ai.servicesAvailable")}</div>
            <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
                style={{
                  width: `${(services.available_count / services.total_count) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {services.services.map((svc) => (
              <div
                key={svc.service}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
              >
                <div className="text-gray-400">
                  {serviceIcons[svc.service] || <Bot size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{svc.service}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {svc.details}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {svc.latency_ms > 0 ? formatLatency(svc.latency_ms) : "-"}
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
                {svc.region !== "Unknown" && svc.region !== "N/A" && (
                  <Badge variant="secondary" className="text-xs">
                    {svc.region}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
