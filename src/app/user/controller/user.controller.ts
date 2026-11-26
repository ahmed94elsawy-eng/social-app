import {NextFunction, Request, Response} from "express";
import userService from "../service/user.service";

class UserController {
    private userService = userService;
    uploadProfilePic = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = req.file as Express.Multer.File;
            console.log({file});
            await this.userService.uploadProfilePicture(file, '6aececbbf7faeef1ccdcb866');
            res.json({message: 'file uploaded successfully', success: true});
        } catch (error) {
            next(error);
        }
    }

    generatePresignedUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {fileName, fileType} = req.body;
            const url = await this.userService.generatePresignedUrl({
                originalname: fileName,
                mimetype: fileType,
            }, '6aececbbf7faeef1ccdcb866');
            res.json({message: "OK", success: true, data: url});
        } catch (error) {
            next(error);
        }
    }

    // deleteProfilePic = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         await this.userService.deleteProfilePicture('6aecc8b638bf98b0a07be06f');
    //         res.json({message: "profile picture deleted", success: true});
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}

// singleton
export default new UserController();