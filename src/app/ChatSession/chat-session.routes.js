import ChatSessionController from "./chat-session.controller.js"
import Auth from "../../middlewares/authentication.js"

import { Router } from "express"

const router = Router()

router.get(
    "/user-chat-session-get",
    Auth.userAuth,
    ChatSessionController.getChatSessionListByUser
)

router.post(
    "/remane-chat-session/:id",
    Auth.userAuth,
    ChatSessionController.renameChatSession
)

router.delete(
    "/soft-del-chat-session/:id",
    Auth.userAuth,
    ChatSessionController.softDeleteChatSession
)

router.delete(
    "/del-chat-session/:id",
    Auth.userAuth,
    ChatSessionController.deleteChatSession
)

export default router