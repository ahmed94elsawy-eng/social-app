import Mailjet from 'node-mailjet'
import { MailProvider } from './mail.interface.js';
interface IMailjetConfig {
  apiKey: string;
  apiSecret: string;
  fromEmail: string;
  fromName: string;
}
export class MailjetProvider implements MailjetProvider{
    private client: Mailjet;
    private readonly fromEmail: string;
    private readonly fromName: string;

    constructor(config: IMailjetConfig) {
        this.client = new Mailjet(
            {
                apiKey: config.apiKey,
                apiSecret: config.apiSecret 
            });
            this.fromEmail = config.fromEmail;
            this.fromName = config.fromName
    }

   async send(email: string, subject: string, html: string){


   await this.client.post('send', { version: 'v3.1' }).request({
  Messages: [
    {
      From: {
        Email: this.fromEmail, Name: this.fromName,
      },
      To: [
        {
          Email: email,
        },
      ],
      Subject: subject, HTMLPart: html },
  ],
})
    }

}