import { env } from "./utils/env-loader.js"
import errorHandler from "./middlewares/error-handler.js"
import connectDB from "./db/connect.db.js"
import routes from "./app/index.routes.js"

import express, { urlencoded } from "express"
import cors from "cors"


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

app.use(errorHandler)

app.listen(env.PORT, () => {
    const baseURL = `${env.HOST}:${env.PORT}`;
    console.log(`Listening on port ${env.PORT}`);
    console.log(`--> Test page: ${baseURL}/`);
})

