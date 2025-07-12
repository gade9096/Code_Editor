import Room, { IRoom, IFileSystemItem } from '../models/Room'
import { v4 as uuidv4 } from 'uuid'

const initialCode = `function sayHi() {
  console.log("👋 Hello world");
}

sayHi()`

const createInitialFileStructure = (): IFileSystemItem => ({
    name: "root",
    id: uuidv4(),
    type: "directory",
    children: [
        {
            id: uuidv4(),
            type: "file",
            name: "index.js",
            content: initialCode,
        },
    ],
})

export class RoomService {
    static async getRoomData(roomId: string): Promise<IRoom | null> {
        try {
            return await Room.findOne({ roomId })
        } catch (error) {
            console.error('Error getting room data:', error)
            return null
        }
    }

    static async createOrUpdateRoom(
        roomId: string, 
        fileStructure?: IFileSystemItem,
        openFiles?: IFileSystemItem[],
        activeFile?: IFileSystemItem | null,
        drawingData?: any
    ): Promise<IRoom | null> {
        try {
            const updateData: any = {}
            
            if (fileStructure) updateData.fileStructure = fileStructure
            if (openFiles) updateData.openFiles = openFiles
            if (activeFile !== undefined) updateData.activeFile = activeFile
            if (drawingData !== undefined) updateData.drawingData = drawingData

            const room = await Room.findOneAndUpdate(
                { roomId },
                updateData,
                { 
                    new: true, 
                    upsert: true,
                    setDefaultsOnInsert: true
                }
            )

            // If this is a new room, initialize with default file structure
            if (!room.fileStructure || !room.fileStructure.children) {
                room.fileStructure = createInitialFileStructure()
                room.openFiles = room.fileStructure.children || []
                room.activeFile = room.openFiles[0] || null
                await room.save()
            }

            return room
        } catch (error) {
            console.error('Error creating/updating room:', error)
            return null
        }
    }

    static async updateFileStructure(
        roomId: string, 
        fileStructure: IFileSystemItem
    ): Promise<boolean> {
        try {
            await Room.findOneAndUpdate(
                { roomId },
                { fileStructure },
                { upsert: true }
            )
            return true
        } catch (error) {
            console.error('Error updating file structure:', error)
            return false
        }
    }

    static async updateOpenFiles(
        roomId: string, 
        openFiles: IFileSystemItem[]
    ): Promise<boolean> {
        try {
            await Room.findOneAndUpdate(
                { roomId },
                { openFiles },
                { upsert: true }
            )
            return true
        } catch (error) {
            console.error('Error updating open files:', error)
            return false
        }
    }

    static async updateActiveFile(
        roomId: string, 
        activeFile: IFileSystemItem | null
    ): Promise<boolean> {
        try {
            await Room.findOneAndUpdate(
                { roomId },
                { activeFile },
                { upsert: true }
            )
            return true
        } catch (error) {
            console.error('Error updating active file:', error)
            return false
        }
    }

    static async updateDrawingData(
        roomId: string, 
        drawingData: any
    ): Promise<boolean> {
        try {
            await Room.findOneAndUpdate(
                { roomId },
                { drawingData },
                { upsert: true }
            )
            return true
        } catch (error) {
            console.error('Error updating drawing data:', error)
            return false
        }
    }

    static async deleteRoom(roomId: string): Promise<boolean> {
        try {
            await Room.deleteOne({ roomId })
            return true
        } catch (error) {
            console.error('Error deleting room:', error)
            return false
        }
    }
}