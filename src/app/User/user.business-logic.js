import { HttpStatusCode } from "../../utils/status-code.js"
import { ErrorCode } from "../../utils/error-code.js"
import { env } from "../../utils/env-loader.js"
import AppError from "../../utils/custom-throw-error.js"
import User from "./user.model.js"

import validator from "validator"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

class UserLogic {
    #createToken = (_id, expiresIn = "1d") => {
        return jwt.sign({_id}, env.JWT_SECRET, {expiresIn})
    }
    
    signUp = async (email, password, username) => {
        try {
            if(!email || !password || !username) {
                throw new AppError(
                    "Email, password or username is missing",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.MISSING_FIELD
                )
            }

            if(!validator.isEmail(email)) {
                throw new AppError(
                    "Invalid email",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_EMAIL
                )
            }

            const emailExists = await User.findOne({email})
            if(emailExists){
                throw new AppError(
                    "Email existed",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.ITEM_EXISTED
                )
            }

            // Hass password
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)
            const user = await User.create({
                username: username,
                email: email,
                passwordHash: hash,
            })
            const {passwordHash, _id, ...publicUserData} = user.toObject() || user
            const token = this.#createToken(user._id)

            return {user: publicUserData, token}
        } catch (error) {
            throw error
        }
    }

    login = async (email, password) => {
        try {
            if(!email || !password) {
                throw new AppError(
                    "Email or password is missing",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.MISSING_FIELD
                )
            }

            const user = await User.findOne({email})
            if(!user) {
                throw new AppError(
                    "Invalid credentials",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_CREDENTIALS
                )
            }

            const matchPassword = await bcrypt.compare(password, user.passwordHash)
            if(!matchPassword){
                throw new AppError(
                    "Invalid credentials",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_CREDENTIALS
                )
            }

            const {passwordHash, _id, ...publicUserData} = user.toObject() || user
            const token = this.#createToken(user._id)

            return {user: publicUserData, token}
        } catch (error) {
            throw error
        }
    }

    changePass = async (_id, oldPassword, newPassword) => {
        try {
            if(!oldPassword || !newPassword) {
                throw new AppError(
                    "Some field is missing",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.MISSING_FIELD
                )
            }

            if(oldPassword === newPassword) {
                throw new AppError(
                    "Current password and new password must be different",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_CREDENTIALS
                )
            }
            
            const user = await User.findById(_id).select("passwordHash")
            if(!user) {
                throw new AppError(
                    "Can't find account",
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.ITEM_NOT_FOUND
                )
            }

            const matchPassword = await bcrypt.compare(oldPassword, user.passwordHash)
            if(!matchPassword){
                throw new AppError(
                    "Invalid credentials",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_CREDENTIALS
                )
            }

            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(newPassword, salt)

            await User.findByIdAndUpdate(_id, {passwordHash: hash})
        } catch (error) {
            throw error
        }
    }

    getProfile = async (_id) => {
        try {
            const user = await User.findById(_id).select("-passwordHash")
            if(!user) {
                throw new AppError(
                    "Can't find account",
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.ITEM_NOT_FOUND
                )
            }
            const {_id: id, ...publicUserData} = user.toObject() || user

            return publicUserData
        } catch (error) {
            throw error
        }
    }

    updateUsername = async (_id, newUsername) => {
        try {
            if(!newUsername) {
                throw new AppError(
                    "Username is missing",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.MISSING_FIELD
                )
            }

            const user = await User.findByIdAndUpdate(
                _id,
                {username: newUsername},
                {new: true}
            ).select("-passwordHash")
            if(!user) {
                throw new AppError(
                    "Can't find account",
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.ITEM_NOT_FOUND
                )
            }
            const {_id: id, ...publicUserData} = user.toObject() || user
            
            return publicUserData
        } catch (error) {
            throw error
        }
    }

    restorePass = async (email) => {
        try {
            console.log("In development")
        } catch (error) {
            throw error
        }
    }
}

export default new UserLogic()