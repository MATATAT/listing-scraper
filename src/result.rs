use thiserror::Error;

pub type Result<T> = std::result::Result<T, ScraperError>;

#[derive(Error, Debug)]
pub enum ScraperError {
    #[error("Error reading the configuration file.")]
    FileRead(#[from] std::io::Error),
    #[error("Error parsing configuration file.")]
    JsonParse(#[from] serde_json::error::Error),
    #[error("API request error: {0}")]
    ApiRequest(#[from] reqwest::Error),
    #[error("Url parse error")]
    UrlParse,
}