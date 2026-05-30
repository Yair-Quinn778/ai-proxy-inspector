import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Progress } from "@/components/ui/progress";
import Dashboard from "@/components/dashboard/Dashboard";
import IPInfoCard from "@/components/ip/IPInfoCard";
import IPMap from "@/components/ip/IPMap";
import DNSCheckCard from "@/components/dns/DNSCheckCard";
import WebRTCCheckCard from "@/components/webrtc/WebRTCCheckCard";
import AIServicePanel from "@/components/ai/AIServicePanel";
import RiskPanel from "@/components/risk/RiskPanel";
import MediaPanel from "@/components/media/MediaPanel";
import SpeedTestPanel from "@/components/speed/SpeedTestPanel";
import ReportPanel from "@/components/report/ReportPanel";
import LanguageSwitcher from "./LanguageSwitcher";
import type {
  NavSection,
  DetectionStatus,
  IPInfo,
  DNSResult,
  WebRTCResult,
  AIAllServicesResult,
  GoogleRiskResult,
  CloudflareRiskResult,
  IPPurityResult,
  BlacklistResult,
  StreamingAllResult,
  TikTokResult,
  YouTubePremiumResult,
  SpeedTestResult,
  ScoreBreakdown,
  DetectionProgress,
} from "@/types";
import {
  getIPInfo,
  checkDNS,
  checkAllAIServices,
  checkGoogleRisk,
  checkCloudflareRisk,
  checkIPPurity,
  checkBlacklist,
  checkStreamingAll,
  checkTikTok,
  checkYouTubePremium,
  runSpeedTest,
  calculateScore,
} from "@/lib/tauri";
import { getCurrentWindow } from "@tauri-apps/api/window";

export default function Layout() {
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState<NavSection>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [detectionStatus, setDetectionStatus] =
    useState<DetectionStatus>("idle");
  const [progress, setProgress] = useState<DetectionProgress | null>(null);

  // Detection results
  const [ipInfo, setIPInfo] = useState<IPInfo | null>(null);
  const [dnsResult, setDNSResult] = useState<DNSResult | null>(null);
  const [webRTCResult, setWebRTCResult] = useState<WebRTCResult | null>(null);
  const [aiServices, setAIServices] = useState<AIAllServicesResult | null>(null);
  const [googleRisk, setGoogleRisk] = useState<GoogleRiskResult | null>(null);
  const [cloudflareRisk, setCloudflareRisk] =
    useState<CloudflareRiskResult | null>(null);
  const [ipPurity, setIPPurity] = useState<IPPurityResult | null>(null);
  const [blacklist, setBlacklist] = useState<BlacklistResult | null>(null);
  const [streaming, setStreaming] = useState<StreamingAllResult | null>(null);
  const [tiktok, setTikTok] = useState<TikTokResult | null>(null);
  const [youtubePremium, setYouTubePremium] =
    useState<YouTubePremiumResult | null>(null);
  const [speedTest, setSpeedTest] = useState<SpeedTestResult | null>(null);
  const [score, setScore] = useState<ScoreBreakdown | null>(null);

  // Update window title based on language
  useEffect(() => {
    try {
      const appWindow = getCurrentWindow();
      appWindow.setTitle(t("app.name"));
    } catch {
      document.title = t("app.name");
    }
  }, [i18n.language, t]);

  const runFullDetection = async () => {
    setDetectionStatus("running");
    const steps = 10;
    let current = 0;

    try {
      setProgress({ current: ++current, total: steps, label: t("detection.fetchingIP") });
      const ip = await getIPInfo();
      setIPInfo(ip);

      setProgress({ current: ++current, total: steps, label: t("detection.checkingDNS") });
      const dns = await checkDNS();
      setDNSResult(dns);

      setProgress({ current: ++current, total: steps, label: t("detection.checkingWebRTC") });
      setWebRTCResult({ webrtc_leak: false, local_ips: [], public_ips: [] });

      setProgress({ current: ++current, total: steps, label: t("detection.testingAI") });
      try {
        const ai = await checkAllAIServices();
        setAIServices(ai);
      } catch { /* ignore */ }

      setProgress({ current: ++current, total: steps, label: t("detection.analyzingGoogle") });
      try { const gr = await checkGoogleRisk(); setGoogleRisk(gr); } catch { /* ignore */ }

      setProgress({ current: ++current, total: steps, label: t("detection.analyzingCloudflare") });
      try { const cr = await checkCloudflareRisk(); setCloudflareRisk(cr); } catch { /* ignore */ }

      setProgress({ current: ++current, total: steps, label: t("detection.checkingPurity") });
      try { const purity = await checkIPPurity(); setIPPurity(purity); } catch { /* ignore */ }

      setProgress({ current: ++current, total: steps, label: t("detection.checkingBlacklists") });
      try { const bl = await checkBlacklist(); setBlacklist(bl); } catch { /* ignore */ }

      setProgress({ current: ++current, total: steps, label: t("detection.runningSpeed") });
      try { const st = await runSpeedTest(); setSpeedTest(st); } catch { /* ignore */ }

      setProgress({ current: ++current, total: steps, label: t("detection.calculatingScore") });
      try {
        const s = await calculateScore({
          ip_type: ipPurity?.ip_type || "Unknown",
          ai_available: aiServices?.available_count || 0,
          ai_total: aiServices?.total_count || 8,
          streaming_available: streaming?.unlocked_count || 0,
          streaming_total: streaming?.total_count || 8,
          google_risk: googleRisk?.risk_level || "Medium",
          cf_risk: cloudflareRisk?.risk || "Medium",
          blacklisted: blacklist?.blacklisted || false,
          ping_ms: speedTest?.ping_ms || 100,
          download_mbps: speedTest?.download_mbps || 50,
        });
        setScore(s);
      } catch { /* ignore */ }

      setDetectionStatus("complete");
    } catch (e) {
      console.error("Detection failed:", e);
      setDetectionStatus("error");
    }

    setProgress(null);
    setActiveSection("dashboard");
  };

  const sectionTitle = (): string => {
    const titles: Record<NavSection, string> = {
      dashboard: t("section.dashboard"),
      ip: t("section.ipInformation"),
      dns: t("section.dnsCheck"),
      webrtc: t("section.webrtcCheck"),
      ai: t("section.aiServices"),
      risk: t("section.riskAnalysis"),
      media: t("section.streamingMedia"),
      speed: t("section.speedTest"),
      report: t("section.reportsHistory"),
    };
    return titles[activeSection];
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard
            ipInfo={ipInfo}
            dnsResult={dnsResult}
            aiServices={aiServices}
            risk={{
              google: googleRisk,
              cloudflare: cloudflareRisk,
              ipPurity,
              blacklist,
            }}
            streaming={streaming}
            speedTest={speedTest}
            score={score}
            detectionStatus={detectionStatus}
            onStartDetection={runFullDetection}
          />
        );
      case "ip":
        return (
          <div className="space-y-6">
            <IPInfoCard ipInfo={ipInfo} loading={detectionStatus === "running"} />
            {ipInfo && <IPMap latitude={ipInfo.latitude} longitude={ipInfo.longitude} location={`${ipInfo.city}, ${ipInfo.country}`} />}
          </div>
        );
      case "dns":
        return <DNSCheckCard result={dnsResult} loading={detectionStatus === "running"} />;
      case "webrtc":
        return <WebRTCCheckCard result={webRTCResult} loading={detectionStatus === "running"} />;
      case "ai":
        return <AIServicePanel services={aiServices} loading={detectionStatus === "running"} />;
      case "risk":
        return (
          <RiskPanel
            google={googleRisk}
            cloudflare={cloudflareRisk}
            purity={ipPurity}
            blacklist={blacklist}
            loading={detectionStatus === "running"}
          />
        );
      case "media":
        return <MediaPanel streaming={streaming} tiktok={tiktok} youtube={youtubePremium} loading={detectionStatus === "running"} />;
      case "speed":
        return <SpeedTestPanel result={speedTest} loading={detectionStatus === "running"} />;
      case "report":
        return <ReportPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-gray-950">
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        collapsed={sidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={sectionTitle()}
          detectionStatus={detectionStatus}
          onStartDetection={runFullDetection}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        {progress && (
          <div className="px-6 py-2 border-b border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">{progress.label}</span>
              <span className="text-xs text-gray-500">
                {progress.current}/{progress.total}
              </span>
            </div>
            <Progress
              value={(progress.current / progress.total) * 100}
              className="h-1.5"
            />
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-6">{renderSection()}</main>
      </div>
      <LanguageSwitcher />
    </div>
  );
}
