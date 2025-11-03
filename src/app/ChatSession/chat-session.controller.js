import { HttpStatusCode } from "../../utils/status-code.js"
import ChatSessionLogic from "./chat-session.business-logic.js"

class ChatSessionController {
    getChatSessionListByUser = async (req, res, next) => {
        try {
            const _id = req.user._id
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 20
            const {chatSessions, metadata} = await ChatSessionLogic.getChatSessionListByUser(_id, page, limit)
            res.status(HttpStatusCode.OK).json({chatSessions, metadata})
        } catch (error) {
            return next(error)           
        }
    }

    renameChatSession = async (req, res, next) => {
        try {
            const chatSessionId = req.params.id
            const {newTitle} = req.body
            const chatSession = await ChatSessionLogic.renameChatSession(chatSessionId, newTitle)
            res.status(HttpStatusCode.OK).json({chatSession})
        } catch (error) {
            return next(error)
        }
    }

    softDeleteChatSession = async (req, res, next) => {
        try {
            const chatSessionId = req.params.id
            await ChatSessionLogic.softDeleteChatSession(chatSessionId)
            res.status(HttpStatusCode.OK).json({message: "chat session soft deleted successfully"})
        } catch (error) {
            return next(error)
        }
    }

    deleteChatSession = async (req, res, next) => {
        try {
            const chatSessionId = req.params.id
            await ChatSessionLogic.deleteChatSession(chatSessionId)
            res.status(HttpStatusCode.OK).json({message: "chat session deleted successfully"})
        } catch (error) {
            return next(error)
        }
    }
}

export default new ChatSessionController()