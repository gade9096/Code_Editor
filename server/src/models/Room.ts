import mongoose, { Document, Schema } from 'mongoose'

export interface IFileSystemItem {
    id: string
    name: string
    type: 'file' | 'directory'
    children?: IFileSystemItem[]
    content?: string
    isOpen?: boolean
}

export interface IRoom extends Document {
    roomId: string
    fileStructure: IFileSystemItem
    openFiles: IFileSystemItem[]
    activeFile: IFileSystemItem | null
    drawingData: any
    createdAt: Date
    updatedAt: Date
}

const FileSystemItemSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['file', 'directory'], required: true },
    children: [{ type: Schema.Types.Mixed }],
    content: { type: String },
    isOpen: { type: Boolean, default: false }
}, { _id: false })

const RoomSchema = new Schema<IRoom>({
    roomId: { 
        type: String, 
        required: true, 
        unique: true,
        index: true 
    },
    fileStructure: { 
        type: FileSystemItemSchema, 
        required: true 
    },
    openFiles: [FileSystemItemSchema],
    activeFile: { 
        type: FileSystemItemSchema, 
        default: null 
    },
    drawingData: { 
        type: Schema.Types.Mixed, 
        default: null 
    }
}, {
    timestamps: true
})

// TTL index to automatically delete rooms after 24 hours of inactivity
RoomSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 })

export default mongoose.model<IRoom>('Room', RoomSchema)