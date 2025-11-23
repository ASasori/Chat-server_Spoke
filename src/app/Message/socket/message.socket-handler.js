import MessageLogic from "../message.business-logic.js"

class MessageSocketHandler {
    askQuestion = async (io, socket, aiSocket, data) => {
        const { question, chatSessionId } = data
        try {
            if (!aiSocket || aiSocket.readyState !== 1) {
                throw new Error("AI Server not connected, try again later")
            }

            socket.emit("server-ack", {status: "processing..."})

            const onReport = (reportData) => {
                console.log(reportData)
                socket.emit("server-report", reportData)
            }
            
            const result = await MessageLogic.getAnswer(question, chatSessionId, socket.user._id, aiSocket, onReport)
            
            io.to(socket.user._id.toString()).emit("receive-answer", result)
        } catch (error) {
            console.error("Socket error:", error.message)
            socket.emit("error-message", {message: error.message || "Unknown error"})
        }
    }
}

export default new MessageSocketHandler()