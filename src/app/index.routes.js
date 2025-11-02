import chatSessionRouter from "./ChatSession/chat-session.routes.js"
import messageRouter from "./Message/message.routes.js"
import userRouter from "./User/user.routes.js"

import { fileURLToPath } from "url";
import path from "path";

function routes(app) {
    app.use("/chat-sessions", chatSessionRouter)
    app.use("/messages", messageRouter)
    app.use("/users", userRouter)

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "../templates/chat.html"));
    });
}

export default routes