import {createTransport, Transporter} from "nodemailer";
import {INotificationProvider} from "./notification.interface";


interface NodemailerConfig {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    fromEmail: string;
}

export class NodemailerProvider implements INotificationProvider {
    public client: Transporter;
    public fromEmail: string;

    constructor(config: NodemailerConfig) {
        this.client = createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.user,
                pass: config.pass
            }
        });
        this.fromEmail = config.fromEmail;
    }

    async send(to: string, title: string, body: string) {
        await this.client.sendMail({
            from: this.fromEmail,
            to: to,
            subject: title,
            html: body
        })
    }
}