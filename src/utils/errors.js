export class AppError extends Error {
    constructor(message, statusCode, options = {}) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = true;
        this.countAsLoginAttempt =
            options.countAsLoginAttempt ?? false;
    }
}