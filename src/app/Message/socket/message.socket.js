import { socketAuth } from "../../../middlewares/socket-auth.js"
import { AIConnectionManager } from "./ai-connection-manager.js"
import MessageHandler from "./message.socket-handler.js"

const initSocket = (io) => {
    io.use(socketAuth)

    io.on("connection", (socket) => {
        console.log(`[Client Connected] User: ${socket.user.username} (${socket.id})`)
        socket.join(socket.user._id.toString())

        // Initiate manager for user
        const aiManager = new AIConnectionManager(socket);
        
        // Start connection
        aiManager.connect().catch(() => {}); 

        socket.on("ask-question", async (data) => {
            try {
                // Mark as busy, maitain connection
                aiManager.startProcessing();
                await aiManager.connect(); 

                // Call handler
                await MessageHandler.askQuestion(io, socket, aiManager.getSocket(), data);
            } finally {
                // Mark as idle
                aiManager.endProcessing();
            }
        })

        socket.on("disconnect", () => {
            console.log(`[Client Disconnected] User: ${socket.user.username}`)
            aiManager.disconnect(); // End connection
        })
    })
}

export default initSocket