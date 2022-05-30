import got from 'got';
import { Configuration } from './configuration';
import { Hit, Hits } from './hits';

type HitsResult = { hits: Hits };

export class ListingClient {
    constructor(public configuration: Configuration) {}

    public async request(): Promise<Hits | null> {
        const result = await got.get(this.buildRequestParams().toString()).json<HitsResult>();
        return Promise.resolve(this.mapResultToHits(result));
    }

    private buildRequestParams(): URL {
        const url = new URL(this.configuration.url);

        url.searchParams.append('country', this.configuration.country);
        url.searchParams.append('state', this.configuration.state);
        url.searchParams.append('city', this.configuration.city);
        url.searchParams.append('department', this.configuration.department);

        return url;
    }

    private mapResultToHits(result: HitsResult): Hits {
        return result.hits.map((hit) => {
            return {
                id: hit.id,
                requisition_id: hit.requisition_id,
                product: hit.product,
                title: hit.title,
                absolute_url: hit.absolute_url,
            } as Hit;
        });
    }
}
