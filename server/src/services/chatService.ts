import ChatMessage, { IChatMessage } from '../models/ChatMessage'

export class ChatService {
    static async saveMessage(
        roomId: string,
        messageId: string,
        message: string,
        username: string,
        timestamp: string
    ): Promise<IChatMessage | null> {
        try {
            const chatMessage = new ChatMessage({
                roomId,
                messageId,
                message,
                username,
                timestamp
            })
            
            return await chatMessage.save()
        } catch (error) {
            console.error('Error saving chat message:', error)
            return null
        }
    }

    static async getRoomMessages(roomId: string, limit: number = 50): Promise<IChatMessage[]> {
        try {
            return await ChatMessage
                .find({ roomId })
                .sort({ createdAt: -1 })
                .limit(limit)
                .exec()
        } catch (error) {
            console.error('Error getting room messages:', error)
            return []
        }
    }

    static async deleteRoomMessages(roomId: string): Promise<boolean> {
        try {
            await ChatMessage.deleteMany({ roomId })
            return true
        } catch (error) {
            console.error('Error deleting room messages:', error)
            return false
        }
    }
}