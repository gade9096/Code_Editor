import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  roomId: string;
  fileStructure: any;
  openFiles: any[];
  activeFile: string | null;
  drawingData: any;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>({
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fileStructure: {
    type: Schema.Types.Mixed,
    default: {
      id: 'root',
      name: 'root',
      type: 'folder',
      children: [
        {
          id: 'main.js',
          name: 'main.js',
          type: 'file',
          content: '// Welcome to Code Sync!\n// Start coding together...\n\nconsole.log("Hello, World!");'
        }
      ]
    }
  },
  openFiles: {
    type: [Schema.Types.Mixed],
    default: []
  },
  activeFile: {
    type: String,
    default: null
  },
  drawingData: {
    type: Schema.Types.Mixed,
    default: null
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// TTL index to automatically delete rooms after 24 hours of inactivity
roomSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 86400 });

export const Room = mongoose.model<IRoom>('Room', roomSchema);