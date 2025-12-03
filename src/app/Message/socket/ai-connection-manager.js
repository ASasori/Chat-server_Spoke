import WebSocket from "ws"
import { env } from "../../../utils/env-loader.js"

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const IDLE_TIMEOUT_MINUTES = 5; // 5 minute

export class AIConnectionManager {
    constructor(clientSocket) {
        this.clientSocket = clientSocket;
        this.aiSocket = null;
        this.timeoutId = null;
        this.isProcessing = false;
        this.IDLE_TIMEOUT = IDLE_TIMEOUT_MINUTES * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;
    }

    // Handle connection
    async connect() {
        // Reset timer if connection is still alive
        if (this.aiSocket && this.aiSocket.readyState === WebSocket.OPEN) {
            this.resetTimeout();
            return this.aiSocket;
        }

        console.log(`[AI Connecting] waking up for user: ${this.clientSocket.user.username}...`);
        
        return new Promise((resolve, reject) => {
            try {
                this.aiSocket = new WebSocket(env.SPOKE_AGENT_URL);
                
                // Attach listener
                this.aiSocket.on("open", () => {
                    console.log(`[AI Connected] Ready for user: ${this.clientSocket.user.username}`);
                    this.resetTimeout(); // Start countdown
                    resolve(this.aiSocket);
                });

                this.aiSocket.on("error", (error) => {
                    console.error("[AI Connection Error]", error.message);
                    this.isProcessing = false;
                    this.clientSocket.emit("error-message", {message: "Can't connect to AI Server"});
                });

                this.aiSocket.on("close", () => {
                    this.isProcessing = false;
                });

            } catch (error) {
                console.error("[AI Init Error]", error.message);
                this.clientSocket.emit("error-message", {message: "AI Server URL misconfiguration"});
                reject(error);
            }
        });
    }

    // Mark start of process
    startProcessing() {
        this.isProcessing = true;
        this.resetTimeout();
    }

    // Mark end of process
    endProcessing() {
        this.isProcessing = false;
        this.resetTimeout(); // Restart countdown
    }

    // Timeout Logic
    resetTimeout() {
        if (this.timeoutId) clearTimeout(this.timeoutId);

        this.timeoutId = setTimeout(() => {
            if (this.isProcessing) {
                console.log(`[Idle Check] User is busy, extending timeout...`);
                this.resetTimeout(); // Extend timeout
            } else {
                this.disconnect();
            }
        }, this.IDLE_TIMEOUT);
    }

    // Cut connection
    disconnect() {
        if (this.timeoutId) clearTimeout(this.timeoutId);
        
        if (this.aiSocket && (this.aiSocket.readyState === WebSocket.OPEN || this.aiSocket.readyState === WebSocket.CONNECTING)) {
            console.log(`[AI Closing] Closing socket for ${this.clientSocket.user.username}`);
            this.aiSocket.close();
        }
        this.aiSocket = null;
    }
    
    // Return websocket
    getSocket() {
        return this.aiSocket;
    }
}