import chatRouter from "./chat.routes.js"
import userRouter from "./user.routes.js"

import path from "path";
import { fileURLToPath } from "url";

function routes(app) {
    app.use('/chat', chatRouter)
    app.use('/user', userRouter)

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "../templates/chat.html"));
    });
}

export default routes