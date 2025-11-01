import Auth from "../../middlewares/authentication.js"
import UserController from "./user.controller.js"

import { Router } from "express"

const router = Router()

router.post(
    "/login",
    UserController.login
)

router.post(
    "/sign-up",
    UserController.signUp
)

router.post(
    "/change-pass",
    Auth.userAuth,
    UserController.changePass
)

router.post(
    "/restore-pass",
    UserController.restorePass
)

export default router