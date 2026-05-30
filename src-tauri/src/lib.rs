mod commands;
mod services;
mod db;
mod scoring;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            db::init_db(app.handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::ip::get_ip_info,
            commands::ip::get_ip_batch,
            commands::dns::check_dns,
            commands::dns::check_dns_leak,
            commands::webrtc::check_webrtc,
            commands::ai::check_chatgpt,
            commands::ai::check_claude,
            commands::ai::check_gemini,
            commands::ai::check_all_ai_services,
            commands::risk::check_google_risk,
            commands::risk::check_cloudflare_risk,
            commands::risk::check_ip_purity,
            commands::risk::check_blacklist,
            commands::media::check_netflix,
            commands::media::check_streaming_all,
            commands::media::check_tiktok,
            commands::media::check_youtube_premium,
            commands::speed::run_speed_test,
            commands::score::calculate_score,
            commands::score::get_score_history,
            commands::report::generate_report,
            commands::report::get_history,
            commands::report::export_csv,
            commands::report::export_json,
        ])
        .run(tauri::generate_context!())
        .expect("error while running AI Proxy Inspector");
}
