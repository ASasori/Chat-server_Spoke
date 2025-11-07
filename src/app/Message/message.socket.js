import { socketAuth } from "../../middlewares/socket-auth.js"
import MessageLogic from "./message.business-logic.js"

const initSocket = (io) => {
    io.use(socketAuth)
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.user.username} ${socket.id}`)
        socket.join(socket.user._id.toString())
        socket.on("ask-question", async (data) => {
            const {question, chatSessionId} = data
            try {
                socket.emit("server-ack", {status: "processing"})
                const result = await MessageLogic.getAnswer(question, chatSessionId, socket.user._id)
                io.to(socket.user._id.toString()).emit("receive-answer", result)
            } catch (error) {
                socket.emit("error-message", { message: error.message })
            }
        })

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.user.username}`)
        })
    })
}

export default initSocket