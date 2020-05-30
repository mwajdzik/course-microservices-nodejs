import {NextFunction, Request, Response} from 'express';
import {ErrorHandlerResponse, NotAuthorizedError} from "..";

export const requireAuth = (req: Request, res: Response<ErrorHandlerResponse>, next: NextFunction) => {
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    }

    return next();
};
