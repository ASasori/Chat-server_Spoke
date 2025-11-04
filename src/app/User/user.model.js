import mongoose from "mongoose"

const Schema = mongoose.Schema

const User = new Schema({
    username: { 
        type: String,
        required: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true})

export default mongoose.model("User", User)