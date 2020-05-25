import {NextFunction, Request, Response} from 'express';
import {ErrorHandlerResponse} from "../errors/custom-error";
import {validationResult} from "express-validator";
import {RequestValidationError} from "../errors/request-validation-error";

export const validateRequest = (req: Request, res: Response<ErrorHandlerResponse>, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    next();
};
