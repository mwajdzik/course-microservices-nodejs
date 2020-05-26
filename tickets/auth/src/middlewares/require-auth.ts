import {NextFunction, Request, Response} from 'express';
import {ErrorHandlerResponse} from "../errors/custom-error";
import {NotAuthorizedError} from "../errors/not-authorized-error";

export const requireAuth = (req: Request, res: Response<ErrorHandlerResponse>, next: NextFunction) => {
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    }

    return next();
};
