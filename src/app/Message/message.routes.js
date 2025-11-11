import MessageController from "./message.controller.js"
import Auth from "../../middlewares/authentication.js"

import { Router } from "express"

const router = Router()

router.get(
    "/session/:id/get-messages",
    Auth.userAuth,
    MessageController.getChatMessagesBySession
)
// changed to websocket
// router.post(
//     "/get-answer",
//     Auth.userAuth,
//     MessageController.getAnswer
// )

// router.post(
//     "/test",
//     MessageController.testFunction
// )
export default router