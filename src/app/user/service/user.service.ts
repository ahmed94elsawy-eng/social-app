import {ICloudProvider} from "../../../pkg/cloud/cloud.interface";
import {s3CloudProvider} from "../../../lib/cloud/init";
import userRepository from "../repository/user.repository";
import {IUser} from "../interface/user.interface";
import * as fs from "node:fs";
import {AppError} from "../../../lib/error/error";


class UserService {
    private readonly cloudProvider: ICloudProvider = s3CloudProvider;
    private readonly userRepository = userRepository;
    uploadProfilePicture = async (file: Express.Multer.File, userId: string) => {
        file.buffer = fs.readFileSync(file.path);
        // upload to cloud
        const key = await this.cloudProvider.uploadFile(file, `users/${userId}`);
        // get user data from DB
        const user = await this.userRepository.getOne({_id: userId}) as IUser;
        // delete old profile picture
        if (user.profilePicturePath) {
            await this.cloudProvider.deleteFile(user.profilePicturePath);
        }
        // update new user profile picture into DB
        await this.userRepository.update({_id: userId}, {profilePicturePath: key});
    }
    generatePresignedUrl = async (file: Partial<Express.Multer.File>, userId: string) => {
        return await this.cloudProvider.generatePresignedUrl(file, `users/${userId}`);
    }

    // deleteProfilePicture = async (userId: string) => {
    //     const user = await userRepository.getOne({_id: userId});
    //     if (!user?.profilePicturePath) {
    //         throw new AppError('Profile Pic not found', 404);
    //     }
    //     await this.cloudProvider.deleteFile(user?.profilePicturePath);
    //     await this.userRepository.update({_id: userId}, {$unset: {profilePicturePath: ''}});
    // }
}

// singleton
export default new UserService();