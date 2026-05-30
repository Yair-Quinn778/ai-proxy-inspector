import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { NavSection } from "@/types";
import {
  LayoutDashboard,
  MapPin,
  Shield,
  Globe,
  Radio,
  AlertTriangle,
  Tv,
  Gauge,
  FileText,
  Settings,
} from "lucide-react";

interface SidebarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  collapsed: boolean;
}

export default function Sidebar({
  activeSection,
  onNavigate,
  collapsed,
}: SidebarProps) {
  const { t } = useTranslation();

  const navItems: { id: NavSection; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: t("nav.dashboard"), icon: <LayoutDashboard size={20} /> },
    { id: "ip", label: t("nav.ipInfo"), icon: <MapPin size={20} /> },
    { id: "dns", label: t("nav.dnsCheck"), icon: <Globe size={20} /> },
    { id: "webrtc", label: t("nav.webrtc"), icon: <Radio size={20} /> },
    { id: "ai", label: t("nav.aiServices"), icon: <Shield size={20} /> },
    { id: "risk", label: t("nav.riskAnalysis"), icon: <AlertTriangle size={20} /> },
    { id: "media", label: t("nav.streaming"), icon: <Tv size={20} /> },
    { id: "speed", label: t("nav.speedTest"), icon: <Gauge size={20} /> },
    { id: "report", label: t("nav.reports"), icon: <FileText size={20} /> },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col h-full glass border-r border-white/5 transition-all duration-200",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Shield size={18} className="text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight">
                {t("app.nameShort")}
              </span>
              <span className="text-[10px] text-gray-400">{t("app.subtitle")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
              activeSection === item.id
                ? "bg-white/10 text-white shadow-sm"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-white/5">
          <div className="text-xs text-gray-500">
            <div>{t("app.name")}</div>
            <div>{t("app.version")}</div>
          </div>
        </div>
      )}
    </aside>
  );
}
