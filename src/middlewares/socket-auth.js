import { env } from "../utils/env-loader.js"
import User from "../app/User/user.model.js"

import jwt from "jsonwebtoken"

export const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token
        if (!token) {
            return next(new Error("Authentication error"))
        }
        const decoded = jwt.verify(token, env.JWT_SECRET)
        const user = await User.findById(decoded._id).select("_id username")
        if (!user) {
            return next(new Error("User not found"))
        }
        socket.user = user
        next()
    } catch (error) {
        next(new Error("Authentication error"))
    }
}