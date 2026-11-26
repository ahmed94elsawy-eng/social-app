import express from 'express';
import { router } from "./route";
import './lib/db/connection';
import { globalErrorHandler } from "./lib/error/error.handler";
import { correlationId } from "./lib/correlation/correlationid";
import cookieParser from "cookie-parser";

export function createApp() {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

    app.use(correlationId);
    app.use('/api', router);
    app.use(globalErrorHandler);
    return app;
}