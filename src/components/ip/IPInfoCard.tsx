import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { IPInfo } from "@/types";
import { MapPin, Globe, Wifi, Clock } from "lucide-react";

interface IPInfoCardProps {
  ipInfo: IPInfo | null;
  loading: boolean;
}

export default function IPInfoCard({ ipInfo, loading }: IPInfoCardProps) {
  const { t } = useTranslation();

  if (loading || !ipInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("ip.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  const rows = [
    {
      icon: <Globe size={14} className="text-gray-400" />,
      label: t("ip.ipv4"),
      value: ipInfo.ip,
      mono: true,
    },
    {
      icon: <Wifi size={14} className="text-gray-400" />,
      label: t("ip.asn"),
      value: `${ipInfo.asn} - ${ipInfo.asn_name}`,
    },
    {
      icon: <Wifi size={14} className="text-gray-400" />,
      label: t("ip.isp"),
      value: ipInfo.isp,
    },
    {
      icon: <MapPin size={14} className="text-gray-400" />,
      label: t("ip.location"),
      value: `${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}`,
    },
    {
      icon: <MapPin size={14} className="text-gray-400" />,
      label: t("ip.zip"),
      value: ipInfo.zip,
    },
    {
      icon: <MapPin size={14} className="text-gray-400" />,
      label: t("ip.coordinates"),
      value: `${ipInfo.latitude.toFixed(4)}, ${ipInfo.longitude.toFixed(4)}`,
      mono: true,
    },
    {
      icon: <Clock size={14} className="text-gray-400" />,
      label: t("ip.timezone"),
      value: ipInfo.timezone,
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("ip.title")}</CardTitle>
        <Badge variant="success" className="text-xs">
          {ipInfo.country_code}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]"
            >
              {row.icon}
              <div className="min-w-0">
                <div className="text-xs text-gray-500">{row.label}</div>
                <div
                  className={`text-sm truncate ${
                    row.mono ? "font-mono" : ""
                  }`}
                >
                  {row.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
