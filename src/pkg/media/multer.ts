import multer, {diskStorage} from "multer";

export function multerUpload() {
    return multer({
        storage: diskStorage({}),// OS >> TEMP folder
    });
}

export function multerUploadSingle(fieldName: string) {
    return multerUpload().single(fieldName);
}

export function multerUploadArray(fieldName: string, maxCount: number = 1) {
    return multerUpload().array(fieldName, maxCount);
}
