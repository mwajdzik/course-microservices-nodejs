import {ValidationError} from "express-validator";
import {CustomError, ErrorHandlerResponse} from "./custom-error";

export class RequestValidationError extends CustomError {

    status = 400;

    constructor(public errors: ValidationError[]) {
        super('Invalid parameters');
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeError(): ErrorHandlerResponse {
        const errors = this.errors.map(e => {
            return {message: e.msg, field: e.param}
        })

        return {errors};
    }
}
