import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { ListingState } from './listingState';

const LISTING_STATE_BUCKET = 'ListingStateBucket';
const STATE_KEY = 'State';

export class ListingStateClient {
    private s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({});
    }

    public async load(): Promise<ListingState> {
        const getCommand = new GetObjectCommand({
            Bucket: LISTING_STATE_BUCKET,
            Key: STATE_KEY,
        });

        try {
            const result = await this.s3Client.send(getCommand);

            console.log(result.Body);

            return new ListingState([], [], []);
        } catch (e) {
            return new ListingState([], [], []);
        }
    }

    public async save(state: ListingState): Promise<void> {
        const putCommand = new PutObjectCommand({
            Bucket: LISTING_STATE_BUCKET,
            Key: STATE_KEY,
            ContentLanguage: 'json',
            Body: JSON.stringify(state),
        });

        await this.s3Client.send(putCommand);
    }
}
