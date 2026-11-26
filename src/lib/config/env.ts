import {config} from "dotenv";
import {z} from 'zod';

config(); // load env file
const schema = z.object({
    PORT: z.string().default('3000'),

    MONGODB_URL: z.string(),

    JWT_SECRET: z.string(),
    SMTP_PASSWORD: z.string(),
    SMTP_USER: z.string().trim().toLowerCase(),

    GOOGLE_WEB_CLIENT_ID: z.string(),
    GOOGLE_IOS_CLIENT_ID: z.string(),
    GOOGLE_ANDROID_CLIENT_ID: z.string(),

    REDIS_PORT: z.string(),
    REDIS_PASSWORD: z.string(),
    REDIS_HOST: z.string(),

    MAILJET_API_KEY: z.string(),
    MAILJET_API_SECRET: z.string(),
    MAILJET_FROM_EMAIL: z.string(),
    MAILJET_FROM_NAME: z.string(),

    S3_BUCKET_NAME: z.string(),
    S3_SECRET_KEY: z.string(),
    S3_ACCESS_KEY: z.string(),
    S3_REGION: z.string(),
});

const parsed = schema.parse(process.env);

export const env = {
    port: Number(parsed.PORT),
    db: {
        url: parsed.MONGODB_URL,
    },
    redis: {
        host: parsed.REDIS_HOST,
        port: Number(parsed.REDIS_PORT),
        password: parsed.REDIS_PASSWORD,
    },
    jwt: {
        secret: parsed.JWT_SECRET,
    },
    google: {
        webClientId: parsed.GOOGLE_WEB_CLIENT_ID,
        iosClientId: parsed.GOOGLE_IOS_CLIENT_ID,
        androidClientId: parsed.GOOGLE_ANDROID_CLIENT_ID,
    },
    nodemailer: {
        user: parsed.SMTP_USER,
        password: parsed.SMTP_PASSWORD
    },
    pyments: {},

    s3: {
        secretKey: parsed.S3_SECRET_KEY,
        accessKey: parsed.S3_ACCESS_KEY,
        bucketName: parsed.S3_BUCKET_NAME,
        region: parsed.S3_REGION,
    },

    sharding: {},
    mailjet: {
        apiKey: parsed.MAILJET_API_KEY,
        apiSecret: parsed.MAILJET_API_SECRET,
        fromEmail: parsed.MAILJET_FROM_EMAIL,
        fromName: parsed.MAILJET_FROM_NAME,
    }
}