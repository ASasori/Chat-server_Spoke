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

router.get(
    "/get-profile",
    Auth.userAuth,
    UserController.getProfile
)

router.patch(
    "/username",
    Auth.userAuth,
    UserController.updateUsername
)

router.patch(
    "/password",
    Auth.userAuth,
    UserController.changePass
)

router.post(
    "/restore-pass",
    UserController.restorePass
)

export default router