import ChatLogic from "./chat.business-logic.js"
import AppError from "../../utils/custom-throw-error.js"

class ChatController {
    testFunction = async (req, res) => {
        const question = req.body.question

        if (question != undefined && question !== "") {
            console.log(`Question: ${question}`)

            let answer = `You said: "${question}"`
            
            console.log(answer)

            res.status(200).json({"answer": answer})
        } else{
            res.status(404).json({error: "No question asked"})
        }
    }

    getAnswer = async (req, res) => {
        const question = req.body.question;
        try{
            let answer = await ChatLogic.getAnswer(question)
            res.status(200).json({"answer": answer})
        } catch (error) {
            if (error instanceof AppError) {
                console.error(`[AppError ${error.errorCode}] ${error.message}`)
                return res.status(error.statusCode).json({
                    error: error.message,
                    code: error.errorCode
                })
            }

            console.error("Unexpected Server Error: ", error);
            res.status(500).json({ 
                error: "An unexpected internal error occurred",
                code: "SERVER_ERROR"
            })
        }  
    }

    getChatList = async (req, res) => {
        try {
            console.log("In development")
        } catch (error) {
            
        }
    }

    getChatHistory = async (req, res) => {
        try {
            console.log("In development")
        } catch (error) {
            
        }
    }

    createNewChat = async (req, res) => {
        try {
            console.log("In development")
        } catch (error) {
            
        }
    }

    renameChat = async (req, res) => {
        try {
            console.log("In development")
        } catch (error) {
            
        }
    }

    softDeleteChat = async (req, res) => {
        try {
            console.log("In development")
        } catch (error) {
            
        }
    }

    deleteChat = async (req, res) => {
        try {
            console.log("In development")
        } catch (error) {
            
        }
    }
}

export default new ChatController()