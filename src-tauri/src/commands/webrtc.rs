use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WebRTCResult {
    pub webrtc_leak: bool,
    pub local_ips: Vec<String>,
    pub public_ips: Vec<String>,
}

/// WebRTC detection is primarily done client-side in the browser.
/// This command provides server-side validation results.
#[tauri::command]
pub async fn check_webrtc() -> Result<WebRTCResult, String> {
    // WebRTC leak detection happens in the browser via JavaScript
    // This is a placeholder for server-side validation
    Ok(WebRTCResult {
        webrtc_leak: false,
        local_ips: vec![],
        public_ips: vec![],
    })
}
