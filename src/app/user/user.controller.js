import { HttpStatusCode } from "../../utils/status-code.js"
import UserLogic from "./user.business-logic.js"

class UserController {
    login = async (req, res, next) => {
        try {
            const {email, password} = req.body
            const {user, token} = await UserLogic.login(email, password)
            
            res.status(HttpStatusCode.OK).json({user, token})
        } catch (error) {
            return next(error)
        }
    }

    signUp = async (req, res, next) => {
        try {
            const {email, password, username} = req.body
            const {user, token} = await UserLogic.signUp(email, password, username)

            res.status(HttpStatusCode.CREATED).json({user, token})
        } catch (error) {
            return next(error)
        }
    }

    changePass = async (req, res, next) => {
        try {
            const {oldPassword, newPassword} = req.body
            const _id = req.user._id
            await UserLogic.changePass(_id, oldPassword, newPassword)
            res.status(HttpStatusCode.OK).json({message: "Password changed successfully"})
        } catch (error) {
            return next(error)
        }
    }

    getProfile = async (req, res, next) => {
        try {
            const _id = req.user._id
            const user = await UserLogic.getProfile(_id)
            res.status(HttpStatusCode.OK).json({user})
        } catch (error) {
            return next(error)
        }
    }

    updateUsername = async (req, res, next) => {
        try {
            const {newUsername} = req.body
            const _id = req.user._id
            const user = await UserLogic.updateUsername(_id, newUsername)
            res.status(HttpStatusCode.OK).json({user})
        } catch (error) {
            return next(error)
        }
    }

    restorePass = async (req, res, next) => {
        try {
            console.log("In development")
        } catch (error) {
            return next(error)
        }
    }
}

export default new UserController()