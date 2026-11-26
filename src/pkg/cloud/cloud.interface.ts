export interface ICloudProvider {
    // url - key - id
    uploadFile(file: Express.Multer.File, path: string): Promise<string>;

    deleteFile(key: string): Promise<void>;

    getFile(key: string): Promise<any>;

    generatePresignedUrl(file: Partial<Express.Multer.File>, path: string): Promise<string>;
}