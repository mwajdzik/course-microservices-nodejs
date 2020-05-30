import {NextFunction, Request, Response} from 'express';
import {ErrorHandlerResponse, RequestValidationError} from "..";
import {validationResult} from "express-validator";

export const validateRequest = (req: Request, res: Response<ErrorHandlerResponse>, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    next();
};
