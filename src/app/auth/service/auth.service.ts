import {IUser} from "../../user/interface/user.interface";
import userRepository from "../../user/repository/user.repository";
import {UserAlreadyExists, UserNotExist, UserNotVerified} from "../../user/error";
import {cacheProvider} from "../../../lib/cache/init";
import {ExpiredOtp, InvalidOtp, InvalidPassword} from "../error";
import {LoginDto, RegisterDto, VerifyAccountDto} from "../dto/auth.dto";
import {logger} from "../../../pkg/logger/logger";
import {
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    hashPassword,
    verifyGoogleToken,
    verifyRefreshToken
} from "../utils";
import {generateOTP} from "../../../lib/utils/otp";
import {toMs, toSeconds} from "../../../pkg/utils/time";
import {INotificationProvider} from "../../../pkg/notification/notification.interface";
import {mailjetProvider} from "../../../lib/notification/init";
import {AppError} from "../../../lib/error/error";
import {Provider} from "../../user/enum/user.enum";
import {IUserPayload} from "../../../lib/interface/userPayload.interface";

export class AuthService {
    private readonly userRepository = userRepository;
    private readonly mailProvider: INotificationProvider = mailjetProvider;

    async baseFunction(email: string, code: string, factory: (user: IUser) => Promise<void>) {
        // 1. check user existence
        const user = await this.userRepository.findByEmail(email);// {} | null
        // 1.1 handle user not found
        if (!user) throw UserNotExist;
        // 2. check otp:
        // const otp = await otpRepository.getOTPByEmail(email);
        const otp = await cacheProvider.get(`otp:${email}`);
        // 2.1 handle if email does not have any OTPs.
        if (!otp) throw ExpiredOtp;
        // 2.2 handle if incorrect code
        if (otp !== code) throw InvalidOtp;
        // 3. switch isVerified to true >> update user
        const result = await factory(user);
        // 4. delete otp from DB
        // await otpRepository.deleteOtp(email);
        await cacheProvider.del(`otp:${email}`);
        return result;
    }

    async register(registerDto: RegisterDto) {

        // x = 10;// throw new Error("Assignment to constant variables");
        // 1. check user existence
        const user = await this.userRepository.findByEmail(registerDto.email);// {} | null
        logger.debug('user exist', {user});
        if (user) throw UserAlreadyExists;

        // 2. prepare data [hash-password]
        registerDto.password = await hashPassword(registerDto.password);
        // 3. save user into DB.
        const createdUser = await this.userRepository.create(registerDto);
        // 4. generate otp and save it into DB
        const code = generateOTP();
        // await otpRepository.createOtp({
        //   code: code,
        //   email: userData.email,
        //   expiresAt: Date.now() + toMs(5, 'minutes'),
        // });
        await cacheProvider.set(`otp:${registerDto.email}`, code, toSeconds(3, 'minutes'));
        // 5. send otp in email
        await this.mailProvider.send(
            registerDto.email,
            'otp verification',
            `<h1>your otp to verify your account is ${code}</h1>`
        );
        // 6. return createdUser
        return createdUser;
    }


    async verifyAccount(verifyAccountDto: VerifyAccountDto) {
        await this.baseFunction(verifyAccountDto.email, verifyAccountDto.code, async () => {
            await this.userRepository.update({email: verifyAccountDto.email}, {isVerified: true});
        });
    }


    async sendOtp(email: string) {
        // 1. check user existence
        const user = await this.userRepository.findByEmail(email);// {} | null
        if (!user) throw UserNotExist;
        // 2. delete all old OTPs
        // await otpRepository.deleteOtp(email);
        // 3. generate otp and save it into DB
        const code = generateOTP();
        // await otpRepository.createOtp({
        //   code: code,
        //   email: user.email,
        //   expiresAt: Date.now() + toMs(5, 'minutes'),
        // });
        // user._id - user.id: null
        await cacheProvider.set(`otp:${email}`, code, toMs(3, 'minutes'));
        // 4. send otp into email
        await this.mailProvider.send(user.email, 'new OTP', `<h1>Your new OTP is ${code}</h1>`)
    }

    async login(loginDto: LoginDto) {
        let cachedTries = await cacheProvider.get(`login-tries:${loginDto.email}`);// "0"
        if (cachedTries === '0') throw new AppError('Too Many Requests To Login', 429);

        // 1. check user existence.
        const user = await this.userRepository.findByEmail(loginDto.email);// {} | null
        if (!user) throw UserNotExist;
        if (!user.isVerified) throw UserNotVerified;

        // 2. compare password.
        const match = await comparePassword(loginDto.password, user.password);
        if (!match) throw InvalidPassword;


        // 3. generate token.
        const jti = crypto.randomUUID()
        const accessToken = generateAccessToken({sub: user.id, name: user.userName});
        const refreshToken = generateRefreshToken({jti: jti, sub: user.id, name: user.userName});
        await cacheProvider.set(`refreshToken:${jti}`, jti, toSeconds(7, 'days'));

        // set into cache >> 4 tries
        let cachedTTL = await cacheProvider.ttl(`login-tries:${loginDto.email}`);
        cachedTries = cachedTries ?? '4';
        const ttl = cachedTTL == -2 ? toSeconds(3, 'minutes') : cachedTTL;
        await cacheProvider.set(`login-tries:${loginDto.email}`, String(+cachedTries - 1), ttl);// 03:00 >> 02:34

        return {
            accessToken,
            refreshToken
        }
    }


    async loginWithGoogle(idToken: string) {
        // 1. verify token come from Google
        const payload = await verifyGoogleToken(idToken);
        if (!payload) throw new AppError('Invalid token', 400);
        // 2. check user exists
        const user = await this.userRepository.findByEmail(payload.email as string);
        // 3. if exists >> generate token
        if (user) {
            return generateAccessToken({
                id: user._id,
                email: user.email
            });
        }
        // 4. if not exists >> create user >> generate token
        const createdUser = await this.userRepository.create({
            userName: payload.name,
            email: payload.email,
            provider: Provider.GOOGLE,
            isVerified: true,
        });// 30% >> update to fill remaining data
        return generateAccessToken({
            id: createdUser._id,
            email: createdUser.email
        });
    }

    /**
     *
     * @param {*} token -> refresh
     */
    async refreshTokenFn(token:string) {
        // 1. verify refresh token
        const payload = verifyRefreshToken(token) as IUserPayload;
        // 2. token used before
        const tokenId = await cacheProvider.get(`refreshToken:${payload.jti}`);
        if (!tokenId) throw new AppError('Used refresh token', 400);

        // 2. generate access token
        const jti = crypto.randomUUID();

        const accessToken = generateAccessToken({sub: payload.sub, name: payload.userName});
        // 3. generate refresh token
        const refreshToken = generateRefreshToken({jti: jti, sub: payload.sub, name: payload.userName});

        await cacheProvider.del(`refreshToken:${tokenId}`);
        await cacheProvider.set(`refreshToken:${jti}`, jti, toSeconds(7, 'days'));

        return {
            accessToken,
            refreshToken
        }
    }
}

// singleton
export default new AuthService();