import mongoose from "mongoose"

const Schema = mongoose.Schema

const ChatSession = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true})

export default mongoose.model("ChatSession", ChatSession)