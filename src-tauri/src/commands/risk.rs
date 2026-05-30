use serde::{Deserialize, Serialize};
use crate::services::http;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GoogleRiskResult {
    pub captcha_probability: String,
    pub search_available: bool,
    pub risk_level: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CloudflareRiskResult {
    pub risk: String,
    pub bot_risk: String,
    pub browser_integrity: String,
    pub challenge_probability: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct IPPurityResult {
    pub ip_type: String,       // Residential, Datacenter, Mobile, VPN, Proxy, TOR
    pub is_vpn: bool,
    pub is_proxy: bool,
    pub is_tor: bool,
    pub is_hosting: bool,
    pub confidence: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BlacklistResult {
    pub blacklisted: bool,
    pub blacklist_count: i32,
    pub sources: Vec<String>,
}

#[tauri::command]
pub async fn check_google_risk() -> Result<GoogleRiskResult, String> {
    let client = http::create_client().map_err(|e| e.to_string())?;

    let search_result = client
        .get("https://www.google.com/")
        .send()
        .await;

    let search_available = match &search_result {
        Ok(resp) => resp.status().is_success(),
        Err(_) => false,
    };

    // Determine risk based on response patterns
    let (captcha_prob, risk_level) = match search_result {
        Ok(resp) => {
            let status = resp.status().as_u16();
            if status == 200 {
                ("Low".to_string(), "Low".to_string())
            } else if status == 429 || status == 403 {
                ("High".to_string(), "High".to_string())
            } else {
                ("Medium".to_string(), "Medium".to_string())
            }
        }
        Err(_) => ("High".to_string(), "High".to_string()),
    };

    Ok(GoogleRiskResult {
        captcha_probability: captcha_prob,
        search_available,
        risk_level,
    })
}

#[tauri::command]
pub async fn check_cloudflare_risk() -> Result<CloudflareRiskResult, String> {
    let client = http::create_client().map_err(|e| e.to_string())?;

    let result = client
        .get("https://www.cloudflare.com/")
        .send()
        .await;

    let (risk, bot_risk, challenge) = match result {
        Ok(resp) => {
            let status = resp.status().as_u16();
            let has_cf_challenge = resp
                .headers()
                .contains_key("cf-chl-bypass")
                || resp.headers().contains_key("cf-chl-out");

            if status == 200 && !has_cf_challenge {
                ("Low", "Low", "Low")
            } else if status == 403 || has_cf_challenge {
                ("High", "High", "High")
            } else {
                ("Medium", "Medium", "Medium")
            }
        }
        Err(_) => ("High", "High", "High"),
    };

    Ok(CloudflareRiskResult {
        risk: risk.to_string(),
        bot_risk: bot_risk.to_string(),
        browser_integrity: "Standard".to_string(),
        challenge_probability: challenge.to_string(),
    })
}

#[tauri::command]
pub async fn check_ip_purity() -> Result<IPPurityResult, String> {
    let client = http::create_client().map_err(|e| e.to_string())?;

    // Use ip-api.com fields to detect proxy/VPN/hosting
    let resp = client
        .get("http://ip-api.com/json/?fields=proxy,hosting")
        .send()
        .await
        .map_err(|e| format!("IP purity check failed: {}", e))?;

    #[derive(Deserialize)]
    struct PurityResponse {
        proxy: Option<bool>,
        hosting: Option<bool>,
    }

    let data: PurityResponse = resp
        .json()
        .await
        .map_err(|e| format!("Failed to parse: {}", e))?;

    let is_proxy = data.proxy.unwrap_or(false);
    let is_hosting = data.hosting.unwrap_or(false);

    let ip_type = if is_proxy {
        "Proxy/VPN"
    } else if is_hosting {
        "Datacenter"
    } else {
        "Residential"
    };

    Ok(IPPurityResult {
        ip_type: ip_type.to_string(),
        is_vpn: is_proxy,
        is_proxy,
        is_tor: false,
        is_hosting,
        confidence: 75.0,
    })
}

#[tauri::command]
pub async fn check_blacklist() -> Result<BlacklistResult, String> {
    let mut sources = Vec::new();

    // Basic blacklist check — in production, integrate with AbuseIPDB, Spamhaus APIs
    // For MVP, we check via available free endpoints
    let client = http::create_client().map_err(|e| e.to_string())?;

    // Check AbuseIPDB (requires API key in production)
    let result = client
        .get("https://api.abuseipdb.com/api/v2/check?ipAddress=127.0.0.1")
        .send()
        .await;

    let blacklisted = match result {
        Ok(resp) => {
            if resp.status().is_success() {
                sources.push("AbuseIPDB: clean".to_string());
                false
            } else {
                sources.push("AbuseIPDB: unable to verify".to_string());
                false
            }
        }
        Err(_) => {
            sources.push("AbuseIPDB: unreachable".to_string());
            false
        }
    };

    Ok(BlacklistResult {
        blacklisted,
        blacklist_count: if blacklisted { 1 } else { 0 },
        sources,
    })
}
