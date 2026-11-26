// reopen
import {IUserPayload} from "./userPayload.interface";

declare module 'express-serve-static-core' {


    interface Request {
        user?: IUserPayload;
        correlationId?: string;
    }
}