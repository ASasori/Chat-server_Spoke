import { HttpStatusCode } from "../../utils/status-code.js"
import { ErrorCode } from "../../utils/error-code.js"
import AppError from "../../utils/custom-throw-error.js"
import UserLogic from "./user.business-logic.js"

class UserController {
    login = async (req, res) => {
        try {
            const {email, password} = req.body
            const {user, token} = await UserLogic.login(email, password)
            
            res.status(HttpStatusCode.OK).json({user, token})
        } catch (error) {
            if (error instanceof AppError) {
                console.error(`[AppError ${error.errorCode}] ${error.message}`)
                return res.status(error.statusCode).json({
                    error: error.message,
                    code: error.errorCode
                })
            }
            
            console.error("Unexpected Server Error: ", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 
                error: "An unexpected internal error occurred",
                code: ErrorCode.SERVER_ERROR
            })
        }
    }

    signUp = async (req, res) => {
        try {
            const {email, password, username} = req.body
            const {user, token} = await UserLogic.signUp(email, password, username)

            res.status(HttpStatusCode.CREATED).json({user, token})
        } catch (error) {
            if (error instanceof AppError) {
                console.error(`[AppError ${error.errorCode}] ${error.message}`)
                return res.status(error.statusCode).json({
                    error: error.message,
                    code: error.errorCode
                })
            }
            
            console.error("Unexpected Server Error: ", error)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 
                error: "An unexpected internal error occurred",
                code: ErrorCode.SERVER_ERROR
            })
        }
    }

    changePass = async (req, res) => {
        try {
            const {oldPassword, newPassword} = req.body
            const _id = req.user._id
            await UserLogic.changePass(_id, oldPassword, newPassword)
            res.status(HttpStatusCode.OK).json({message: "Password changed successfully"})
        } catch (error) {
            if (error instanceof AppError) {
                console.error(`[AppError ${error.errorCode}] ${error.message}`)
                return res.status(error.statusCode).json({
                    error: error.message,
                    code: error.errorCode
                })
            }
            
            console.error("Unexpected Server Error: ", error)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 
                error: "An unexpected internal error occurred",
                code: ErrorCode.SERVER_ERROR
            })
        }
    }

    getProfile = async (req, res) => {
        try {
            const _id = req.user._id
            const user = await UserLogic.getProfile(_id)
            res.status(HttpStatusCode.OK).json({user})
        } catch (error) {
            if (error instanceof AppError) {
                console.error(`[AppError ${error.errorCode}] ${error.message}`)
                return res.status(error.statusCode).json({
                    error: error.message,
                    code: error.errorCode
                })
            }
            
            console.error("Unexpected Server Error: ", error)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 
                error: "An unexpected internal error occurred",
                code: ErrorCode.SERVER_ERROR
            })
        }
    }

    updateUsername = async (req, res) => {
        try {
            const {newUsername} = req.body
            const _id = req.user._id
            const user = await UserLogic.updateUsername(_id, newUsername)
            res.status(HttpStatusCode.OK).json({user})
        } catch (error) {
            if (error instanceof AppError) {
                console.error(`[AppError ${error.errorCode}] ${error.message}`)
                return res.status(error.statusCode).json({
                    error: error.message,
                    code: error.errorCode
                })
            }

            console.error("Unexpected Server Error: ", error)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 
                error: "An unexpected internal error occurred",
                code: ErrorCode.SERVER_ERROR
            })
        }
    }

    restorePass = async (req, res) => {
        try {
            console.log("In development")
        } catch (error) {
            
        }
    }
}

export default new UserController()