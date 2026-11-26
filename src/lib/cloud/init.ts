import {S3CloudProvider} from "../../pkg/cloud/s3.cloud";
import {env} from "../config/env";

export const s3CloudProvider = new S3CloudProvider({
    region: env.s3.region,
    accessKey: env.s3.accessKey,
    secretKey: env.s3.secretKey,
    bucketName: env.s3.bucketName
})