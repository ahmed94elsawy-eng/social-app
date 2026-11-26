import {logger} from "../../pkg/logger/logger";
import {AppError} from "./error";
import {NextFunction, Request, Response} from "express";

export function globalErrorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {

    logger.error(err.message, {
        stack: err.stack,
        correlationId: req.correlationId,
    });

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            message: err.message, success: false
        })
    }

    return res.status(500).json({
        error: 'Something went wrong', success: false,
    })
}