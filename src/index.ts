import { Configuration } from './configuration';
import { ListingClient } from './listingClient';
import { ListingStateClient } from './listingStateClient';
import { APIGatewayEvent, APIGatewayProxyResultV2, Context } from 'aws-lambda';
import { EmailClient } from './emailClient';
import { IResult, Origin, Status } from './result';

export async function handler(_event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResultV2> {
    const config = Configuration.fromPath('./config.json');
    const listingClient = new ListingClient(config);
    const listingStateClient = new ListingStateClient();
    const emailClient = new EmailClient();

    return Promise.all([listingClient.request(), listingStateClient.load()])
        .then(([fetchedHits, listingState]) => {
            console.log('listings and state retrieved...');
            if (!fetchedHits) {
                return Promise.reject('Fetched hits was empty');
            }

            const actions = [];
            console.log('updating state...');
            const newState = listingState.update(fetchedHits);
            
            if (newState.newHits.length) {
                console.log('New hits available. Sending email...');
                actions.push(emailClient.sendNewHits(newState.newHits));
            }

            console.log('saving state...');
            actions.push(listingStateClient.save(newState));
            return Promise.allSettled(actions);
        })
        .then((results) => {
            const manageResults = (settledRes: IResult) => {
                if (settledRes.status === Status.Ok) { return Promise.resolve(); }

                if (settledRes.origin === Origin.ListingState) {
                    return Promise.reject('Failed to save state');
                }

                if (settledRes.origin === Origin.Email) {
                    console.warn('Failed to send email');
                }

                return Promise.resolve();
            };

            results.forEach((result) => {
                switch (result.status) {
                    case 'fulfilled':
                        return manageResults(result.value);
                    case 'rejected':
                        return result;
                }
            });
        })
        .then(() => Promise.resolve('State resolution succeeded'))
        .catch((reason: string) => Promise.reject(`State resolution failed: ${reason}`));
};
