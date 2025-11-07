import { HttpStatusCode } from "../../utils/status-code.js"
import MessageLogic from "./message.business-logic.js"

class MessageController {
    // testFunction = async (req, res, next) => {
    //     const question = req.body.question

    //     if (question != undefined && question !== "") {
    //         console.log(`Question: ${question}`)

    //         const answer = `You said: "${question}"`
            
    //         console.log(answer)

    //         res.status(200).json({"answer": answer})
    //     } else{
    //         res.status(404).json({error: "No question asked"})
    //     }
    // }

    // changed to websocket
    // getAnswer = async (req, res, next) => {
    //     try{
    //         const {question, chatSessionId} = req.body
    //         const userId = req.user._id
    //         const {answer, chatSessionId: returnedId, messages} = await MessageLogic.getAnswer(question, chatSessionId, userId)
    //         res.status(HttpStatusCode.CREATED).json({answer, chatSessionId: returnedId, messages})
    //     } catch (error) {
    //         return next(error)
    //     }  
    // }

    getChatMessagesBySession = async (req, res, next) => {
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
            return next(error)
        }
    }
}

export default new MessageController()