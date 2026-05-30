use serde::{Deserialize, Serialize};
use crate::db::models::DetectionRecord;
use crate::db::DbState;
use tauri::State;

#[derive(Debug, Serialize, Deserialize)]
pub struct ReportData {
    pub ip_info: Option<serde_json::Value>,
    pub dns_result: Option<serde_json::Value>,
    pub ai_services: Option<serde_json::Value>,
    pub streaming: Option<serde_json::Value>,
    pub risk: Option<serde_json::Value>,
    pub score: Option<serde_json::Value>,
    pub speed: Option<serde_json::Value>,
}

#[tauri::command]
pub async fn generate_report(data: ReportData, db: State<'_, DbState>) -> Result<String, String> {
    // Save detection record to database
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let ip = data
        .ip_info
        .as_ref()
        .and_then(|v| v["ip"].as_str())
        .unwrap_or("Unknown");

    let asn = data
        .ip_info
        .as_ref()
        .and_then(|v| v["asn"].as_str());

    let country = data
        .ip_info
        .as_ref()
        .and_then(|v| v["country"].as_str());

    let city = data
        .ip_info
        .as_ref()
        .and_then(|v| v["city"].as_str());

    let isp = data
        .ip_info
        .as_ref()
        .and_then(|v| v["isp"].as_str());

    let ai_json = data.ai_services.as_ref().map(|v| v.to_string());
    let dns_provider = data
        .dns_result
        .as_ref()
        .and_then(|v| v["dns_provider"].as_str());

    let dns_leak = data
        .dns_result
        .as_ref()
        .and_then(|v| v["is_leaking"].as_bool());

    let google_risk = data
        .risk
        .as_ref()
        .and_then(|v| v["google_risk"].as_object())
        .and_then(|v| v.get("risk_level"))
        .and_then(|v| v.as_str());

    let cf_risk = data
        .risk
        .as_ref()
        .and_then(|v| v["cloudflare_risk"].as_object())
        .and_then(|v| v.get("risk"))
        .and_then(|v| v.as_str());

    let ip_type = data
        .risk
        .as_ref()
        .and_then(|v| v["ip_purity"].as_object())
        .and_then(|v| v.get("ip_type"))
        .and_then(|v| v.as_str());

    let score_val = data
        .score
        .as_ref()
        .and_then(|v| v["total"].as_i64());

    conn.execute(
        "INSERT INTO detection_history (ip, asn, country, city, isp, ai_services, dns_provider, dns_leak, google_risk, cf_risk, ip_type, score) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
        rusqlite::params![
            ip,
            asn,
            country,
            city,
            isp,
            ai_json,
            dns_provider,
            dns_leak,
            google_risk,
            cf_risk,
            ip_type,
            score_val,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok("Report saved successfully".to_string())
}

#[tauri::command]
pub async fn get_history(db: State<'_, DbState>) -> Result<Vec<DetectionRecord>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT id, timestamp, ip, asn, country, city, isp, ai_services, dns_provider, dns_leak, webrtc_leak, google_risk, cf_risk, ip_type, score, report_path FROM detection_history ORDER BY timestamp DESC LIMIT 100")
        .map_err(|e| e.to_string())?;

    let records = stmt
        .query_map([], |row| {
            Ok(DetectionRecord {
                id: row.get(0)?,
                timestamp: row.get(1)?,
                ip: row.get(2)?,
                asn: row.get(3)?,
                country: row.get(4)?,
                city: row.get(5)?,
                isp: row.get(6)?,
                ai_services: row.get(7)?,
                dns_provider: row.get(8)?,
                dns_leak: row.get::<_, Option<bool>>(9)?,
                webrtc_leak: row.get::<_, Option<bool>>(10)?,
                google_risk: row.get(11)?,
                cf_risk: row.get(12)?,
                ip_type: row.get(13)?,
                score: row.get(14)?,
                report_path: row.get(15)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(records)
}

#[tauri::command]
pub async fn export_csv(db: State<'_, DbState>) -> Result<String, String> {
    let records = get_history_inner(&db)?;

    let mut csv = String::from("Timestamp,IP,ASN,Country,City,ISP,DNS Provider,DNS Leak,Google Risk,CF Risk,IP Type,Score\n");

    for r in &records {
        csv.push_str(&format!(
            "{},{},{},{},{},{},{},{},{},{},{},{}\n",
            r.timestamp,
            r.ip,
            r.asn.as_deref().unwrap_or(""),
            r.country.as_deref().unwrap_or(""),
            r.city.as_deref().unwrap_or(""),
            r.isp.as_deref().unwrap_or(""),
            r.dns_provider.as_deref().unwrap_or(""),
            r.dns_leak.map(|v| if v { "Yes" } else { "No" }).unwrap_or(""),
            r.google_risk.as_deref().unwrap_or(""),
            r.cf_risk.as_deref().unwrap_or(""),
            r.ip_type.as_deref().unwrap_or(""),
            r.score.map(|s| s.to_string()).unwrap_or_default(),
        ));
    }

    Ok(csv)
}

#[tauri::command]
pub async fn export_json(db: State<'_, DbState>) -> Result<String, String> {
    let records = get_history_inner(&db)?;
    serde_json::to_string_pretty(&records).map_err(|e| e.to_string())
}

fn get_history_inner(db: &State<'_, DbState>) -> Result<Vec<DetectionRecord>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, timestamp, ip, asn, country, city, isp, ai_services, dns_provider, dns_leak, webrtc_leak, google_risk, cf_risk, ip_type, score, report_path FROM detection_history ORDER BY timestamp DESC LIMIT 500")
        .map_err(|e| e.to_string())?;

    let records = stmt
        .query_map([], |row| {
            Ok(DetectionRecord {
                id: row.get(0)?,
                timestamp: row.get(1)?,
                ip: row.get(2)?,
                asn: row.get(3)?,
                country: row.get(4)?,
                city: row.get(5)?,
                isp: row.get(6)?,
                ai_services: row.get(7)?,
                dns_provider: row.get(8)?,
                dns_leak: row.get::<_, Option<bool>>(9)?,
                webrtc_leak: row.get::<_, Option<bool>>(10)?,
                google_risk: row.get(11)?,
                cf_risk: row.get(12)?,
                ip_type: row.get(13)?,
                score: row.get(14)?,
                report_path: row.get(15)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(records)
}
