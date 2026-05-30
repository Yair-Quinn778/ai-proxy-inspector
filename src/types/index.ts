// ============================================================
// IP & Network
// ============================================================

export interface IPInfo {
  ip: string;
  asn: string;
  asn_name: string;
  isp: string;
  country: string;
  country_code: string;
  region: string;
  city: string;
  zip: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface DNSResult {
  dns_servers: string[];
  dns_country: string;
  dns_provider: string;
  is_leaking: boolean;
  details: DNSQueryResult[];
}

export interface DNSQueryResult {
  domain: string;
  resolved_ip: string;
  dns_server: string;
}

export interface WebRTCResult {
  webrtc_leak: boolean;
  local_ips: string[];
  public_ips: string[];
}

// ============================================================
// AI Services
// ============================================================

export interface AIServiceResult {
  service: string;
  status: "available" | "unavailable" | "blocked" | "error" | "unknown";
  region: string;
  latency_ms: number;
  details: string;
}

export interface AIAllServicesResult {
  services: AIServiceResult[];
  available_count: number;
  total_count: number;
}

// ============================================================
// Risk Analysis
// ============================================================

export interface GoogleRiskResult {
  captcha_probability: string;
  search_available: boolean;
  risk_level: "Low" | "Medium" | "High";
}

export interface CloudflareRiskResult {
  risk: string;
  bot_risk: string;
  browser_integrity: string;
  challenge_probability: string;
}

export interface IPPurityResult {
  ip_type: string;
  is_vpn: boolean;
  is_proxy: boolean;
  is_tor: boolean;
  is_hosting: boolean;
  confidence: number;
}

export interface BlacklistResult {
  blacklisted: boolean;
  blacklist_count: number;
  sources: string[];
}

// ============================================================
// Streaming & Media
// ============================================================

export interface MediaResult {
  service: string;
  status: string;
  region: string;
  details: string;
}

export interface StreamingAllResult {
  services: MediaResult[];
  unlocked_count: number;
  total_count: number;
}

export interface TikTokResult {
  region: string;
  upload: boolean;
  risk_level: string;
}

export interface YouTubePremiumResult {
  premium: string;
  cdn_region: string;
}

// ============================================================
// Speed Test
// ============================================================

export interface SpeedTestResult {
  ping_ms: number;
  download_mbps: number;
  upload_mbps: number;
  jitter_ms: number;
  packet_loss_pct: number;
}

// ============================================================
// Scoring
// ============================================================

export interface ScoreBreakdown {
  total: number;
  grade: string;
  ip_quality: number;
  ai_availability: number;
  streaming: number;
  risk: number;
  network: number;
}

export interface ScoreInput {
  ip_type: string;
  ai_available: number;
  ai_total: number;
  streaming_available: number;
  streaming_total: number;
  google_risk: string;
  cf_risk: string;
  blacklisted: boolean;
  ping_ms: number;
  download_mbps: number;
}

// ============================================================
// History & Reports
// ============================================================

export interface DetectionRecord {
  id: number;
  timestamp: string;
  ip: string;
  asn: string | null;
  country: string | null;
  city: string | null;
  isp: string | null;
  ai_services: string | null;
  dns_provider: string | null;
  dns_leak: boolean | null;
  webrtc_leak: boolean | null;
  google_risk: string | null;
  cf_risk: string | null;
  ip_type: string | null;
  score: number | null;
  report_path: string | null;
}

export interface ScoreRecord {
  id: number;
  timestamp: string;
  score: number;
  grade: string;
  ip_quality_score: number;
  ai_availability_score: number;
  streaming_score: number;
  risk_score: number;
  network_score: number;
}

// ============================================================
// App State
// ============================================================

export type NavSection =
  | "dashboard"
  | "ip"
  | "dns"
  | "webrtc"
  | "ai"
  | "risk"
  | "media"
  | "speed"
  | "report";

export type DetectionStatus = "idle" | "running" | "complete" | "error";

export interface DetectionProgress {
  current: number;
  total: number;
  label: string;
}

export interface AppState {
  activeSection: NavSection;
  detectionStatus: DetectionStatus;
  progress: DetectionProgress | null;
  ipInfo: IPInfo | null;
  dnsResult: DNSResult | null;
  webRTCResult: WebRTCResult | null;
  aiServices: AIAllServicesResult | null;
  googleRisk: GoogleRiskResult | null;
  cloudflareRisk: CloudflareRiskResult | null;
  ipPurity: IPPurityResult | null;
  blacklist: BlacklistResult | null;
  streaming: StreamingAllResult | null;
  tiktok: TikTokResult | null;
  youtubePremium: YouTubePremiumResult | null;
  speedTest: SpeedTestResult | null;
  score: ScoreBreakdown | null;
  history: DetectionRecord[];
  scoreHistory: ScoreRecord[];
}
