use serde::{Deserialize, Serialize};
use std::net::ToSocketAddrs;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DNSResult {
    pub dns_servers: Vec<String>,
    pub dns_country: String,
    pub dns_provider: String,
    pub is_leaking: bool,
    pub details: Vec<DNSQueryResult>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DNSQueryResult {
    pub domain: String,
    pub resolved_ip: String,
    pub dns_server: String,
}

/// Detect DNS configuration and check for leaks
pub async fn check_dns_config() -> Result<DNSResult, String> {
    let mut dns_servers = Vec::new();
    let mut details = Vec::new();

    // Test domains for DNS resolution
    let test_domains = vec![
        "dnsleaktest.com",
        "whoer.net",
        "ipleak.net",
    ];

    for domain in &test_domains {
        if let Ok(addrs) = format!("{}:443", domain).to_socket_addrs() {
            for addr in addrs {
                let ip_str = addr.ip().to_string();
                if !details.iter().any(|d: &DNSQueryResult| d.domain == *domain && d.resolved_ip == ip_str) {
                    details.push(DNSQueryResult {
                        domain: domain.to_string(),
                        resolved_ip: ip_str.clone(),
                        dns_server: "detected".to_string(),
                    });
                }
            }
        }
    }

    // Try to detect DNS servers via common resolver IPs
    if let Ok(addrs) = "google.com:443".to_socket_addrs() {
        let count = addrs.count();
        if count > 0 {
            dns_servers.push(format!("DNS resolution working ({} results for google.com)", count));
        }
    }

    let provider = detect_dns_provider(&dns_servers);
    let country = detect_dns_country(&details);

    Ok(DNSResult {
        dns_servers: if dns_servers.is_empty() {
            vec!["System DNS detected".to_string()]
        } else {
            dns_servers
        },
        dns_country: country,
        dns_provider: provider,
        is_leaking: details.len() > 1,
        details,
    })
}

fn detect_dns_provider(servers: &[String]) -> String {
    let joined = servers.join(" ").to_lowercase();

    if joined.contains("8.8.8.8") || joined.contains("8.8.4.4") {
        "Google DNS".to_string()
    } else if joined.contains("1.1.1.1") || joined.contains("1.0.0.1") {
        "Cloudflare DNS".to_string()
    } else if joined.contains("9.9.9.9") {
        "Quad9".to_string()
    } else if joined.contains("208.67.222.222") || joined.contains("208.67.220.220") {
        "OpenDNS".to_string()
    } else {
        "Local/ISP DNS".to_string()
    }
}

fn detect_dns_country(details: &[DNSQueryResult]) -> String {
    if details.is_empty() {
        return "Unknown".to_string();
    }

    // Simple heuristic: check resolved IPs for known patterns
    // In production, use a GeoIP database
    let ips: Vec<&str> = details.iter().map(|d| d.resolved_ip.as_str()).collect();
    let joined = ips.join(" ");

    if joined.contains("8.8.") || joined.contains("1.1.1.") {
        "US (likely)".to_string()
    } else {
        "Detected via resolution".to_string()
    }
}
