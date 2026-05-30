use serde::{Deserialize, Serialize};
use std::time::Instant;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SpeedTestResult {
    pub ping_ms: f64,
    pub download_mbps: f64,
    pub upload_mbps: f64,
    pub jitter_ms: f64,
    pub packet_loss_pct: f64,
}

pub async fn run_test() -> Result<SpeedTestResult, String> {
    let ping = measure_ping().await?;
    let jitter = measure_jitter().await?;
    let download = measure_download().await?;
    let upload = measure_upload().await?;
    let packet_loss = measure_packet_loss().await?;

    Ok(SpeedTestResult {
        ping_ms: ping,
        download_mbps: download,
        upload_mbps: upload,
        jitter_ms: jitter,
        packet_loss_pct: packet_loss,
    })
}

async fn measure_ping() -> Result<f64, String> {
    let start = Instant::now();

    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(5))
        .build()
        .map_err(|e| e.to_string())?;

    client
        .get("https://httpbin.org/get")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let elapsed = start.elapsed();
    Ok(elapsed.as_millis() as f64)
}

async fn measure_jitter() -> Result<f64, String> {
    let mut pings = Vec::new();

    for _ in 0..5 {
        let start = Instant::now();
        let client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(3))
            .build()
            .map_err(|e| e.to_string())?;

        let result = client.get("https://httpbin.org/get").send().await;
        if result.is_ok() {
            pings.push(start.elapsed().as_millis() as f64);
        }
    }

    if pings.len() < 2 {
        return Ok(0.0);
    }

    let mean = pings.iter().sum::<f64>() / pings.len() as f64;
    let variance = pings.iter().map(|p| (p - mean).powi(2)).sum::<f64>() / pings.len() as f64;
    Ok(variance.sqrt())
}

async fn measure_download() -> Result<f64, String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .map_err(|e| e.to_string())?;

    let start = Instant::now();
    let resp = client
        .get("https://speed.cloudflare.com/__down?bytes=5000000")
        .send()
        .await
        .map_err(|e| format!("Download test failed: {}", e))?;

    let bytes = resp.bytes().await.map_err(|e| e.to_string())?;
    let elapsed = start.elapsed();
    let mbps = (bytes.len() as f64 * 8.0) / (elapsed.as_secs_f64() * 1_000_000.0);

    Ok((mbps * 10.0).round() / 10.0)
}

async fn measure_upload() -> Result<f64, String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .map_err(|e| e.to_string())?;

    let data = vec![0u8; 1_000_000]; // 1MB payload

    let start = Instant::now();
    let resp = client
        .post("https://httpbin.org/post")
        .body(data)
        .send()
        .await
        .map_err(|e| format!("Upload test failed: {}", e))?;

    resp.bytes().await.map_err(|e| e.to_string())?;
    let elapsed = start.elapsed();
    let mbps = (1_000_000.0 * 8.0) / (elapsed.as_secs_f64() * 1_000_000.0);

    Ok((mbps * 10.0).round() / 10.0)
}

async fn measure_packet_loss() -> Result<f64, String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(5))
        .build()
        .map_err(|e| e.to_string())?;

    let total = 10;
    let mut failures = 0;

    for _ in 0..total {
        if client
            .get("https://httpbin.org/get")
            .send()
            .await
            .is_err()
        {
            failures += 1;
        }
    }

    Ok((failures as f64 / total as f64) * 100.0)
}
