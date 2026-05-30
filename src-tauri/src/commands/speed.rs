use crate::services::speed_test::{self, SpeedTestResult};

#[tauri::command]
pub async fn run_speed_test() -> Result<SpeedTestResult, String> {
    speed_test::run_test().await
}
