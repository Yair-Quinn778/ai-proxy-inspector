use crate::services::ip_api::{self, IPInfo};

#[tauri::command]
pub async fn get_ip_info() -> Result<IPInfo, String> {
    ip_api::fetch_ip_info_multi().await
}

#[tauri::command]
pub async fn get_ip_batch(ips: Vec<String>) -> Result<Vec<IPInfo>, String> {
    let mut results = Vec::new();

    for ip in &ips {
        match ip_api::fetch_ip_info_for_ip(ip).await {
            Ok(info) => results.push(info),
            Err(e) => {
                results.push(IPInfo {
                    ip: ip.clone(),
                    asn: "Error".to_string(),
                    asn_name: e.clone(),
                    isp: "N/A".to_string(),
                    country: "N/A".to_string(),
                    country_code: "N/A".to_string(),
                    region: "N/A".to_string(),
                    city: "N/A".to_string(),
                    zip: "N/A".to_string(),
                    latitude: 0.0,
                    longitude: 0.0,
                    timezone: "N/A".to_string(),
                });
            }
        }
    }

    Ok(results)
}
