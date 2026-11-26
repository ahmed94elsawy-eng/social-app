import {INotificationProvider} from "./notification.interface";
import {App, cert, initializeApp} from "firebase-admin/app";
import {getMessaging, Message} from "firebase-admin/messaging";

export class FirebaseProvider implements INotificationProvider {

    private readonly client: App;

    constructor(config: any) {
        this.client = initializeApp({
            credential: cert(config)
        });
    }

    // to >> FCM TOKEN
    async send(to: string, title: string, body: string): Promise<void> {
        let message: Message = {
            token: to,
            notification: {
                title: title,
                body: body
            }
        }
        await getMessaging(this.client).send(message);
    }
}