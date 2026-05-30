import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLatency(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function formatSpeed(mbps: number): string {
  if (mbps >= 1000) return `${(mbps / 1000).toFixed(1)} Gbps`;
  return `${mbps.toFixed(1)} Mbps`;
}

export function statusColor(status: string): string {
  switch (status) {
    case "available":
      return "text-green-400";
    case "unavailable":
    case "blocked":
      return "text-red-400";
    case "error":
      return "text-yellow-400";
    case "unknown":
      return "text-gray-400";
    default:
      return "text-gray-400";
  }
}

export function statusBadgeColor(status: string): string {
  switch (status) {
    case "available":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "unavailable":
    case "blocked":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "error":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

export function riskColor(level: string): string {
  switch (level.toLowerCase()) {
    case "low":
      return "text-green-400";
    case "medium":
      return "text-yellow-400";
    case "high":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
}

export function gradeColor(grade: string): string {
  if (grade.startsWith("S")) return "text-purple-400";
  if (grade.startsWith("A")) return "text-green-400";
  if (grade.startsWith("B")) return "text-blue-400";
  if (grade.startsWith("C")) return "text-yellow-400";
  if (grade.startsWith("D")) return "text-orange-400";
  return "text-red-400";
}
