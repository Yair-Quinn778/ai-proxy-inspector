use serde::{Deserialize, Serialize};
use crate::services::http;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AIServiceResult {
    pub service: String,
    pub status: String,       // "available", "unavailable", "error"
    pub region: String,
    pub latency_ms: u64,
    pub details: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AIAllServicesResult {
    pub services: Vec<AIServiceResult>,
    pub available_count: i32,
    pub total_count: i32,
}

#[tauri::command]
pub async fn check_chatgpt() -> Result<AIServiceResult, String> {
    check_ai_endpoint(
        "ChatGPT",
        "https://chatgpt.com",
        &["https://chatgpt.com/", "https://chat.openai.com/"],
    )
    .await
}

#[tauri::command]
pub async fn check_claude() -> Result<AIServiceResult, String> {
    check_ai_endpoint(
        "Claude",
        "https://claude.ai",
        &["https://claude.ai/", "https://claude.ai/login"],
    )
    .await
}

#[tauri::command]
pub async fn check_gemini() -> Result<AIServiceResult, String> {
    check_ai_endpoint(
        "Gemini",
        "https://gemini.google.com",
        &["https://gemini.google.com/"],
    )
    .await
}

#[tauri::command]
pub async fn check_all_ai_services() -> Result<AIAllServicesResult, String> {
    let services = vec![
        ("ChatGPT", "https://chatgpt.com"),
        ("Claude", "https://claude.ai"),
        ("Gemini", "https://gemini.google.com"),
        ("Grok", "https://grok.com"),
        ("Perplexity", "https://perplexity.ai"),
        ("Copilot", "https://copilot.microsoft.com"),
        ("Poe", "https://poe.com"),
        ("DeepSeek", "https://chat.deepseek.com"),
    ];

    let mut results = Vec::new();

    for (name, url) in &services {
        let result = check_ai_endpoint(name, url, &[]).await.unwrap_or_else(|e| {
            AIServiceResult {
                service: name.to_string(),
                status: "error".to_string(),
                region: "Unknown".to_string(),
                latency_ms: 0,
                details: e,
            }
        });
        results.push(result);
    }

    let available_count = results
        .iter()
        .filter(|r| r.status == "available")
        .count() as i32;

    Ok(AIAllServicesResult {
        services: results,
        available_count,
        total_count: services.len() as i32,
    })
}

async fn check_ai_endpoint(
    name: &str,
    primary_url: &str,
    _fallback_urls: &[&str],
) -> Result<AIServiceResult, String> {
    let client = http::create_client().map_err(|e| e.to_string())?;
    let start = std::time::Instant::now();

    match client.get(primary_url).send().await {
        Ok(resp) => {
            let latency = start.elapsed().as_millis() as u64;
            let status_code = resp.status().as_u16();

            // Determine region from headers
            let region = resp
                .headers()
                .get("cf-ray")
                .or_else(|| resp.headers().get("x-region"))
                .or_else(|| resp.headers().get("server"))
                .map(|v| v.to_str().unwrap_or("Unknown"))
                .unwrap_or("Unknown")
                .to_string();

            if status_code == 200 || status_code == 302 || status_code == 301 {
                Ok(AIServiceResult {
                    service: name.to_string(),
                    status: "available".to_string(),
                    region,
                    latency_ms: latency,
                    details: format!("HTTP {}", status_code),
                })
            } else if status_code == 403 {
                Ok(AIServiceResult {
                    service: name.to_string(),
                    status: "blocked".to_string(),
                    region,
                    latency_ms: latency,
                    details: "Access denied - likely region blocked".to_string(),
                })
            } else {
                Ok(AIServiceResult {
                    service: name.to_string(),
                    status: "unknown".to_string(),
                    region,
                    latency_ms: latency,
                    details: format!("HTTP {}", status_code),
                })
            }
        }
        Err(e) => {
            let latency = start.elapsed().as_millis() as u64;
            Ok(AIServiceResult {
                service: name.to_string(),
                status: "unavailable".to_string(),
                region: "N/A".to_string(),
                latency_ms: latency,
                details: format!("Connection failed: {}", e),
            })
        }
    }
}
