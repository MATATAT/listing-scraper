import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { ListingState } from './listingState';
import { IResult, Result, Origin } from './result';

const LISTING_STATE_BUCKET = 'listing-state-bucket';
const STATE_KEY = 'State';

export class ListingStateClient {
    private s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({});
    }

    public async load(): Promise<ListingState> {
        console.log('loading listing state...');
        const getCommand = new GetObjectCommand({
            Bucket: LISTING_STATE_BUCKET,
            Key: STATE_KEY,
        });

        try {
            const result = await this.s3Client.send(getCommand).catch(() => Promise.reject('State does not exist'));

            if (!result.Body) {
                Promise.reject('Body is empty');
            }

            const listingState: ListingState = JSON.parse(await this.readStreamToString(result.Body as Readable));
            return new ListingState(listingState.newHits, listingState.existingHits, listingState.closedHits);
        } catch (e) {
            console.log(`Error with state: ${e}. Creating new state...`);
            return new ListingState([], [], []);
        }
    }

    public async save(state: ListingState): Promise<IResult> {
        const putCommand = new PutObjectCommand({
            Bucket: LISTING_STATE_BUCKET,
            Key: STATE_KEY,
            ContentType: 'application/json',
            ContentLanguage: 'json',
            Body: JSON.stringify(state),
        });

        try {
            await this.s3Client.send(putCommand);
            return Result.ok(Origin.ListingState);
        } catch (e) {
            return Result.err(Origin.ListingState);
        }
    }

    private async readStreamToString(stream: Readable): Promise<string> {
        return new Promise((resolve, reject) => {
            const chunks: any[] = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('error', reject);
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        });
    }
}
