use serde::{Deserialize, Serialize};
use crate::services::http;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MediaResult {
    pub service: String,
    pub status: String,
    pub region: String,
    pub details: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct StreamingAllResult {
    pub services: Vec<MediaResult>,
    pub unlocked_count: i32,
    pub total_count: i32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TikTokResult {
    pub region: String,
    pub upload: bool,
    pub risk_level: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct YouTubePremiumResult {
    pub premium: String,
    pub cdn_region: String,
}

#[tauri::command]
pub async fn check_netflix() -> Result<MediaResult, String> {
    check_streaming_service("Netflix", "https://www.netflix.com/title/80018499").await
}

#[tauri::command]
pub async fn check_streaming_all() -> Result<StreamingAllResult, String> {
    let services = vec![
        ("Netflix", "https://www.netflix.com/"),
        ("Disney+", "https://www.disneyplus.com/"),
        ("Hulu", "https://www.hulu.com/"),
        ("HBO Max", "https://www.max.com/"),
        ("Prime Video", "https://www.primevideo.com/"),
        ("Apple TV+", "https://tv.apple.com/"),
        ("Spotify", "https://www.spotify.com/"),
        ("YouTube", "https://www.youtube.com/premium"),
    ];

    let mut results = Vec::new();

    for (name, url) in &services {
        let result = check_streaming_service(name, url)
            .await
            .unwrap_or_else(|e| MediaResult {
                service: name.to_string(),
                status: "error".to_string(),
                region: "Unknown".to_string(),
                details: e,
            });
        results.push(result);
    }

    let unlocked = results.iter().filter(|r| r.status == "available").count() as i32;

    Ok(StreamingAllResult {
        services: results,
        unlocked_count: unlocked,
        total_count: services.len() as i32,
    })
}

#[tauri::command]
pub async fn check_tiktok() -> Result<TikTokResult, String> {
    let client = http::create_client().map_err(|e| e.to_string())?;

    let resp = client
        .get("https://www.tiktok.com/")
        .send()
        .await
        .map_err(|e| format!("TikTok check failed: {}", e))?;

    let status = resp.status().as_u16();
    let region = resp
        .headers()
        .get("x-tiktok-region")
        .or_else(|| resp.headers().get("cf-ray"))
        .map(|v| v.to_str().unwrap_or("Unknown"))
        .unwrap_or("Unknown")
        .to_string();

    Ok(TikTokResult {
        region,
        upload: status == 200,
        risk_level: if status == 200 { "Low" } else { "Medium" }.to_string(),
    })
}

#[tauri::command]
pub async fn check_youtube_premium() -> Result<YouTubePremiumResult, String> {
    let client = http::create_client().map_err(|e| e.to_string())?;

    let resp = client
        .get("https://www.youtube.com/premium")
        .send()
        .await
        .map_err(|e| format!("YouTube check failed: {}", e))?;

    let cdn_region = resp
        .headers()
        .get("x-goog-region")
        .or_else(|| resp.headers().get("cf-ray"))
        .map(|v| v.to_str().unwrap_or("Unknown"))
        .unwrap_or("Unknown")
        .to_string();

    Ok(YouTubePremiumResult {
        premium: cdn_region.clone(),
        cdn_region,
    })
}

async fn check_streaming_service(name: &str, url: &str) -> Result<MediaResult, String> {
    let client = http::create_client().map_err(|e| e.to_string())?;

    let resp = client
        .get(url)
        .send()
        .await
        .map_err(|e| format!("{} check failed: {}", name, e))?;

    let status = resp.status().as_u16();
    let region = resp
        .headers()
        .get("cf-ray")
        .or_else(|| resp.headers().get("x-region"))
        .map(|v| v.to_str().unwrap_or("Unknown"))
        .unwrap_or("Unknown")
        .to_string();

    let available = status == 200 || status == 301 || status == 302;

    Ok(MediaResult {
        service: name.to_string(),
        status: if available {
            "available".to_string()
        } else {
            "blocked".to_string()
        },
        region,
        details: if available {
            "Accessible".to_string()
        } else {
            format!("HTTP {} - May be geo-blocked", status)
        },
    })
}
