import { HttpStatusCode } from "../../utils/status-code.js"
import { ErrorCode } from "../../utils/error-code.js"
import AppError from "../../utils/custom-throw-error.js"
import ChatSession from "./chat-session.model.js"
import User from "../User/user.model.js"

import mongoose from "mongoose"

class ChatSessionLogic {
    getChatSessionListByUser = async (_id) => {
        try {
            const user = await User.findById(_id)
            if(!user) {
                throw new AppError(
                    "Can't find account",
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.ITEM_NOT_FOUND
                )
            }

            const chatSessionList = await ChatSession
                                        .find({userId: user._id, isDeleted: false})
                                        .sort({updatedAt: -1})
                                        
            return chatSessionList
        } catch (error) {
            throw error
        }
    }

    createNewChatSession = async (userId, title) => {
        try {
            if (!userId || !title) {
                throw new AppError(
                    "Some information is missing",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.MISSING_FIELD
                )
            }

            const chatSession = await ChatSession.create({
                userId: userId,
                title: title,
            })

            return chatSession
        } catch (error) {
            throw error
        }
    }

    renameChatSession = async (chatSessionId, newTitle) => {
        try {
            if (!chatSessionId || !newTitle) {
                throw new AppError(
                    "Some information is missing",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.MISSING_FIELD
                )
            }
            if (!mongoose.isValidObjectId(chatSessionId)) {
                throw new AppError(
                    "Invalid chat session ID",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_FIELD
                )
            }
            const chatSession = await ChatSession.findById(chatSessionId)
            if (!chatSession) {
                throw new AppError(
                    "Can't find chat session",
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.ITEM_NOT_FOUND
                )
            }
            chatSession.title = newTitle
            await chatSession.save()

            return chatSession
        } catch (error) {
            throw error
        }
    }

    softDeleteChatSession = async (chatSessionId) => {
        try {
            if (!mongoose.isValidObjectId(chatSessionId)) {
                throw new AppError(
                    "Invalid chat session ID",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_FIELD
                )
            }
            const chatSession = await ChatSession.findById(chatSessionId)
            if (!chatSession) {
                throw new AppError(
                    "Can't find chat session",
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.ITEM_NOT_FOUND
                )
            }
            chatSession.isDeleted = true
            await chatSession.save()
        } catch (error) {
            throw error
        }
    }

    deleteChatSession = async (chatSessionId) => {
        try {
            if (!mongoose.isValidObjectId(chatSessionId)) {
                throw new AppError(
                    "Invalid chat session ID",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_FIELD
                )
            }
            await ChatSession.findByIdAndDelete(chatSessionId)
        } catch (error) {
            throw error
        }
    }
}

export default new ChatSessionLogic()