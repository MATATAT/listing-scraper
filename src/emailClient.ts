import { Hits } from './hits';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { IResult, Origin, Result } from './result';

const SUBJECT_TEMPLATE = 'New listings for ';

export class EmailClient {
    private sesClient: SESClient;

    constructor() {
        this.sesClient = new SESClient({});
    }

    public async sendNewHits(newHits: Hits): Promise<IResult> {
        const sendEmailCommand = new SendEmailCommand({
            Source: 'mail@mattmacdonald.link',
            Destination: {
                ToAddresses: [
                    'kholdstare99@gmail.com'
                ]
            },
            Message: {
                Subject: {
                    Data: `${SUBJECT_TEMPLATE} ${new Date().toDateString()}`,
                },
                Body: {
                    Text: {
                        Data: JSON.stringify(newHits), // TODO: change this but for now fine
                    },
                },
            },
        });

        try {
            await this.sesClient.send(sendEmailCommand);
            return Result.ok(Origin.Email);
        } catch (e) {
            console.error(e);
            return Result.err(Origin.Email);
        }
    }
}
