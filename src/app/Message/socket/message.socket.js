import { socketAuth } from "../../../middlewares/socket-auth.js"
import { env } from "../../../utils/env-loader.js"
import MessageHandler from "./message.socket-handler.js"

import WebSocket from "ws"

const initSocket = (io) => {
    io.use(socketAuth)

    io.on("connection", (socket) => {
        console.log(`[Client Connected] User: ${socket.user.username} (${socket.id})`)
        socket.join(socket.user._id.toString())
        let aiSocket
        try {
            aiSocket = new WebSocket(env.SPOKE_AGENT_URL)
            socket.aiSocket = aiSocket

            aiSocket.on("open", () => {
                console.log(`[AI Connected] Ready for user: ${socket.user.username}`)
            })

            aiSocket.on("error", (error) => {
                console.error("[AI Connection Error]", error.message)
                socket.emit("error-message", {message: "Can't connect to AI Server"})
            })

            aiSocket.on("close", () => {
                console.log(`[AI Disconnected] For user: ${socket.user.username}`)
                socket.emit("error-message", {message: "AI Server disconnected"})
            })
        } catch (error) {
            console.error("[AI Init Error] Invalid configuration:", error.message)
            socket.emit("error-message", {message: "AI Server URL misconfiguration"})
        }
        
        socket.on("ask-question", async (data) => {
            await MessageHandler.askQuestion(io, socket, socket.aiSocket, data)
        })

        socket.on("disconnect", () => {
            console.log(`[Client Disconnected] User: ${socket.user.username}`)
            if (aiSocket && (aiSocket.readyState === WebSocket.OPEN || aiSocket.readyState === WebSocket.CONNECTING)) {
                aiSocket.close()
            }
        })
    })
}

export default initSocket