import {AppError} from "../../lib/error/error";

export const UserNotExist = new AppError('user not exists', 404);// 404
export const UserAlreadyVerified = new AppError('user already verified', 400);// 400
export const UserAlreadyExists = new AppError('User already exists', 409);// 409
export const UserNotVerified = new AppError('user not verified', 403);// 403

