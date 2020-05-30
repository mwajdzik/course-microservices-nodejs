import {CustomError, ErrorHandlerResponse} from "./custom-error";

export class NotFoundError extends CustomError {

    status = 404;
    reason = 'Not found'

    constructor() {
        super('Route not found');
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeError(): ErrorHandlerResponse {
        return {errors: [{message: this.reason}]};
    }
}
