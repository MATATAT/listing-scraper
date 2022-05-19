use serde::{Deserialize, Serialize};

#[derive(Debug, Default, PartialEq, Serialize, Deserialize)]
pub struct Hits {
    pub hits: Vec<Hit>
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Hit {
    pub id: i64,
    pub requisition_id: String,
    pub product: Option<String>,
    pub title: String,
    pub absolute_url: String
}

impl<'a> FromIterator<&'a Hit> for Hits {
    fn from_iter<T>(iter: T) -> Self
    where
        T: IntoIterator<Item = &'a Hit>,
    {
        let mut result = Hits { hits: Vec::new() };

        iter.into_iter().for_each(|i| result.hits.push(i.clone()));

        result
    }
}

#[cfg(test)]
mod tests {
    use super::{Hits, Hit};

    #[test]
    fn test_parse() {
        let json_str = r#"
        {
            "hits": [
                {
                    "product": "P1",
                    "title": "A",
                    "requisition_id": "R1",
                    "id": 1,
                    "absolute_url": ""
                },
                {
                    "product": null,
                    "title": "B",
                    "requisition_id": "R2",
                    "id": 2,
                    "absolute_url": ""
                }
            ]
        }
        "#;

        let expected = Hits {
            hits: vec![
                Hit { id: 1, requisition_id: "R1".into(), product: Some("P1".into()), title: "A".into(), absolute_url: "".into() },
                Hit { id: 2, requisition_id: "R2".into(), product: None, title: "B".into(), absolute_url: "".into() }
            ]
        };

        let result = serde_json::from_str::<Hits>(json_str).unwrap();
        assert_eq!(result, expected);
    }
}