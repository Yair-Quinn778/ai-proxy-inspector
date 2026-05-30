use serde::{Deserialize, Serialize};

/// Scoring weights from the PRD:
/// IP Quality: 30%, AI Availability: 25%, Streaming: 20%, Risk: 15%, Network: 10%

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ScoreBreakdown {
    pub total: i32,
    pub grade: String,
    pub ip_quality: i32,
    pub ai_availability: i32,
    pub streaming: i32,
    pub risk: i32,
    pub network: i32,
}

pub fn calculate(
    ip_type: &str,           // Residential/Datacenter/Mobile/VPN/Proxy/TOR
    ai_available: i32,       // Number of AI services available (0-8)
    ai_total: i32,           // Total AI services checked
    streaming_available: i32, // Number of streaming services unlocked (0-8)
    streaming_total: i32,    // Total streaming services checked
    google_risk: &str,       // Low/Medium/High
    cf_risk: &str,           // Low/Medium/High
    blacklisted: bool,
    ping_ms: f64,
    download_mbps: f64,
) -> ScoreBreakdown {
    // IP Quality (30%)
    let ip_quality = match ip_type.to_lowercase().as_str() {
        "residential" => 100,
        "mobile" => 90,
        "datacenter" => if blacklisted { 20 } else { 50 },
        "vpn" | "proxy" => if blacklisted { 10 } else { 30 },
        "tor" => 5,
        _ => 50,
    };

    // AI Availability (25%)
    let ai_ratio = if ai_total > 0 {
        ai_available as f64 / ai_total as f64
    } else {
        0.0
    };
    let ai_availability = (ai_ratio * 100.0) as i32;

    // Streaming (20%)
    let streaming_ratio = if streaming_total > 0 {
        streaming_available as f64 / streaming_total as f64
    } else {
        0.0
    };
    let streaming = (streaming_ratio * 100.0) as i32;

    // Risk Level (15%)
    let google_score = match google_risk.to_lowercase().as_str() {
        "low" => 100,
        "medium" => 60,
        "high" => 20,
        _ => 50,
    };
    let cf_score = match cf_risk.to_lowercase().as_str() {
        "low" => 100,
        "medium" => 60,
        "high" => 20,
        _ => 50,
    };
    let risk = (google_score + cf_score) / 2;

    // Network Quality (10%)
    let ping_score = if ping_ms < 50.0 {
        100
    } else if ping_ms < 100.0 {
        85
    } else if ping_ms < 200.0 {
        60
    } else if ping_ms < 400.0 {
        35
    } else {
        10
    };

    let speed_score = if download_mbps > 500.0 {
        100
    } else if download_mbps > 200.0 {
        85
    } else if download_mbps > 50.0 {
        60
    } else if download_mbps > 10.0 {
        35
    } else {
        10
    };

    let network = (ping_score + speed_score) / 2;

    // Weighted total
    let total = ((ip_quality as f64 * 0.30)
        + (ai_availability as f64 * 0.25)
        + (streaming as f64 * 0.20)
        + (risk as f64 * 0.15)
        + (network as f64 * 0.10)) as i32;

    let grade = match total {
        95..=100 => "S",
        85..=94 => "A",
        70..=84 => "B",
        50..=69 => "C",
        30..=49 => "D",
        _ => "F",
    };

    ScoreBreakdown {
        total,
        grade: format!("{}级节点", grade),
        ip_quality,
        ai_availability,
        streaming,
        risk,
        network,
    }
}
