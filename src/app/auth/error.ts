import {AppError} from "../../lib/error/error";

export const ExpiredOtp = new AppError('expired otp', 404);
export const InvalidOtp = new AppError('invalid otp', 400)
export const InvalidPassword = new AppError('invalid password', 403);