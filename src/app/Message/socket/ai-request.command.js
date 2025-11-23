export class AIRequestCommand {
    constructor(socket, onReport) {
        this.socket = socket
        this.onReport = onReport
        this.resolve = null
        this.reject = null

        // Bind listeners to preserve 'this' context
        this.boundMessageListener = this.#messageListener.bind(this)
        this.boundErrorListener = this.#errorListener.bind(this)
        this.boundCloseListener = this.#closeListener.bind(this)
    }

    execute(payload) {
        return new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject

            // Attach Listeners
            this.socket.on("message", this.boundMessageListener)
            this.socket.once("error", this.boundErrorListener)
            this.socket.once("close", this.boundCloseListener)

            // Send Data
            try {
                this.socket.send(JSON.stringify(payload))
            } catch (err) {
                this.#cleanup();
                reject(new Error("Failed to send message to AI Server"))
            }
        })
    }

    #messageListener(rawMessage) {
        try {
            const parsed = JSON.parse(rawMessage)
            const messageEvent = parsed.event
            const data = parsed.data || parsed;

            switch (messageEvent) {
                case "ai-report":
                    // Notify subscriber of state change
                    if (this.onReport) this.onReport(data)
                    break

                case "ai-response":
                    // The request is finished
                    this.#cleanup()
                    if (this.resolve) this.resolve(data)
                    break;

                default:
                    if (parsed.error) {
                        this.#cleanup()
                        if (this.reject) this.reject(new Error(parsed.error))
                    }
            }
        } catch (error) {
            console.error("Protocol Error:", error.message)
        }
    }

    #errorListener(err) {
        this.#cleanup()
        if (this.reject) this.reject(new Error("AI Server connection error"))
    }

    #closeListener() {
        this.#cleanup()
        if (this.reject) this.reject(new Error("AI Server disconnected unexpectedly"))
    }

    #cleanup() {
        if (this.socket) {
            this.socket.removeListener("message", this.boundMessageListener)
            this.socket.removeListener("error", this.boundErrorListener)
            this.socket.removeListener("close", this.boundCloseListener)
        }
    }
}