import { messageRoles } from "./message.enum.js"

import mongoose from "mongoose"

const Schema = mongoose.Schema

const Message = new Schema({
    chatSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatSession",
        required: true
    },
    role: {
        type: String,
        enum: [messageRoles.USER, messageRoles.BOT],
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
}, {timestamps: true})

export default mongoose.model("Message", Message)