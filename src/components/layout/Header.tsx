import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DetectionStatus } from "@/types";
import { RefreshCw, Play, ChevronLeft, ChevronRight } from "lucide-react";

interface HeaderProps {
  title: string;
  detectionStatus: DetectionStatus;
  onStartDetection: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function Header({
  title,
  detectionStatus,
  onStartDetection,
  sidebarCollapsed,
  onToggleSidebar,
}: HeaderProps) {
  const { t } = useTranslation();

  const statusBadge = () => {
    switch (detectionStatus) {
      case "idle":
        return (
          <Badge variant="secondary" className="text-xs">
            {t("header.ready")}
          </Badge>
        );
      case "running":
        return (
          <Badge
            variant="default"
            className="text-xs bg-blue-500/20 text-blue-400 animate-pulse"
          >
            {t("header.detecting")}
          </Badge>
        );
      case "complete":
        return (
          <Badge variant="success" className="text-xs">
            {t("header.complete")}
          </Badge>
        );
      case "error":
        return (
          <Badge variant="danger" className="text-xs">
            {t("header.error")}
          </Badge>
        );
    }
  };

  return (
    <header className="flex items-center h-16 px-4 border-b border-white/5 glass-strong">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
      >
        {sidebarCollapsed ? (
          <ChevronRight size={18} />
        ) : (
          <ChevronLeft size={18} />
        )}
      </button>

      <div className="flex items-center gap-3 ml-3">
        <h1 className="text-lg font-semibold">{title}</h1>
        {statusBadge()}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onStartDetection}
          disabled={detectionStatus === "running"}
          className="gap-2"
        >
          {detectionStatus === "running" ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <Play size={16} />
          )}
          {detectionStatus === "running"
            ? t("header.detecting")
            : t("header.startDetection")}
        </Button>
      </div>
    </header>
  );
}
