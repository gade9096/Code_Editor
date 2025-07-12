import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  roomId: string;
  username: string;
  message: string;
  timestamp: Date;
  createdAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>({
  roomId: {
    type: String,
    required: true,
    index: true
  },
  username: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// TTL index to automatically delete messages after 24 hours
chatMessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);