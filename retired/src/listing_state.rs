use crate::hits::Hits;
use serde::Serialize;

#[derive(Debug, PartialEq, Serialize)]
pub struct ListingState {
    pub new: Hits,
    pub existing: Hits,
    pub closed: Hits,
}

impl ListingState {
    pub fn update(&self, fetched_hits: Hits) -> ListingState {
        ListingState {
            new: self.get_new(&fetched_hits),
            existing: self.get_existing(&fetched_hits),
            closed: self.get_closed(&fetched_hits),
        }
    }

    fn get_new(&self, fetched_hits: &Hits) -> Hits {
        let mut existing = self.new.hits.iter().chain(self.existing.hits.iter());
        fetched_hits
            .hits
            .iter()
            .filter(|hit| {
                !existing.any(|existing_hit| {
                    existing_hit.id == hit.id && existing_hit.requisition_id == hit.requisition_id
                })
            })
            .collect()
    }

    fn get_existing(&self, fetched_hits: &Hits) -> Hits {
        let closed = self.get_closed(fetched_hits);
        self.new
            .hits
            .iter()
            .chain(self.existing.hits.iter())
            .filter(|hit| {
                !closed.hits.iter().any(|closed_hit| {
                    closed_hit.id == hit.id && closed_hit.requisition_id == hit.requisition_id
                })
            })
            .collect()
    }

    fn get_closed(&self, fetched_hits: &Hits) -> Hits {
        self.new
            .hits
            .iter()
            .chain(self.existing.hits.iter())
            .filter(|hit| {
                !fetched_hits.hits.iter().any(|fetched_hit| {
                    fetched_hit.id == hit.id && fetched_hit.requisition_id == hit.requisition_id
                })
            })
            .chain(self.closed.hits.iter())
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::hits::Hit;

    fn hit(id: &i64) -> Hit {
        Hit {
            id: *id,
            requisition_id: format!("R{}", id),
            product: Some("".into()),
            title: "".into(),
            absolute_url: "".into()
        }
    }

    fn hits(hit_ids: Vec<i64>) -> Hits {
        let hits = hit_ids.iter().map(hit).collect();
        Hits { hits }
    }

    #[test]
    fn test_update() {
        let state = ListingState {
            new: hits(vec![1, 2, 3]),
            existing: hits(vec![4, 5, 6]),
            closed: hits(vec![7, 8, 9]),
        };

        let fetched_hits = hits(vec![1, 2, 5, 6, 10]);

        let expected = ListingState {
            new: hits(vec![10]),
            existing: hits(vec![1, 2, 5, 6]),
            closed: hits(vec![3, 4, 7, 8, 9]),
        };

        let result = state.update(fetched_hits);
        assert_eq!(result, expected);
    }

    #[test]
    fn test_all_closed() {
        let state = ListingState {
            new: hits(vec![1]),
            existing: hits(vec![4]),
            closed: hits(vec![7]),
        };

        let expected = ListingState {
            new: Hits::default(),
            existing: Hits::default(),
            closed: hits(vec![1, 4, 7]),
        };

        let result = state.update(Hits::default());
        assert_eq!(result, expected);
    }

    #[test]
    fn test_all_new() {
        let state = ListingState {
            new: Hits::default(),
            existing: Hits::default(),
            closed: Hits::default(),
        };

        let fetched_hits = hits(vec![1, 2, 3]);

        let expected = ListingState {
            new: hits(vec![1, 2, 3]),
            existing: Hits::default(),
            closed: Hits::default(),
        };

        let result = state.update(fetched_hits);
        assert_eq!(result, expected);
    }

    #[test]
    fn test_all_same_state() {
        let state = ListingState {
            new: Hits::default(),
            existing: hits(vec![1, 2, 3]),
            closed: Hits::default(),
        };

        let fetched_hits = hits(vec![1, 2, 3]);

        let result = state.update(fetched_hits);
        assert_eq!(result, state);
    }
}
