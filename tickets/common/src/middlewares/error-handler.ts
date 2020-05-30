import {NextFunction, Request, Response} from 'express';
import {CustomError, ErrorHandlerResponse} from "..";

export const errorHandler = (err: Error, req: Request, res: Response<ErrorHandlerResponse>, next: NextFunction) => {
    if (err instanceof CustomError) {
        return res.status(err.status).send(err.serializeError());
    }

    return res.status(400).send({errors: [{message: err.message}]});
};
