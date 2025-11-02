import { HttpStatusCode } from "../../utils/status-code.js"
import { ErrorCode } from "../../utils/error-code.js"
import AppError from "../../utils/custom-throw-error.js"
import MessageLogic from "./message.business-logic.js"

class MessageController {
    testFunction = async (req, res) => {
        const question = req.body.question

        if (question != undefined && question !== "") {
            console.log(`Question: ${question}`)

            const answer = `You said: "${question}"`
            
            console.log(answer)

            res.status(200).json({"answer": answer})
        } else{
            res.status(404).json({error: "No question asked"})
        }
    }

    getAnswer = async (req, res) => {
        try{
            const {question, chatSessionId} = req.body
            const userId = req.user._id
            const {answer, chatSessionId: returnedId, messages} = await MessageLogic.getAnswer(question, chatSessionId, userId)
            res.status(HttpStatusCode.CREATED).json({answer, chatSessionId: returnedId, messages})
        } catch (error) {
            if (error instanceof AppError) {
                console.error(`[AppError ${error.errorCode}] ${error.message}`)
                return res.status(error.statusCode).json({
                    error: error.message,
                    code: error.errorCode
                })
            }
            
            console.error("Unexpected Server Error: ", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 
                error: "An unexpected internal error occurred",
                code: ErrorCode.SERVER_ERROR
            })
        }  
    }

    getChatMessagesBySession = async (req, res) => {
        try {
            const chatSessionId = req.params.id
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 20
            const {chatMessages, metadata} = await MessageLogic.getChatMessagesBySession(chatSessionId, page, limit)
            res.status(HttpStatusCode.OK).json({
                chatMessages,
                metadata
            })
        } catch (error) {
            if (error instanceof AppError) {
                console.error(`[AppError ${error.errorCode}] ${error.message}`)
                return res.status(error.statusCode).json({
                    error: error.message,
                    code: error.errorCode
                })
            }
            
            console.error("Unexpected Server Error: ", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 
                error: "An unexpected internal error occurred",
                code: ErrorCode.SERVER_ERROR
            })
        }
    }
}

export default new MessageController()