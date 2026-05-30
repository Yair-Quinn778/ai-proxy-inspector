import { invoke } from "@tauri-apps/api/core";
import type {
  IPInfo,
  DNSResult,
  AIAllServicesResult,
  AIServiceResult,
  GoogleRiskResult,
  CloudflareRiskResult,
  IPPurityResult,
  BlacklistResult,
  StreamingAllResult,
  MediaResult,
  TikTokResult,
  YouTubePremiumResult,
  SpeedTestResult,
  ScoreBreakdown,
  ScoreInput,
  DetectionRecord,
  ScoreRecord,
} from "@/types";

// ============================================================
// IP Commands
// ============================================================

export async function getIPInfo(): Promise<IPInfo> {
  return invoke<IPInfo>("get_ip_info");
}

export async function getIPBatch(ips: string[]): Promise<IPInfo[]> {
  return invoke<IPInfo[]>("get_ip_batch", { ips });
}

// ============================================================
// DNS Commands
// ============================================================

export async function checkDNS(): Promise<DNSResult> {
  return invoke<DNSResult>("check_dns");
}

export async function checkDNSLeak(): Promise<DNSResult> {
  return invoke<DNSResult>("check_dns_leak");
}

// ============================================================
// AI Service Commands
// ============================================================

export async function checkChatGPT(): Promise<AIServiceResult> {
  return invoke<AIServiceResult>("check_chatgpt");
}

export async function checkClaude(): Promise<AIServiceResult> {
  return invoke<AIServiceResult>("check_claude");
}

export async function checkGemini(): Promise<AIServiceResult> {
  return invoke<AIServiceResult>("check_gemini");
}

export async function checkAllAIServices(): Promise<AIAllServicesResult> {
  return invoke<AIAllServicesResult>("check_all_ai_services");
}

// ============================================================
// Risk Commands
// ============================================================

export async function checkGoogleRisk(): Promise<GoogleRiskResult> {
  return invoke<GoogleRiskResult>("check_google_risk");
}

export async function checkCloudflareRisk(): Promise<CloudflareRiskResult> {
  return invoke<CloudflareRiskResult>("check_cloudflare_risk");
}

export async function checkIPPurity(): Promise<IPPurityResult> {
  return invoke<IPPurityResult>("check_ip_purity");
}

export async function checkBlacklist(): Promise<BlacklistResult> {
  return invoke<BlacklistResult>("check_blacklist");
}

// ============================================================
// Streaming & Media Commands
// ============================================================

export async function checkNetflix(): Promise<MediaResult> {
  return invoke<MediaResult>("check_netflix");
}

export async function checkStreamingAll(): Promise<StreamingAllResult> {
  return invoke<StreamingAllResult>("check_streaming_all");
}

export async function checkTikTok(): Promise<TikTokResult> {
  return invoke<TikTokResult>("check_tiktok");
}

export async function checkYouTubePremium(): Promise<YouTubePremiumResult> {
  return invoke<YouTubePremiumResult>("check_youtube_premium");
}

// ============================================================
// Speed Test
// ============================================================

export async function runSpeedTest(): Promise<SpeedTestResult> {
  return invoke<SpeedTestResult>("run_speed_test");
}

// ============================================================
// Scoring
// ============================================================

export async function calculateScore(input: ScoreInput): Promise<ScoreBreakdown> {
  return invoke<ScoreBreakdown>("calculate_score", { input });
}

export async function getScoreHistory(): Promise<ScoreRecord[]> {
  return invoke<ScoreRecord[]>("get_score_history");
}

// ============================================================
// Reports & History
// ============================================================

export async function generateReport(data: Record<string, unknown>): Promise<string> {
  return invoke<string>("generate_report", { data });
}

export async function getHistory(): Promise<DetectionRecord[]> {
  return invoke<DetectionRecord[]>("get_history");
}

export async function exportCSV(): Promise<string> {
  return invoke<string>("export_csv");
}

export async function exportJSON(): Promise<string> {
  return invoke<string>("export_json");
}
