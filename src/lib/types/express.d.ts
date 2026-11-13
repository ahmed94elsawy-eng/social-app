declare module 'express-server-static-core' {
    interface Request{
        user?: {
            sub: string;
            email: string;
            role: string;
        }
    }
}