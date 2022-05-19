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
        let mut existing = self.new.0.iter().chain(self.existing.0.iter());
        fetched_hits
            .0
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
            .0
            .iter()
            .chain(self.existing.0.iter())
            .filter(|hit| {
                !closed.0.iter().any(|closed_hit| {
                    closed_hit.id == hit.id && closed_hit.requisition_id == hit.requisition_id
                })
            })
            .collect()
    }

    fn get_closed(&self, fetched_hits: &Hits) -> Hits {
        self.new
            .0
            .iter()
            .chain(self.existing.0.iter())
            .filter(|hit| {
                !fetched_hits.0.iter().any(|fetched_hit| {
                    fetched_hit.id == hit.id && fetched_hit.requisition_id == hit.requisition_id
                })
            })
            .chain(self.closed.0.iter())
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::hits::Hit;

    fn hit(id: i64) -> Hit {
        Hit {
            id,
            requisition_id: format!("R{}", id),
            product: "".into(),
            title: "".into(),
        }
    }

    #[test]
    fn test_update() {
        let state = ListingState {
            new: Hits(vec![hit(1), hit(2), hit(3)]),
            existing: Hits(vec![hit(4), hit(5), hit(6)]),
            closed: Hits(vec![hit(7), hit(8), hit(9)]),
        };

        let fetched_hits = Hits(vec![hit(1), hit(2), hit(5), hit(6), hit(10)]);

        let expected = ListingState {
            new: Hits(vec![hit(10)]),
            existing: Hits(vec![hit(1), hit(2), hit(5), hit(6)]),
            closed: Hits(vec![hit(3), hit(4), hit(7), hit(8), hit(9)]),
        };

        let result = state.update(fetched_hits);
        assert_eq!(result, expected);
    }

    #[test]
    fn test_all_closed() {
        let state = ListingState {
            new: Hits(vec![hit(1)]),
            existing: Hits(vec![hit(4)]),
            closed: Hits(vec![hit(7)]),
        };

        let expected = ListingState {
            new: Hits(Vec::new()),
            existing: Hits(Vec::new()),
            closed: Hits(vec![hit(1), hit(4), hit(7)]),
        };

        let result = state.update(Hits(Vec::new()));
        assert_eq!(result, expected);
    }

    #[test]
    fn test_all_new() {
        let state = ListingState {
            new: Hits(Vec::new()),
            existing: Hits(Vec::new()),
            closed: Hits(Vec::new()),
        };

        let fetched_hits = Hits(vec![hit(1), hit(2), hit(3)]);

        let expected = ListingState {
            new: Hits(vec![hit(1), hit(2), hit(3)]),
            existing: Hits(Vec::new()),
            closed: Hits(Vec::new()),
        };

        let result = state.update(fetched_hits);
        assert_eq!(result, expected);
    }

    #[test]
    fn test_all_same_state() {
        let state = ListingState {
            new: Hits(Vec::new()),
            existing: Hits(vec![hit(1), hit(2), hit(3)]),
            closed: Hits(Vec::new()),
        };

        let fetched_hits = Hits(vec![hit(1), hit(2), hit(3)]);

        let result = state.update(fetched_hits);
        assert_eq!(result, state);
    }
}
