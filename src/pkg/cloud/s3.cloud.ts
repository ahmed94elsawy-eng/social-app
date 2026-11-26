import {ICloudProvider} from "./cloud.interface";
import {DeleteObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {toSeconds} from "../utils/time";

interface S3Config {
    accessKey: string;
    secretKey: string;
    region: string;
    bucketName: string
}

export class S3CloudProvider implements ICloudProvider {

    // encapsulation
    private readonly client: S3Client;
    private readonly bucketName: string;

    constructor(config: S3Config) {
        this.client = new S3Client({
            region: config.region,
            credentials: {
                accessKeyId: config.accessKey,
                secretAccessKey: config.secretKey
            }
        })
        this.bucketName = config.bucketName
    }

    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key
        });
        await this.client.send(command);
    }

    getFile(key: string): Promise<any> {
        return Promise.resolve(undefined);
    }

    // path = '/users/123456789'
    // path = '/posts/123456789/'
    // path = '/comments/123456789/2026-11-12T09:30:00-one.png'
    async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Body: file.buffer,
            ContentType: file.mimetype,
            Key: `${path}/${new Date().toISOString()}-${file.originalname}`
        });
        await this.client.send(command);
        return command.input.Key as string;
    }

    async generatePresignedUrl(file: Partial<Express.Multer.File>, path: string) {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: `${path}/${file.originalname}`,
            ContentType: file.mimetype
        });
        return await getSignedUrl(this.client, command, {expiresIn: toSeconds(5, 'minutes')});
    }

}