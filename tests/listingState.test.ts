import { Hit, Hits } from "../src/hits";
import { ListingState } from "../src/listingState";

describe("ListingState", () => {
    function hit(hitId: number): Hit {
        return {
            id: hitId,
            requisition_id: `R${hitId}`,
            product: "",
            title: "",
            absolute_url: ""
        }
    }

    function hits(hitIds: number[]): Hits {
        return hitIds.map((hitId) => hit(hitId));
    }

    test("test update", () => {
        const state = new ListingState(
            hits([1, 2, 3]),
            hits([4, 5, 6]),
            hits([7, 8, 9])
        );

        const fetchedHits = hits([1, 2, 5, 6, 10]);

        const expected = new ListingState(
            hits([10]),
            hits([1, 2, 5, 6]),
            hits([3, 4, 7, 8, 9])
        );
        
        expect(state.update(fetchedHits)).toEqual(expected);
    });
    
    test("test all closed", () => {
        const state = new ListingState(
            hits([1]),
            hits([4]),
            hits([7])
        );

        const expected = new ListingState(
            [],
            [],
            hits([1, 4, 7])
        );

        expect(state.update([])).toEqual(expected);
    });

    test("test all new", () => {
        const state = new ListingState([], [], []);

        const fetchedHits = hits([1, 2, 3]);

        const expected = new ListingState(
            hits([1, 2, 3]),
            [],
            []
        );

        expect(state.update(fetchedHits)).toEqual(expected);
    });

    test("test all same state", () => {
        const state = new ListingState(
            [],
            hits([1, 2, 3]),
            []
        );

        const fetchedHits = hits([1, 2, 3]);

        expect(state.update(fetchedHits)).toEqual(state);
    });

    test('can be serialized', () => {
        const state = new ListingState(
            hits([1]),
            [],
            []
        );

        const expected = JSON.stringify({
            newHits: [
                {
                    id: 1,
                    requisition_id: 'R1',
                    product: '',
                    title: '',
                    absolute_url: ''
                }
            ],
            existingHits: [],
            closedHits: []
        });

        expect(JSON.stringify(state)).toEqual(expected);
    });
});