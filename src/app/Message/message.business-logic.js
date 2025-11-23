// import { LanguageMap, DEFAULT_LANG_CODE } from "../../utils/language-mapper.js"
import { AIRequestCommand } from "./socket/ai-request.command.js"
import { HttpStatusCode } from "../../utils/status-code.js"
import { ErrorCode } from "../../utils/error-code.js"
import { messageRoles } from "./message.enum.js"
import ChatSessionLogic from "../ChatSession/chat-session.business-logic.js"
import ChatSession from "../ChatSession/chat-session.model.js"
import AppError from "../../utils/custom-throw-error.js"
import Message from "./message.model.js"

import mongoose from "mongoose"

class MessageLogic {
    getAnswer = async (question, chatSessionId, userId, aiSocket, onReport) => {
        try {
            if (!question) {
                throw new AppError(
                    "we couldn't find any question",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.MISSING_FIELD
                )
            }
            // const language = this.#detectLanguage(question)
            // console.log(`Question: ${question} | Language: ${language}`)
            console.log(`Question: ${question}`)

            const isFirst = !chatSessionId
            let chatHistory = []
            if (!isFirst) {
                chatHistory = await this.#getAllChatMessagesBySession(chatSessionId)
            }

            const responseData = await this.#callAIServer(question, chatHistory, isFirst, aiSocket, onReport)
            const answer = responseData?.answer
            const title = responseData?.title

            if (!answer) {
                throw new AppError(
                    "Could not generate an answer",
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.NO_ANSWER_FOUND
                )
            }
            console.log(`Answer: ${answer}`)

            if(isFirst) {
                console.log(`Title: ${title}`)
                const newTitle = title || "new chat"
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

    #callAIServer = async (question, history, isFirst, aiSocket, onReport) => {
        const command = new AIRequestCommand(aiSocket, onReport)
        const payload = {
            event: "ask-ai", 
            data: {
                question: question,
                history: history,
                is_first: isFirst
            }
        }
        return await command.execute(payload)
    }

    // #detectLanguage = (text) => {
    //     const fallbackLang = LanguageMap[DEFAULT_LANG_CODE]
    //     try {
    //         if (!text || typeof text !== 'string' || !text.trim()) {
    //             return fallbackLang
    //         }

    //         const result = eld.detect(text)

    //         if (result && result.language) {
    //             return LanguageMap[result.language] || fallbackLang
    //         }

    //         return fallbackLang
    //     } catch (error) {
    //         console.error("Language detection error:", error)
    //         console.log(`default to English ${fallbackLang}`)
    //         return fallbackLang
    //     }
    // }
}

export default new MessageLogic()