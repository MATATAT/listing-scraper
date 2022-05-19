use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Hits(Vec<Hit>);

#[derive(Debug, Deserialize)]
pub struct Hit {
    pub id: i64,
    pub requisition_id: String,
    pub title: String
}