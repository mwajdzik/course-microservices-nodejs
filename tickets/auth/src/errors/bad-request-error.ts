import {CustomError, ErrorHandlerResponse} from "./custom-error";

export class BadRequestError extends CustomError {

    status = 400;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeError(): ErrorHandlerResponse {
        return {errors: [{message: this.message}]};
    }
}
