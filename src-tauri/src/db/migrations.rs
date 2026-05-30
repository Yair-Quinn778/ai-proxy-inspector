use rusqlite::{Connection, Result};

pub fn run_migrations(conn: &Connection) -> Result<()> {
    conn.execute_batch("
        CREATE TABLE IF NOT EXISTS detection_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            ip TEXT NOT NULL,
            asn TEXT,
            country TEXT,
            city TEXT,
            isp TEXT,
            ai_services TEXT,
            dns_provider TEXT,
            dns_leak INTEGER,
            webrtc_leak INTEGER,
            google_risk TEXT,
            cf_risk TEXT,
            ip_type TEXT,
            score INTEGER,
            report_path TEXT
        );

        CREATE TABLE IF NOT EXISTS score_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            score INTEGER NOT NULL,
            grade TEXT NOT NULL,
            ip_quality_score INTEGER DEFAULT 0,
            ai_availability_score INTEGER DEFAULT 0,
            streaming_score INTEGER DEFAULT 0,
            risk_score INTEGER DEFAULT 0,
            network_score INTEGER DEFAULT 0
        );

        CREATE INDEX IF NOT EXISTS idx_detection_timestamp ON detection_history(timestamp DESC);
        CREATE INDEX IF NOT EXISTS idx_score_timestamp ON score_history(timestamp DESC);
    ")?;

    Ok(())
}
