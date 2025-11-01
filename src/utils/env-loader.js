import dotenv from "dotenv"

dotenv.config()

export const env = Object.freeze({
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    DB_URI: process.env.DB_URI,
    SPOKE_AGENT_URL: process.env.SPOKE_AGENT_URL,
    JWT_SECRET: process.env.JWT_SECRET,
})