pub mod models;
pub mod migrations;

use rusqlite::Connection;
use std::sync::Mutex;
use tauri::AppHandle;
use tauri::Manager;

pub struct DbState {
    pub conn: Mutex<Connection>,
}

pub fn init_db(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let app_dir = app
        .path()
        .app_data_dir()
        .unwrap_or_else(|_| std::path::PathBuf::from("."));

    std::fs::create_dir_all(&app_dir)?;

    let db_path = app_dir.join("ai_proxy_inspector.db");
    let conn = Connection::open(db_path)?;

    migrations::run_migrations(&conn)?;

    app.manage(DbState {
        conn: Mutex::new(conn),
    });

    Ok(())
}
