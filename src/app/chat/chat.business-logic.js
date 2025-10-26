import AppError from "../../utils/custom-throw-error.js"

import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

class ChatLogic {
    getAnswer = async (question) => {

        if (!question) {
            throw new AppError(
                message = "we couldn't find any question",
                statusCode = 404,
                errorCode = "NO_QUESTION_FOUND",
            )
        }
        console.log(`Question: ${question}`);

        try {
            let api = process.env.SPOKE_AGENT_URL
            if (!api || !api.startsWith('http')){
                throw new AppError(
                    "The URL is invalid",
                    500,
                    "INVALID_URL"
                )
            }
            const response = await axios.post(
                api,
                {prompt: question}
            )

            let answer = response.data.answer;
            
            if (!answer) {
                 throw new AppError(
                    "Could not generate an answer",
                    404,
                    "NO_ANSWER_FOUND"
                );
            }
            console.log(`Answer: ${answer}`)

            return answer
        } catch (error) {
            if (error.response || error.request) {
                throw new AppError(
                    error.message,
                    500,
                    "EXTERNAL_API_FAILURE",
                )
            }
            throw error
        }
    }
}

export default new ChatLogic()