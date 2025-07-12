import mongoose, { Document, Schema } from 'mongoose'

export interface IChatMessage extends Document {
    roomId: string
    messageId: string
    message: string
    username: string
    timestamp: string
    createdAt: Date
}

const ChatMessageSchema = new Schema<IChatMessage>({
    roomId: { 
        type: String, 
        required: true,
        index: true 
    },
    messageId: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    username: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: String, 
        required: true 
    }
}, {
    timestamps: true
})

// TTL index to automatically delete messages after 24 hours
ChatMessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 })

export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema)