import {createTransport, Transport} from 'nodemailer'
import { MailProvider } from './mail.interface.js';

interface INodemailerConfig {
 host: string,
 port: number,
 user: string,
 pass: string,
 fromEmail: string,
 fromName: string
}
export class NodemailerProvider implements MailProvider {
    private client: any;
    private readonly fromEmail: string;

    constructor(config: any) {
        this.client = createTransport({
            host: config.host,
            port: config.port,
            secure: false,
            auth: {
            user: config.user,
            pass: config.pass,
            }
        });
         this.fromEmail = config.fromEmail;
    };
   async send(email: string, subject: string, html: string){

     await this.client.sendMail({
        from: this.fromEmail,
        to: email,
        subject: subject,
        html: html
    });
}
}