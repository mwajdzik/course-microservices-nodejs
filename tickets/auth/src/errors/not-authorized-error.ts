import {CustomError, ErrorHandlerResponse} from "./custom-error";

export class NotAuthorizedError extends CustomError {

    status = 401;

    constructor() {
        super('Not authorized');
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeError(): ErrorHandlerResponse {
        return {errors: [{message: 'Not authorized'}]};
    }
}
