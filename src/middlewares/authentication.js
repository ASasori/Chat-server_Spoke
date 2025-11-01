import { HttpStatusCode } from "../utils/status-code.js"
import { env } from "../utils/env-loader.js"
import User from "../app/User/user.model.js"

import jwt from "jsonwebtoken"

class Authentication {
    userAuth = async(req, res, next) => {
        try{
            const authorization = req.headers.authorization;

            if (!authorization) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({
                    error: "Authorization token missing",
                })
            }

            const token = authorization.split(" ")[0]
            const decoded = jwt.verify(token, env.JWT_SECRET)

            if (!decoded?._id) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({
                    error: "Invalid token payload",
                })
            }

            const info = await User.findById(decoded._id).select("-passwordHash")
            if (!info) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({
                    error: "User not found",
                })
            }
            req.user = info
            next()
        } catch (error) {
            console.log("Auth error:", error.message)
            res.status(HttpStatusCode.UNAUTHORIZED).json({error: "Request not authorized"})
        }
    }
}

export default new Authentication