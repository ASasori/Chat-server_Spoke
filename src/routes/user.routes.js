import { Router } from "express"
import UserController from "../app/user/user.controller.js"

const router = Router()
const userController = new UserController()

router.post(
    '/login',
    userController.login
)

router.post(
    '/sign-up',
    userController.signUp
)

router.post(
    '/change-pass',
    userController.changePass
)

router.post(
    '/restore-pass',
    userController.restorePass
)


export default router