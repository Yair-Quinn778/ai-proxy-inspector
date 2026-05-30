import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { DNSResult } from "@/types";
import { Globe, Shield, AlertTriangle, Server } from "lucide-react";

interface DNSCheckCardProps {
  result: DNSResult | null;
  loading: boolean;
}

export default function DNSCheckCard({ result, loading }: DNSCheckCardProps) {
  const { t } = useTranslation();

  if (loading || !result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("dns.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe size={20} />
            {t("dns.status")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    result.is_leaking ? "bg-red-500/10" : "bg-green-500/10"
                  }`}
                >
                  {result.is_leaking ? (
                    <AlertTriangle size={24} className="text-red-400" />
                  ) : (
                    <Shield size={24} className="text-green-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium">
                    {result.is_leaking ? t("dns.leakDetected") : t("dns.secure")}
                  </div>
                  <div className="text-sm text-gray-400">
                    {result.is_leaking
                      ? t("dns.multipleServers")
                      : t("dns.noLeak")}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Server size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-400">{t("dns.provider")}</span>
                </div>
                <Badge variant="secondary">{result.dns_provider}</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-400">{t("dns.country")}</span>
                </div>
                <div className="text-sm">{result.dns_country}</div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-3">{t("dns.servers")}</div>
              <div className="space-y-2">
                {result.dns_servers.map((server, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-white/[0.02] font-mono text-xs break-all"
                  >
                    {server}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {result.details.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("dns.resolutionDetails")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.details.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]"
                >
                  <div className="text-sm font-medium">{d.domain}</div>
                  <div className="flex items-center gap-3">
                    <code className="text-xs font-mono text-gray-400">
                      {d.resolved_ip}
                    </code>
                    <Badge variant="outline" className="text-[10px]">
                      {d.dns_server}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
