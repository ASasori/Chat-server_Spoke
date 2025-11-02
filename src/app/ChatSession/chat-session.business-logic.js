import { HttpStatusCode } from "../../utils/status-code.js"
import { ErrorCode } from "../../utils/error-code.js"
import AppError from "../../utils/custom-throw-error.js"
import ChatSession from "./chat-session.model.js"
import User from "../User/user.model.js"

import mongoose from "mongoose"

class ChatSessionLogic {
    getChatSessionListByUser = async (_id, page, limit) => {
        try {
            const user = await User.findById(_id)
            if(!user) {
                throw new AppError(
                    "Can't find account",
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.ITEM_NOT_FOUND
                )
            }

            const filter = {userId: user._id, isDeleted: false}
            page = Math.max(1, page) 
            limit = Math.min(Math.max(limit, 1), 100)
            const skip = (page - 1) * limit
            const totalItems = await ChatSession.countDocuments(filter)
            const totalPages = Math.ceil(totalItems / limit)
            const itemsRemain = Math.max(totalItems - (limit + skip), 0)
            const nextPage = (page < totalPages) ? page + 1 : null
            const prevPage = (page > 1) ? page - 1 : null
            const chatSessions = await ChatSession
                                        .find(filter)
                                        .sort({updatedAt: -1})
                                        .skip(skip)
                                        .limit(limit)

            return {
                chatSessions: chatSessions.map(session => session.toObject()),
                metadata: {
                    currentPage: page,
                    nextPage: nextPage,
                    prevPage: prevPage,
                    totalPages: totalPages,
                    totalItems: totalItems,
                    itemPerPage: limit,
                    itemsRemain: itemsRemain
                },
            }
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

            return chatSession.toObject()
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

            return chatSession.toObject()
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