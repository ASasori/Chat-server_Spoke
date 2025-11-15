import { HttpStatusCode } from "../../utils/status-code.js"
import { ErrorCode } from "../../utils/error-code.js"
import { messageRoles } from "./message.enum.js"
import ChatSessionLogic from "../ChatSession/chat-session.business-logic.js"
import ChatSession from "../ChatSession/chat-session.model.js"
import AppError from "../../utils/custom-throw-error.js"
import Message from "./message.model.js"

import mongoose from "mongoose"

class MessageLogic {
    getAnswer = async (question, chatSessionId, userId, aiSocket) => {
        try {
            if (!question) {
                throw new AppError(
                    "we couldn't find any question",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.MISSING_FIELD
                )
            }
            console.log(`Question: ${question}`)

            let chatHistory = []
            if (chatSessionId) {
                chatHistory = await this.#getAllChatMessagesBySession(chatSessionId)
            }

            const answer = await this.#callAIServer(question, chatHistory, aiSocket)
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
                // reverse the list to return the item by choronological order
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

    #getAllChatMessagesBySession = async (chatSessionId) => {
        try {
            if(!mongoose.isValidObjectId(chatSessionId)) {
                throw new AppError(
                    "Invalid chat session ID",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_FIELD
                )
            }
            const chatMessages = await Message
                                    .find({chatSessionId: chatSessionId})
                                    .sort({createdAt: 1})
                                    .select("role content -_id")
            return chatMessages.map(msg => msg.toObject())
        } catch (error) {
            throw error
        }
    }

    #callAIServer = async (question, history, aiSocket) => {
        return new Promise((resolve, reject) => {
            const cleanup = () => {
                aiSocket.removeListener("message", messageListener)
                aiSocket.removeListener("error", errorListener)
                aiSocket.removeListener("close", closeListener)
            }
            const messageListener = (data) => {
                cleanup()
                try {
                    const response = JSON.parse(data)
                    if (response.error) {
                        reject(new Error(response.error))
                    } else {
                        resolve(response.answer)
                    }
                } catch (err) {
                    reject(new Error("Invalid response format from AI Server"))
                }
            }
            const errorListener = (err) => {
                cleanup()
                reject(new Error("AI Server connection error while waiting for response"))
            }
            const closeListener = () => {
                cleanup()
                reject(new Error("AI Server connection closed unexpectedly"))
            }
            aiSocket.once("message", messageListener)
            aiSocket.once("error", errorListener)
            aiSocket.once("close", closeListener)
            aiSocket.send(JSON.stringify({question: question, history: history}))
        })
    }
}

export default new MessageLogic()