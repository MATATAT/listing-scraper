use serde::{Deserialize, Serialize};

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct Hits(pub Vec<Hit>);

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Hit {
    pub id: i64,
    pub requisition_id: String,
    pub product: String,
    pub title: String,
}

impl<'a> FromIterator<&'a Hit> for Hits {
    fn from_iter<T>(iter: T) -> Self
    where
        T: IntoIterator<Item = &'a Hit>,
    {
        let mut result = Hits(Vec::new());

        iter.into_iter().for_each(|i| result.0.push(i.clone()));

        result
    }
}
