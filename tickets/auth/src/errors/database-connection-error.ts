import {CustomError, ErrorHandlerResponse} from "./custom-error";

export class DatabaseConnectionError extends CustomError {

    status = 500;
    reason = 'Error connecting to database'

    constructor() {
        super('Error connecting to database');
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeError(): ErrorHandlerResponse {
        return {errors: [{message: this.reason}]};
    }
}
