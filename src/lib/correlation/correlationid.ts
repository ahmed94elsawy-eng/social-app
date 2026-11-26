import crypto from 'node:crypto';
import {NextFunction, Request, Response} from "express";

// function middleware
export function correlationId(req: Request, res: Response, next: NextFunction) {
    const id = crypto.randomUUID();
    req.correlationId = id;// inject into req
    res.setHeader('X-Correlation-Id', id);
    next();
}