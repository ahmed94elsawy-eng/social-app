import  jwt  from "jsonwebtoken";
import { cacheProvider } from "../../../lib/cache/init";
import { mailjetProvider } from "../../../lib/email/init";
import { AppError } from "../../../lib/error/error";
import { verifyGoogleToken } from "../../../lib/utils/google-auth";
import { generateOTPCode } from "../../../lib/utils/otp";
import { MailProvider } from "../../../pkg/email/mail.interface";
import { toSeconds } from "../../../pkg/utils/time";
import { userAlreadyExist, userAlreadyVerified, userNotExist, userNotVerified } from "../../user/error";
import userRepository, { UserRepository } from "../../user/repository/user.repository";
import { LoginDto, RegisterDto, SendOtpDto, VerifyAccountDto } from "../dto";
import { Provider } from "../enum/enum";
import { invalidPassword, otpExpired } from "../error";
import { comparePassword, generateAccessToken, generateRefreshToken, hashPassword } from "../utils";
import { env } from "../../../lib/config/env";
import { TUserPayload } from "../../../lib/interface/userPayload.interface.js";

export class AuthService{
  private twoStepVerificationKey = '2-step-verification:'
   private sendOtpKey = 'otp:';  
   private readonly userRepository: UserRepository = userRepository;
   private readonly mailProvider: MailProvider


   constructor() {
    this.mailProvider = mailjetProvider
    }

   

  register = async(registerDto: RegisterDto) =>{
  // const x = 10;
  // x = 12;//  throw Error('Assignment to constant variable');
  // 1. check user existence
  const userExist = await this.userRepository.findByEmail(registerDto.email);
  // 2. if yes, throw an error.
  if (userExist) throw userAlreadyExist;
  // 3. prepare data [hash-password]
  registerDto.password = await hashPassword(registerDto.password);
  // 4. save user into DB -> isVerified: false
  const createdUser = await this.userRepository.create(registerDto);// role: doctor
  // 5.generate and save otp into DB
  const code = generateOTPCode();

  // logger.info(code);
  // await otpRepository.createOTP({
  //   code: code,
  //   email: userData.email,
  //   expiresAt: new Date(Date.now() + toMs(5, 'minutes')),
  // });
  await cacheProvider.set(`${this.sendOtpKey}${createdUser._id.toString()}`, code, toSeconds(3, 'minutes'));
  // 6. send email verification OTP
  await this.mailProvider.send(registerDto.email, 'verification code', `<h1>Your verification code is ${code} </h1>`);
  return createdUser;
}

 verifyAccount = async(verifyAccountDto: VerifyAccountDto) =>{
  // 1. check user existence
  const user = await this.userRepository.findByEmail(verifyAccountDto.email);// {} | null
  // 1.1 if you don't exist >> error "User not exist."
  if (!user) throw userNotExist;
  // 1.2 if isVerified = true >> error "You already verified"
  if (user.isVerified === true) throw userAlreadyVerified;
  // 2. check otp validation
  // const otp = await otpRepository.getOtpByEmail(email);// {code,email} | null
  const cacheCode = await cacheProvider.get(`${this.sendOtpKey}${user._id.toString()}`);
  // 2.1 not exist into DB >> error >> "otp expired" >> resend otp
  if (!cacheCode) throw otpExpired;
  // 2.2 otp stored into DB >> code not equal code stored >> error >> 'Invalid otp'
  if (cacheCode !== verifyAccountDto.code) throw invalidCode;
  // 3. Switch your isVerified to true [update user]
  const updatedUser = await userRepository.update({email: verifyAccountDto.email}, { isVerified: true });
  // 4. delete otp from DB
  // await otpRepository.deleteOTPsByEmail(email);
  await cacheProvider.del(`${this.sendOtpKey}${user._id.toString()}`);

  return updatedUser;
}

// to enable 2 step verification
//  async  enable2StepVerification(email) {
//   const code = generateOTPCode();
//   await cacheProvider.set(`${twoStepVerificationKey}${email}`, code, toSeconds(3, 'minutes'));
//   await mailjetProvider.sendMail(email, '2 step verification code', `your 2 step verification code is ${code}`);
// }


//  async  verifyCodeActiveTwoStepVerification(email, code) {
//   // 1. check user existence
//   const user = await authRepository.checkUserExistByEmail(email);// {} | null
//   // 1.1 if you don't exist >> error "User not exist."
//   if (!user) throw userNotExist;
//   console.log(`${twoStepVerificationKey}${email}`);

//   // 2. check otp validation
//   // const otp = await otpRepository.getOtpByEmail(email);// {code,email} | null
//   const cacheCode = await cacheProvider.get(`${twoStepVerificationKey}${email}`);
//   console.log(cacheCode);

//   // 2.1 not exist into DB >> error >> "otp expired" >> resend otp
//   if (!cacheCode) throw otpExpired;
//   // 2.2 otp stored into DB >> code not equal code stored >> error >> 'Invalid otp'
//   if (cacheCode !== code) throw invalidCode;

//   // 3. generate access Token
//   await userRepository.updateUserByEmail(email, { twoStepVerification: true });
//   // 4. delete otp from DB
//   // await otpRepository.deleteOTPsByEmail(email);
//   await cacheProvider.del(`${twoStepVerificationKey}${email}`);

// }


 login = async(loginDto: LoginDto) => {
  // check into cache
  const cachedAttempt = await cacheProvider.get(`${loginDto.email}:login`);
  if (cachedAttempt === '0') throw new AppError('you reach max tries', 429);
  // 1. check user existence
  const user = await userRepository.findByEmail(loginDto.email);// {} | null

  // 1.1 not exist
  if (!user) throw userNotExist;
  // 1.2 not verified
  if (user['isVerified'] === false) throw userNotVerified;
  // 2. compare password
  const match = await comparePassword(loginDto.password, user['password']);
  if (!match) throw invalidPassword;

  // 3. generate access Token
  const accessToken = generateAccessToken({ id: user._id, name: user.userName });
  const refreshToken = generateRefreshToken({ id: user._id, name: user.userName });

  const ttlRemaining = await cacheProvider.ttl(`${loginDto.email}:login`);
  const attempts = cachedAttempt ?? 5;
  const ttl = ttlRemaining === -2 ? toSeconds(3, 'minutes') : ttlRemaining;
  await cacheProvider.set(`${loginDto.email}:login`, String(+attempts - 1), ttl);

  return {
    accessToken, refreshToken
  }
}

//  async  verifyCodeTwoStepVerification(email, code) {
//   // 1. check user existence
//   const user = await authRepository.checkUserExistByEmail(email);// {} | null
//   // 1.1 if you don't exist >> error "User not exist."
//   if (!user) throw userNotExist;
//   // 2. check otp validation
//   // const otp = await otpRepository.getOtpByEmail(email);// {code,email} | null

//   const cacheCode = await cacheProvider.get(`${twoStepVerificationKey}${email}`);

//   // 2.1 not exist into DB >> error >> "otp expired" >> resend otp
//   if (!cacheCode) throw otpExpired;
//   // 2.2 otp stored into DB >> code not equal code stored >> error >> 'Invalid otp'
//   if (cacheCode !== code) throw invalidCode;

//   // 3. generate access Token
//   const accessToken = generateAccessToken({ id: user._id, name: user.name });
//   const refreshToken = generateRefreshToken({ id: user._id, name: user.name });
//   // 4. delete otp from DB
//   // await otpRepository.deleteOTPsByEmail(email);
//   await cacheProvider.del(`${twoStepVerificationKey}${email}`);

//   return { accessToken, refreshToken };
// }

 sendOtp = async(sendOtpDto: SendOtpDto) =>{
  // 1. check user existence
  const user = await this.userRepository.findByEmail(sendOtpDto.email);// {} | null
  if (!user) throw userNotExist;
  // 2. delete all old OTPs
  // await otpRepository.deleteOTPsByEmail(email);
  // 3. generate OTP and save it into DB
  const code = generateOTPCode();
  // await otpRepository.createOTP({
  //   code: code,
  //   email: email,
  //   expiresAt: Date.now() + toMs(3, 'minutes')
  // });
  await cacheProvider.set(`${this.sendOtpKey}${user._id.toString()}`, code, toSeconds(3, 'minutes'));
  // 4. send otp email
  await this.mailProvider.send(sendOtpDto.email, 'new otp', `<p>your new otp is ${code}</p>`);
}

//  async  resetPassword(email, code, newPassword) {
//   // get user data.
//   const user = await authRepository.checkUserExistByEmail(email);
//   // 1. verify otp code
//   // const otp = await otpRepository.getOtpByEmail(email);// {} | null
//   const otp = await cacheProvider.get(`${sendOtpKey}${user._id.toString()}`);
//   if (!otp) throw otpExpired;
//   if (otp.code !== code) throw invalidCode;
//   // 2. hashPassword
//   const hashedPassword = await hashPassword(newPassword);
//   // 3. update user password
//   await userRepository.updateUserByEmail(email, { password: hashedPassword });
//   // 4. delete otp
//   // await otpRepository.deleteOTPsByEmail(email);
//   await cacheProvider.del(`${sendOtpKey}${user._id.toString()}`)
// }

 loginWithCGoogle = async(idToken: string)=> {
  // 1. verify idToken >> eofnasijdbgnuvseijdfbcgvhsiejfdbjebsfduhcgijbsehfijdcbgiseodbc
  const payload = await verifyGoogleToken(idToken);
  if (!payload) throw new AppError('no payload provided' , 400)
  // 2. check user exists
  const user = await this.userRepository.findByEmail(payload.email as string);
  // 3. if exists >> generate token
  if (user) {
    return generateAccessToken({
      id: user._id,
      email: user.email,
    });
  }
  // 4. if not exist create user >> generate Token
  const createdUser = await this.userRepository.create({
    // _id: payload.id,
    userName: payload.name,
    email: payload.email,
    provider: Provider.GOOGLE,
    isVerified: true,
  });// 30%
  return generateAccessToken({
    id: createdUser._id,
    email: createdUser.email,
  });
}

/**
 * 
 * @param {*} token   -> refreshToken
 * @returns 
 */
   refreshTokenFn = async (token: string) =>{
  // validate refresh-token 
  const payload = jwt.verify(token, env.jwt.refreshSecret) as TUserPayload;// throw error
  // generate access-token 
  const accessToken = generateAccessToken({ sub: payload.sub, userName: payload.userName });
  // genreate refresh token
  const refreshToken = generateRefreshToken({ sub: payload.sub, name: payload.userName });
  return {
    accessToken, refreshToken
  }
}

}

//singleton
export default new AuthService();