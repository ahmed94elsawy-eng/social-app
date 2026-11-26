import argon2 from 'argon2';
import jwt from "jsonwebtoken";
import {toMs} from "../../pkg/utils/time";
import {OAuth2Client} from "google-auth-library";
import {AppError} from "../../lib/error/error";
import {env} from "../../lib/config/env";
import {IUserPayload} from "../../lib/interface/userPayload.interface";
import {Response} from "express";

export async function hashPassword(password: string) {
    return argon2.hash(password);
}


export async function comparePassword(password: string, hashedPassword: string) {
    return argon2.verify(hashedPassword, password);
}

export function generateAccessToken(payload: IUserPayload) {
    return jwt.sign(payload, env.jwt.secret, { expiresIn: toMs(1, 'hours') });
}

export function generateRefreshToken(payload: IUserPayload) {
    return jwt.sign(payload, 'fegrtnjogbfijkfbgorbtfdijbggidfsh', {expiresIn: toMs(7, 'days')});
}

// at the start of Application
// todo: Single Tone Design Pattern into
const client = new OAuth2Client();

export async function verifyGoogleToken(idToken: string) {
    try {

        const ticket = await client.verifyIdToken({
            idToken: idToken,// noon - facebook - amazon - Instagram - ngl-app-5
            audience: [env.google.webClientId]// ngl-app-5
        });
        return ticket.getPayload();// {id,name,email,pp}
    } catch (err) {
        throw new AppError('invalid google Token', 403);
    }
}


export function verifyRefreshToken(token: string) {
    return jwt.verify(token, 'fegrtnjogbfijkfbgorbtfdijbggidfsh');
}

export function setCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        maxAge: toMs(1, 'hours'),
        path: "/"
    });
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: toMs(7, 'days'),
        path: '/api/auth/refresh-token'
    });
}