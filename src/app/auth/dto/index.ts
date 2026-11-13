import { Gender } from "../enum/enum";

// contracts
export interface RegisterDto {
    userName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    gender?: Gender;
}

export interface LoginDto {
    email: string;
    pass: string;
}

export interface SendOtpDto {
    email: string;
}

export interface VerifyAccountDto {
    email: string;
    code: string;
}

