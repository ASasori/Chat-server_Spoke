import express, { urlencoded } from "express"
import cors from "cors"
import dotenv from "dotenv"

import connectDB from "./db/connect.db.js"
import routes from "./routes/index.routes.js"

dotenv.config()

const app = express()

app.set("trust proxy", true)
app.use(cors())
app.use(express.json())
app.use(express.static("public"))
app.use(urlencoded({extended: true}))

// app.use((req, res, next) =>{
//     console.log(req.path, res.method)
//     next()
// })

connectDB()

routes(app)
const PORT = process.env.PORT
const HOST = process.env.HOST

app.listen(PORT, () => {
    const baseURL = `${HOST}:${PORT}`;
    console.log(`Listening on port ${PORT}`);
    console.log(`--> Test page: ${baseURL}/`);
});

