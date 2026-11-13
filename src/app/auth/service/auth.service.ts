import { LoginDto, RegisterDto, SendOtpDto, VerifyAccountDto } from "../dto";

export class AuthService{
    constructor() {
    }

    async login(LoginDto: LoginDto) {
    }

    async register(registerDto: RegisterDto) {
    }

    async sendOtp(sendOtpDto: SendOtpDto) {
    }

    async verifyAccount(verifyAccountDto: VerifyAccountDto) {
    }

    async forgetPassword() {
    }
}

//singleton
export default new AuthService();