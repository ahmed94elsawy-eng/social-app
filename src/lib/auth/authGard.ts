import {AppError} from "../error/error";
import jwt from "jsonwebtoken";
import {env} from "../config/env";
import { NextFunction, Request, Response  } from "express";


interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
export function authGuard(req: Request, res: Response, next: NextFunction) {
    try {
        // logic of check token
        const token = req.cookies.access_token;// "access_toke=ekshfjfbgihbzsdg;hamada=hambozo;ka3bora=rabe3;"
        if (!token) throw new AppError('no token provided', 403);
        req.user = jwt.verify(token, env.jwt.accessSecret) as JwtPayload;
        // req.user = payload;
        next();
    } catch (error) {
        next(error);
    }
}