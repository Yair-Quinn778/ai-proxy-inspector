use reqwest::Client;
use std::time::Duration;

pub fn create_client() -> Result<Client, reqwest::Error> {
    Client::builder()
        .timeout(Duration::from_secs(15))
        .user_agent("AI-Proxy-Inspector/1.0")
        .build()
}

#[allow(dead_code)]
pub fn create_proxy_client(proxy_url: &str) -> Result<Client, reqwest::Error> {
    Client::builder()
        .timeout(Duration::from_secs(15))
        .user_agent("AI-Proxy-Inspector/1.0")
        .proxy(reqwest::Proxy::all(proxy_url).unwrap())
        .build()
}
