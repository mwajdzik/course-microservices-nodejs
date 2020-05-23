export interface ErrorHandlerResponse {
    errors: { message: string, field?: string }[]
}

export abstract class CustomError extends Error {
    abstract serializeError(): ErrorHandlerResponse;

    abstract status: number;

    protected constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
