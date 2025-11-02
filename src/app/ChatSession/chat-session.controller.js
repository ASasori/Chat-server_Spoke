import { HttpStatusCode } from "../../utils/status-code.js"
import { ErrorCode } from "../../utils/error-code.js"
import ChatSessionLogic from "./chat-session.business-logic.js"
import AppError from "../../utils/custom-throw-error.js"

class ChatSessionController {
    getChatSessionListByUser = async (req, res) => {
        try {
            const _id = req.user._id
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 20
            const {chatSessions, metadata} = await ChatSessionLogic.getChatSessionListByUser(_id, page, limit)
            res.status(HttpStatusCode.OK).json({chatSessions, metadata})
        } catch (error) {
            if (error instanceof AppError) {
                console.error(`[AppError ${error.errorCode}] ${error.message}`)
                return res.status(error.statusCode).json({
                    error: error.message,
                    code: error.errorCode
                })
            }
            
            console.error("Unexpected Server Error: ", error)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 
                error: "An unexpected internal error occurred",
                code: ErrorCode.SERVER_ERROR
            })            
        }
    }

    renameChatSession = async (req, res) => {
        try {
            const chatSessionId = req.params.id
            const {newTitle} = req.body
            const chatSession = await ChatSessionLogic.renameChatSession(chatSessionId, newTitle)
            res.status(HttpStatusCode.OK).json({chatSession})
        } catch (error) {
            if (error instanceof AppError) {
                console.error(`[AppError ${error.errorCode}] ${error.message}`)
                return res.status(error.statusCode).json({
                    error: error.message,
                    code: error.errorCode
                })
            }
            
            console.error("Unexpected Server Error: ", error)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 
                error: "An unexpected internal error occurred",
                code: ErrorCode.SERVER_ERROR
            })
        }
    }

    softDeleteChatSession = async (req, res) => {
        try {
            const chatSessionId = req.params.id
            await ChatSessionLogic.softDeleteChatSession(chatSessionId)
            res.status(HttpStatusCode.OK).json({message: "chat session soft deleted successfully"})
        } catch (error) {
            if (error instanceof AppError) {
                console.error(`[AppError ${error.errorCode}] ${error.message}`)
                return res.status(error.statusCode).json({
                    error: error.message,
                    code: error.errorCode
                })
            }
            
            console.error("Unexpected Server Error: ", error)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 
                error: "An unexpected internal error occurred",
                code: ErrorCode.SERVER_ERROR
            })
        }
    }

    deleteChatSession = async (req, res) => {
        try {
            const chatSessionId = req.params.id
            await ChatSessionLogic.deleteChatSession(chatSessionId)
            res.status(HttpStatusCode.OK).json({message: "chat session deleted successfully"})
        } catch (error) {
            if (error instanceof AppError) {
                console.error(`[AppError ${error.errorCode}] ${error.message}`)
                return res.status(error.statusCode).json({
                    error: error.message,
                    code: error.errorCode
                })
            }
            
            console.error("Unexpected Server Error: ", error)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 
                error: "An unexpected internal error occurred",
                code: ErrorCode.SERVER_ERROR
            })
        }
    }
}

export default new ChatSessionController()