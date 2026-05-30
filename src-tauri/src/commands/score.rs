use serde::Deserialize;
use crate::db::models::ScoreRecord;
use crate::db::DbState;
use crate::scoring::calculator::{self, ScoreBreakdown};
use tauri::State;

#[derive(Debug, Deserialize)]
pub struct ScoreInput {
    pub ip_type: String,
    pub ai_available: i32,
    pub ai_total: i32,
    pub streaming_available: i32,
    pub streaming_total: i32,
    pub google_risk: String,
    pub cf_risk: String,
    pub blacklisted: bool,
    pub ping_ms: f64,
    pub download_mbps: f64,
}

#[tauri::command]
pub async fn calculate_score(input: ScoreInput, db: State<'_, DbState>) -> Result<ScoreBreakdown, String> {
    let result = calculator::calculate(
        &input.ip_type,
        input.ai_available,
        input.ai_total,
        input.streaming_available,
        input.streaming_total,
        &input.google_risk,
        &input.cf_risk,
        input.blacklisted,
        input.ping_ms,
        input.download_mbps,
    );

    // Save to history
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO score_history (score, grade, ip_quality_score, ai_availability_score, streaming_score, risk_score, network_score) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        rusqlite::params![
            result.total,
            result.grade,
            result.ip_quality,
            result.ai_availability,
            result.streaming,
            result.risk,
            result.network,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(result)
}

#[tauri::command]
pub async fn get_score_history(db: State<'_, DbState>) -> Result<Vec<ScoreRecord>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT id, timestamp, score, grade, ip_quality_score, ai_availability_score, streaming_score, risk_score, network_score FROM score_history ORDER BY timestamp DESC LIMIT 100")
        .map_err(|e| e.to_string())?;

    let records = stmt
        .query_map([], |row| {
            Ok(ScoreRecord {
                id: row.get(0)?,
                timestamp: row.get(1)?,
                score: row.get(2)?,
                grade: row.get(3)?,
                ip_quality_score: row.get(4)?,
                ai_availability_score: row.get(5)?,
                streaming_score: row.get(6)?,
                risk_score: row.get(7)?,
                network_score: row.get(8)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(records)
}
