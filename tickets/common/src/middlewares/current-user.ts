import {NextFunction, Request, Response} from 'express';
import jwt from "jsonwebtoken";
import {ErrorHandlerResponse} from "..";

interface UserPayload {
    email: string,
    id: string
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload
        }
    }
}

export const currentUser = (req: Request, res: Response<ErrorHandlerResponse>, next: NextFunction) => {
    if (!req.session?.jwt) {
        return next();
    }

    try {
        req.currentUser = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
    } catch (err) {
    }

    return next();
};
