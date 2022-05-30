import { Configuration } from './configuration';
import { ListingClient } from './listingClient';
import { ListingState } from './listingState';

(() => {
    const config = Configuration.fromPath('./config.json');
    const fetchedHitsPromise = new ListingClient(config).request();

    fetchedHitsPromise.then((fetchedHits) => {
        const state = new ListingState([], [], []);

        if (!fetchedHits) {
            return;
        }
        const newState = state.update(fetchedHits);

        console.log(newState);
    });
})();
