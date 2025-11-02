import { HttpStatusCode } from "../../utils/status-code.js"
import { ErrorCode } from "../../utils/error-code.js"
import { messageRoles } from "./message.enum.js"
import { env } from "../../utils/env-loader.js"
import ChatSessionLogic from "../ChatSession/chat-session.business-logic.js"
import ChatSession from "../ChatSession/chat-session.model.js"
import AppError from "../../utils/custom-throw-error.js"
import Message from "./message.model.js"

import mongoose from "mongoose"
import axios from "axios"

class MessageLogic {
    getAnswer = async (question, chatSessionId, userId) => {
        try {
            if (!question) {
                throw new AppError(
                    "we couldn't find any question",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.MISSING_FIELD
                )
            }
            console.log(`Question: ${question}`)

            // const api = env.SPOKE_AGENT_URL
            // if (!api || !api.startsWith('http')){
            //     throw new AppError(
            //         "The URL is invalid",
            //         HttpStatusCode.INTERNAL_SERVER_ERROR,
            //         ErrorCode.INVALID_URL
            //     )
            // }
            // const response = await axios.post(
            //     api,
            //     {prompt: question}
            // )

            // const answer = response.data?.answer
            const answer = "this is a mock answer"
            if (!answer) {
                 throw new AppError(
                    "Could not generate an answer",
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.NO_ANSWER_FOUND
                )
            }
            console.log(`Answer: ${answer}`)

            if(!chatSessionId) {
                const newTitle = "new chat"
                const chatSession = await ChatSessionLogic.createNewChatSession(userId, newTitle)
                chatSessionId = chatSession._id
            }

            if(!mongoose.isValidObjectId(chatSessionId)) {
                throw new AppError(
                    "Invalid chat session ID",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_FIELD
                )
            }

            const userMessage = await Message.create({
                chatSessionId: chatSessionId,
                role: messageRoles.USER,
                content: question
            })
            const botAnswer = await Message.create({
                chatSessionId: chatSessionId,
                role: messageRoles.BOT,
                content: answer
            })
            await ChatSession.findByIdAndUpdate(chatSessionId, {updatedAt: new Date()})

            return {
                answer,
                chatSessionId,
                messages: [userMessage.toObject(), botAnswer.toObject()]
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new AppError(
                    error.message,
                    HttpStatusCode.INTERNAL_SERVER_ERROR,
                    ErrorCode.EXTERNAL_API_FAILURE
                )
            }
            throw error
        }
    }

    getChatMessagesBySession = async (chatSessionId, page, limit) => {
        try {
            if(!mongoose.isValidObjectId(chatSessionId)) {
                throw new AppError(
                    "Invalid chat session ID",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_FIELD
                )
            }
            
            page = Math.max(1, page) 
            limit = Math.min(Math.max(limit, 1), 100)
            const skip = (page - 1) * limit
            const totalItems = await Message.countDocuments({chatSessionId})
            const totalPages = Math.ceil(totalItems / limit)
            const itemsRemain = Math.max(totalItems - (limit + skip), 0)
            const nextPage = (page < totalPages) ? page + 1 : null
            const prevPage = (page > 1) ? page - 1 : null
            const chatMessages = await Message
                                    .find({chatSessionId: chatSessionId})
                                    .sort({createdAt: -1})
                                    .skip(skip)
                                    .limit(limit)
            
            return {
                chatMessages: chatMessages.map(msg => msg.toObject()).reverse(),
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
}

export default new MessageLogic()