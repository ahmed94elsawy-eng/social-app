    import {Gender} from "../../user/enum/user.enum.js";

    export interface RegisterDto {
        userName: string;
        email: string;
        password: string;
        phoneNumber?: string;
        gender: Gender;
    }

    export interface LoginDto {
        email: string;
        password: string;
    }

    export interface SendOtpDto {
        email: string;
    }

    export interface VerifyAccountDto {
        email: string;
        code: string;
    }