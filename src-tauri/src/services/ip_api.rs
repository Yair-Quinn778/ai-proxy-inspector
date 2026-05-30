use serde::{Deserialize, Serialize};
use crate::services::http;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct IPInfo {
    pub ip: String,
    pub asn: String,
    pub asn_name: String,
    pub isp: String,
    pub country: String,
    pub country_code: String,
    pub region: String,
    pub city: String,
    pub zip: String,
    pub latitude: f64,
    pub longitude: f64,
    pub timezone: String,
}

#[derive(Debug, Deserialize)]
struct IpApiResponse {
    query: String,
    status: String,
    asn: Option<String>,
    #[serde(rename = "as")]
    as_name: Option<String>,
    isp: Option<String>,
    country: Option<String>,
    #[serde(rename = "countryCode")]
    country_code: Option<String>,
    #[allow(dead_code)]
    region: Option<String>,
    #[serde(rename = "regionName")]
    region_name: Option<String>,
    city: Option<String>,
    zip: Option<String>,
    lat: Option<f64>,
    lon: Option<f64>,
    timezone: Option<String>,
}

#[derive(Debug, Deserialize)]
struct IpWhoisResponse {
    ip: String,
    asn: Option<IpWhoisAsn>,
    connection: Option<IpWhoisConnection>,
    country: Option<String>,
    region: Option<String>,
    city: Option<String>,
    latitude: Option<f64>,
    longitude: Option<f64>,
    timezone: Option<IpWhoisTimezone>,
}

#[derive(Debug, Deserialize)]
struct IpWhoisAsn {
    asn: Option<String>,
    name: Option<String>,
}

#[derive(Debug, Deserialize)]
struct IpWhoisConnection {
    isp: Option<String>,
}

#[derive(Debug, Deserialize)]
struct IpWhoisTimezone {
    id: Option<String>,
}

pub async fn fetch_ip_info() -> Result<IPInfo, String> {
    let client = http::create_client().map_err(|e| e.to_string())?;

    // Try ip-api.com first (free, no API key needed)
    let url = "http://ip-api.com/json/?fields=status,message,query,as,asname,isp,country,countryCode,regionName,city,zip,lat,lon,timezone";
    let resp: IpApiResponse = client
        .get(url)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch IP info: {}", e))?
        .json()
        .await
        .map_err(|e| format!("Failed to parse IP info: {}", e))?;

    if resp.status != "success" {
        return Err("IP API returned non-success status".to_string());
    }

    Ok(IPInfo {
        ip: resp.query,
        asn: resp.asn.unwrap_or_else(|| "N/A".to_string()),
        asn_name: resp.as_name.unwrap_or_else(|| "N/A".to_string()),
        isp: resp.isp.unwrap_or_else(|| "N/A".to_string()),
        country: resp.country.unwrap_or_else(|| "N/A".to_string()),
        country_code: resp.country_code.unwrap_or_else(|| "N/A".to_string()),
        region: resp.region_name.unwrap_or_else(|| "N/A".to_string()),
        city: resp.city.unwrap_or_else(|| "N/A".to_string()),
        zip: resp.zip.unwrap_or_else(|| "N/A".to_string()),
        latitude: resp.lat.unwrap_or(0.0),
        longitude: resp.lon.unwrap_or(0.0),
        timezone: resp.timezone.unwrap_or_else(|| "N/A".to_string()),
    })
}

pub async fn fetch_ip_info_for_ip(ip: &str) -> Result<IPInfo, String> {
    let client = http::create_client().map_err(|e| e.to_string())?;

    let url = format!(
        "http://ip-api.com/json/{}?fields=status,message,query,as,asname,isp,country,countryCode,regionName,city,zip,lat,lon,timezone",
        ip
    );
    let resp: IpApiResponse = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch IP info: {}", e))?
        .json()
        .await
        .map_err(|e| format!("Failed to parse IP info: {}", e))?;

    if resp.status != "success" {
        return Err("IP API returned non-success status".to_string());
    }

    Ok(IPInfo {
        ip: resp.query,
        asn: resp.asn.unwrap_or_else(|| "N/A".to_string()),
        asn_name: resp.as_name.unwrap_or_else(|| "N/A".to_string()),
        isp: resp.isp.unwrap_or_else(|| "N/A".to_string()),
        country: resp.country.unwrap_or_else(|| "N/A".to_string()),
        country_code: resp.country_code.unwrap_or_else(|| "N/A".to_string()),
        region: resp.region_name.unwrap_or_else(|| "N/A".to_string()),
        city: resp.city.unwrap_or_else(|| "N/A".to_string()),
        zip: resp.zip.unwrap_or_else(|| "N/A".to_string()),
        latitude: resp.lat.unwrap_or(0.0),
        longitude: resp.lon.unwrap_or(0.0),
        timezone: resp.timezone.unwrap_or_else(|| "N/A".to_string()),
    })
}

pub async fn fetch_ip_info_from_ipwhois() -> Result<IPInfo, String> {
    let client = http::create_client().map_err(|e| e.to_string())?;

    let resp: IpWhoisResponse = client
        .get("https://ipwho.is/")
        .send()
        .await
        .map_err(|e| format!("Failed to fetch IP info: {}", e))?
        .json()
        .await
        .map_err(|e| format!("Failed to parse IP info: {}", e))?;

    let asn_info = resp.asn.unwrap_or(IpWhoisAsn {
        asn: None,
        name: None,
    });
    let conn_info = resp.connection.unwrap_or(IpWhoisConnection { isp: None });
    let tz_info = resp.timezone.unwrap_or(IpWhoisTimezone { id: None });

    Ok(IPInfo {
        ip: resp.ip,
        asn: asn_info.asn.unwrap_or_else(|| "N/A".to_string()),
        asn_name: asn_info.name.unwrap_or_else(|| "N/A".to_string()),
        isp: conn_info.isp.unwrap_or_else(|| "N/A".to_string()),
        country: resp.country.unwrap_or_else(|| "N/A".to_string()),
        country_code: "".to_string(),
        region: resp.region.unwrap_or_else(|| "N/A".to_string()),
        city: resp.city.unwrap_or_else(|| "N/A".to_string()),
        zip: "".to_string(),
        latitude: resp.latitude.unwrap_or(0.0),
        longitude: resp.longitude.unwrap_or(0.0),
        timezone: tz_info.id.unwrap_or_else(|| "N/A".to_string()),
    })
}

/// Try multiple IP APIs in sequence for redundancy
pub async fn fetch_ip_info_multi() -> Result<IPInfo, String> {
    match fetch_ip_info().await {
        Ok(info) => Ok(info),
        Err(_) => fetch_ip_info_from_ipwhois().await,
    }
}
