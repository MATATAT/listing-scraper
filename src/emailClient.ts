import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { ListingState } from './listingState';
import { IResult, Origin, Result } from './result';
import ejs from 'ejs';
import fs from 'fs';

const TEMPLATE_PATH = './template.ejs';
const SUBJECT_TEMPLATE = 'Listing changes for ';

export class EmailClient {
    private sesClient: SESClient;

    constructor() {
        this.sesClient = new SESClient({});
    }

    public async sendNewHits(listingState: ListingState): Promise<IResult> {
        const sendEmailCommand = new SendEmailCommand({
            Source: 'mail@mattmacdonald.link',
            Destination: {
                ToAddresses: ['kholdstare99@gmail.com'],
            },
            Message: {
                Subject: {
                    Data: `${SUBJECT_TEMPLATE} ${new Date().toDateString()}`,
                },
                Body: {
                    Html: {
                        Data: this.formatEmail(TEMPLATE_PATH, listingState),
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

    private getTemplate = (templatePath: string): string => fs.readFileSync(templatePath).toString();

    public formatEmail(templatePath: string, listingState: ListingState): string {
        const templateSource = this.getTemplate(templatePath);
        return ejs.render(templateSource, listingState);
    }
}
