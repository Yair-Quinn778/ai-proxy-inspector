use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DetectionRecord {
    pub id: i64,
    pub timestamp: String,
    pub ip: String,
    pub asn: Option<String>,
    pub country: Option<String>,
    pub city: Option<String>,
    pub isp: Option<String>,
    pub ai_services: Option<String>,   // JSON array
    pub dns_provider: Option<String>,
    pub dns_leak: Option<bool>,
    pub webrtc_leak: Option<bool>,
    pub google_risk: Option<String>,
    pub cf_risk: Option<String>,
    pub ip_type: Option<String>,
    pub score: Option<i32>,
    pub report_path: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ScoreRecord {
    pub id: i64,
    pub timestamp: String,
    pub score: i32,
    pub grade: String,
    pub ip_quality_score: i32,
    pub ai_availability_score: i32,
    pub streaming_score: i32,
    pub risk_score: i32,
    pub network_score: i32,
}
