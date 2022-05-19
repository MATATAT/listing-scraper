use crate::{config::Config, hits::Hits, result::*};
use reqwest::Url;

pub struct JobClient {
    config: Config,
}

impl JobClient {
    pub fn new(config: Config) -> Self {
        JobClient { config }
    }

    pub fn request(&self) -> Result<Hits> {
        let url = Url::parse_with_params(&self.config.url, self.build_request_params())
            .map_err(|_| ScraperError::UrlParse)?;
        let response = reqwest::blocking::get(url)?;

        response.json::<Hits>().map_err(|e| e.into())
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
