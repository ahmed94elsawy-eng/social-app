import { NextFunction, Request, Response } from "express";
import authService, { AuthService } from "../service/auth.service";
import { setCookies } from "../utils";

class AuthController {
    private authService: AuthService = authService;

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.register(req.body);
            res.status(201).json({ message: 'User created successfully', success: true, data: user });
        } catch (error) {
            next(error);
        }
    };

    verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.verifyAccount(req.body);
            res.status(200).json({ message: 'Account verified successfully', success: true });
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tokens = await this.authService.login(req.body);
            setCookies(res, tokens.accessToken, tokens.refreshToken);
            res.status(200).json({ message: 'Logged in successfully', success: true, data: tokens });
        } catch (error) {
            next(error);
        }
    };
}

export default new AuthController();