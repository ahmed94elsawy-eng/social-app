import Mailjet from "node-mailjet";
import {INotificationProvider} from "./notification.interface";

interface MailjetConfig {
    apiKey: string;
    apiSecret: string;
    fromEmail: string;
    fromName: string;
}

export class MailjetProvider implements INotificationProvider{
    public client: Mailjet;
    public fromEmail: string;
    public fromName: string;

    constructor(config: MailjetConfig) {
        this.client = new Mailjet({
            apiSecret: config.apiSecret, apiKey: config.apiKey,
        });// object
        this.fromEmail = config.fromEmail;
        this.fromName = config.fromName;
    }

    async send(to: string, title: string, body: string) {
        await this.client.post('send', {version: 'v3.1'}).request({
            Messages: [{
                From: {
                    Email: this.fromEmail,// ahmedshoura279@gmail.com
                    Name: this.fromName// NGL-app-5
                }, To: [{
                    Email: to,
                },], Subject: title, HTMLPart: body
            },],
        })
    }
}