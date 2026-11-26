import {MailjetProvider} from "../../pkg/notification/mailjet";
import {env} from "../config/env";
import {NodemailerProvider} from "../../pkg/notification/nodemailer";
import {FirebaseProvider} from "../../pkg/notification/firebase";
import fs from 'node:fs'
import path from "node:path";

export const mailjetProvider = new MailjetProvider({
    apiKey: env.mailjet.apiKey,
    apiSecret: env.mailjet.apiSecret,
    fromEmail: env.mailjet.fromEmail,
    fromName: env.mailjet.fromName,
});

export const nodemailerProvider = new NodemailerProvider({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    user: env.nodemailer.user,
    pass: env.nodemailer.password,
    fromEmail: env.nodemailer.user,
});
const firebaseConfigPath = path.resolve(
    __dirname,
    "../config/social-app-5-7a72c-firebase-adminsdk-fbsvc-e24504095a.json"
);

const firebaseConfig = JSON.parse(
    fs.readFileSync(firebaseConfigPath, "utf-8")
);
export const firebaseProvider = new FirebaseProvider(firebaseConfig);

// firebaseProvider.send('fcm', 'hello', 'world');