import ChatSessionController from "./chat-session.controller.js"
import Auth from "../../middlewares/authentication.js"

import { Router } from "express"

const router = Router()

router.get(
    "/get-by-user",
    Auth.userAuth,
    ChatSessionController.getChatSessionListByUser
)

router.patch(
    "/:id/name",
    Auth.userAuth,
    ChatSessionController.renameChatSession
)

router.patch(
    "/:id/soft-delete",
    Auth.userAuth,
    ChatSessionController.softDeleteChatSession
)

router.delete(
    "/:id",
    Auth.userAuth,
    ChatSessionController.deleteChatSession
)

export default router