import { Router } from "express"
import ChatController from "../app/chat/chat.controller.js"

const router = Router()

router.post(
    '/test',
    ChatController.testFunction
)

router.post(
    '/ask',
    ChatController.getAnswer
)

router.get(
    '/chat-list',
    ChatController.getChatList
)

router.get(
    '/chat-logs/:chatid',
    ChatController.getChatHistory
)

router.post(
    '/create-chat',
    ChatController.createNewChat
)

router.post(
    '/rename-chat',
    ChatController.createNewChat
)

router.delete(
    '/soft-del-chat',
    ChatController.softDeleteChat
)

router.delete(
    '/del-chat',
    ChatController.deleteChat
)

export default router