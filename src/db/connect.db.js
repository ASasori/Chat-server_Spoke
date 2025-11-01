import { env } from "../utils/env-loader.js"

import mongoose from "mongoose"

async function connectDB() {
    try {
        if (!env.DB_URI) {
            console.error("Missing DB_URI in environment variables.")
            process.exit(1)
        }
        await mongoose.connect(
            env.DB_URI,
            {
                family: 4
            }            
        )
        console.log("Database connected successfully!")
    } catch (error) {
        console.log(`Database connection failed:\n${error}`)
        process.exit(1)
    }
}

export default connectDB