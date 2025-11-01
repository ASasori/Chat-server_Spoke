import MessageController from "./message.controller.js"
import Auth from "../../middlewares/authentication.js"

import { Router } from "express"

const router = Router()

router.post(
    "/test",
    MessageController.testFunction
)

router.post(
    "/ask",
    Auth.userAuth,
    MessageController.getAnswer
)

router.get(
    "/chat-messages/:id",
    Auth.userAuth,
    MessageController.getChatMessagesBySession
)

export default router