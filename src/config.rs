use std::{fs, path::Path};
use serde::Deserialize;
use crate::result::*;

#[derive(Debug, Deserialize)]
pub struct Config {
    pub url: String,
    pub country: String,
    pub state: String,
    pub city: String,
    pub department: String
}

impl Config {
    pub fn from_json(config_json_path: &Path) -> Result<Self> {
        let json_string = fs::read_to_string(config_json_path)?;
        let config = serde_json::from_str::<Config>(json_string.as_str())?;
        
        Ok(config)
    }
}
