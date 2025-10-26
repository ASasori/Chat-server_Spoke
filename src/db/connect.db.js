import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

async function connectDB() {
    try {
        await mongoose.connect(
            process.env.DB_URI,
            {
                family: 4
            }            
        )
        console.log("Database connected successfully!")
    } catch (error) {
        console.log(`Database connection failed:\n${error}`)
    }
}

export default connectDB