import { ChatMessage, IChatMessage } from '../models/ChatMessage';

export class ChatService {
  static async saveMessage(roomId: string, username: string, message: string): Promise<IChatMessage> {
    try {
      const chatMessage = new ChatMessage({
        roomId,
        username,
        message,
        timestamp: new Date()
      });
      
      await chatMessage.save();
      console.log(`✅ Saved chat message for room: ${roomId}`);
      return chatMessage;
    } catch (error) {
      console.error('❌ Error saving chat message:', error);
      throw error;
    }
  }

  static async getChatHistory(roomId: string, limit: number = 50): Promise<IChatMessage[]> {
    try {
      const messages = await ChatMessage
        .find({ roomId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .exec();
      
      console.log(`✅ Retrieved ${messages.length} chat messages for room: ${roomId}`);
      return messages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('❌ Error getting chat history:', error);
      throw error;
    }
  }

  static async deleteOldMessages(roomId: string, olderThan: Date): Promise<number> {
    try {
      const result = await ChatMessage.deleteMany({
        roomId,
        timestamp: { $lt: olderThan }
      });
      
      console.log(`✅ Deleted ${result.deletedCount} old messages for room: ${roomId}`);
      return result.deletedCount;
    } catch (error) {
      console.error('❌ Error deleting old messages:', error);
      throw error;
    }
  }
}