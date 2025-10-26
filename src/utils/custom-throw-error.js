export default class AppError extends Error {
    constructor(message, statusCode, errorCode, detail=null) {
        super(message)
        Object.setPrototypeOf(this, AppError.prototype)

        this.name = 'App Error'
        this.statusCode = statusCode
        this.errorCode = errorCode
        this.detail = detail

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}