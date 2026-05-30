import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { WebRTCResult } from "@/types";
import { Radio, Shield, AlertTriangle } from "lucide-react";

interface WebRTCCheckCardProps {
  result: WebRTCResult | null;
  loading: boolean;
}

export default function WebRTCCheckCard({
  result,
  loading,
}: WebRTCCheckCardProps) {
  const { t } = useTranslation();
  const [browserResult, setBrowserResult] = useState<{
    localIPs: string[];
    webrtcLeak: boolean;
  } | null>(null);

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const localIPs: string[] = [];

    pc.createDataChannel("");
    pc.createOffer().then((offer) => pc.setLocalDescription(offer));

    pc.onicecandidate = (e) => {
      if (!e.candidate) {
        setBrowserResult({
          localIPs: [...new Set(localIPs)],
          webrtcLeak: localIPs.length > 0,
        });
        pc.close();
        return;
      }

      const candidate = e.candidate.candidate;
      const ipRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/;
      const match = candidate.match(ipRegex);
      if (match && !localIPs.includes(match[1])) {
        localIPs.push(match[1]);
      }
    };

    const timeout = setTimeout(() => {
      setBrowserResult({
        localIPs: [...new Set(localIPs)],
        webrtcLeak: localIPs.length > 0,
      });
      pc.close();
    }, 5000);

    return () => {
      clearTimeout(timeout);
      pc.close();
    };
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("webrtc.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  const isLeaking = result?.webrtc_leak || browserResult?.webrtcLeak || false;
  const ips = result?.public_ips || [];
  const localIps = result?.local_ips || browserResult?.localIPs || [];
  const allIPs = [...new Set([...ips, ...localIps])];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio size={20} />
          {t("webrtc.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isLeaking ? "bg-red-500/10" : "bg-green-500/10"
              }`}
            >
              {isLeaking ? (
                <AlertTriangle size={24} className="text-red-400" />
              ) : (
                <Shield size={24} className="text-green-400" />
              )}
            </div>
            <div>
              <div className="font-medium">
                {isLeaking ? t("webrtc.leakDetected") : t("webrtc.secure")}
              </div>
              <div className="text-sm text-gray-400">
                {isLeaking
                  ? t("webrtc.localIPExposed")
                  : t("webrtc.noLeak")}
              </div>
            </div>
          </div>

          {allIPs.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-3">{t("webrtc.detectedIPs")}</div>
              <div className="space-y-2">
                {allIPs.map((ip, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]"
                  >
                    <code className="text-sm font-mono">{ip}</code>
                    <Badge variant="outline" className="text-xs">
                      {ip.startsWith("10.")
                        || ip.startsWith("192.168.")
                        || ip.startsWith("172.")
                        ? t("webrtc.local")
                        : t("webrtc.public")}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <div className="text-sm text-blue-300">
              {t("webrtc.info")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
