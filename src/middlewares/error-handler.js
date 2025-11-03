import { HttpStatusCode } from "../utils/status-code.js"
import { ErrorCode } from "../utils/error-code.js"
import AppError from "../utils/custom-throw-error.js"

const errorHandler = async (error, req, res, next) => {
    if (error instanceof AppError) {
        console.error(`[AppError ${error.errorCode}] ${error.message}`)
        return res.status(error.statusCode).json({
            error: error.message,
            code: error.errorCode
        })
    }

    if (error.name === "JsonWebTokenError" && error.name === "TokenExpiredError") {
        console.error("JWT Error: ", error.message)
        res.status(HttpStatusCode.UNAUTHORIZED).json({
            error: "Invalid or expired token",
            code: ErrorCode.INVALID_CREDENTIALS
        })
    }
    
    console.error("Unexpected Server Error: ", error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 
        error: "An unexpected internal error occurred",
        code: ErrorCode.SERVER_ERROR
    })
}

export default errorHandler