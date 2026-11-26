import {Router} from "express";
import userController from "./controller/user.controller";
import {multerUploadSingle} from "../../pkg/media/multer";

export const userRouter = Router();

userRouter.post('/upload-profile-pic', multerUploadSingle('pp'), userController.uploadProfilePic);
userRouter.post('/get-presigned-url', userController.generatePresignedUrl);