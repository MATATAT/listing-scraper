import { Configuration } from './configuration';
import { ListingClient } from './listingClient';
import { ListingStateClient } from './listingStateClient';
import { APIGatewayEvent, APIGatewayProxyResultV2, Context } from 'aws-lambda';

export async function handler(_event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResultV2> {
    const config = Configuration.fromPath('./config.json');
    const listingClient = new ListingClient(config);
    const listingStateClient = new ListingStateClient();

    return Promise.all([listingClient.request(), listingStateClient.load()])
        .then(([fetchedHits, listingState]) => {
            console.log('listings and state retrieved...');
            if (!fetchedHits) {
                return Promise.reject('Fetched hits was empty');
            }

            console.log('updating state...');
            const newState = listingState.update(fetchedHits);

            console.log('saving state...');
            return listingStateClient.save(newState);
        })
        .then(() => Promise.resolve('State resolution succeeded'))
        .catch((reason: string) => Promise.reject(`State resolution failed: ${reason}`));
};
