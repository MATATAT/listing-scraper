import { Hits } from "./hits";

export class ListingState {
    constructor(
        public newHits: Hits,
        public existingHits: Hits,
        public closedHits: Hits
    ) { }

    public update(fetchedHits: Hits): ListingState {
        return new ListingState(
            this.getNew(fetchedHits),
            this.getExisting(fetchedHits),
            this.getClosed(fetchedHits)
        );
    }

    private getNew(fetchedHits: Hits): Hits {
        const existing = this.newHits.concat(this.existingHits);
        return fetchedHits.filter((hit) => {
            return !existing.find((existingHit) => {
                return existingHit.id === hit.id && existingHit.requisition_id === hit.requisition_id;
            });
        });
    }

    private getExisting(fetchedHits: Hits): Hits {
        let closed = this.getClosed(fetchedHits);
        return this.newHits.concat(this.existingHits).filter((hit) => {
            return !closed.find((closedHit) => {
                return closedHit.id === hit.id && closedHit.requisition_id === hit.requisition_id;
            });
        });
    }

    private getClosed(fetchedHits: Hits): Hits {
        return this.newHits.concat(this.existingHits).filter((hit) => {
            return !fetchedHits.find((fetchedHit) => {
                return fetchedHit.id === hit.id && fetchedHit.requisition_id === fetchedHit.requisition_id;
            });
        }).concat(this.closedHits);
    }
}