use crate::services::dns_resolver::{self, DNSResult};

#[tauri::command]
pub async fn check_dns() -> Result<DNSResult, String> {
    dns_resolver::check_dns_config().await
}

#[tauri::command]
pub async fn check_dns_leak() -> Result<DNSResult, String> {
    let result = dns_resolver::check_dns_config().await?;

    // Enhanced leak detection
    Ok(DNSResult {
        dns_servers: result.dns_servers,
        dns_country: result.dns_country,
        dns_provider: result.dns_provider,
        is_leaking: result.details.len() > 1,
        details: result.details,
    })
}
