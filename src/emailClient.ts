import { Hits } from './hits';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { IResult, Origin, Result } from './result';
import ejs from 'ejs';
import fs from 'fs';

const TEMPLATE_PATH = './template.ejs';
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
                ToAddresses: ['kholdstare99@gmail.com'],
            },
            Message: {
                Subject: {
                    Data: `${SUBJECT_TEMPLATE} ${new Date().toDateString()}`,
                },
                Body: {
                    Html: {
                        Data: this.formatEmail(TEMPLATE_PATH, newHits)
                    }
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

    public formatEmail(templatePath: string, newHits: Hits): string {
        const templateSource = this.getTemplate(templatePath);
        return ejs.render(templateSource, { hits: newHits });
    }
}
