use reqwest::Url;

use crate::{config::Config, result::*};

pub struct Client {
    config: Config,
}

impl Client {
    pub fn new(config: Config) -> Self {
        Client { config }
    }

    pub fn request(&self) -> Result<()> {
        // let response = reqwest::blocking::get(config.url)?.json::<HashMap<String, String>>()?;
        let url = Url::parse_with_params(&self.config.url, self.build_request_params())
            .map_err(|_| ScraperError::UrlParse)?;
        let response = reqwest::blocking::get(url)?;

        println!("{:?}", response);

        Ok(())
    }

    fn build_request_params(&self) -> [(&'_ str, &'_ str); 4] {
        [
            ("country", &*self.config.country),
            ("state", &*self.config.state),
            ("city", &*self.config.city),
            ("department", &*self.config.department),
        ]
    }
}
