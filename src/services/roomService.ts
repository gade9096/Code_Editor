import { Room, IRoom } from '../models/Room';

export class RoomService {
  static async findOrCreateRoom(roomId: string): Promise<IRoom> {
    try {
      let room = await Room.findOne({ roomId });
      
      if (!room) {
        room = new Room({ roomId });
        await room.save();
        console.log(`✅ Created new room: ${roomId}`);
      } else {
        // Update last activity
        room.lastActivity = new Date();
        await room.save();
        console.log(`✅ Found existing room: ${roomId}`);
      }
      
      return room;
    } catch (error) {
      console.error('❌ Error finding/creating room:', error);
      throw error;
    }
  }

  static async updateFileStructure(roomId: string, fileStructure: any): Promise<void> {
    try {
      await Room.findOneAndUpdate(
        { roomId },
        { 
          fileStructure,
          lastActivity: new Date()
        },
        { upsert: true }
      );
      console.log(`✅ Updated file structure for room: ${roomId}`);
    } catch (error) {
      console.error('❌ Error updating file structure:', error);
      throw error;
    }
  }

  static async updateOpenFiles(roomId: string, openFiles: any[]): Promise<void> {
    try {
      await Room.findOneAndUpdate(
        { roomId },
        { 
          openFiles,
          lastActivity: new Date()
        },
        { upsert: true }
      );
      console.log(`✅ Updated open files for room: ${roomId}`);
    } catch (error) {
      console.error('❌ Error updating open files:', error);
      throw error;
    }
  }

  static async updateActiveFile(roomId: string, activeFile: string | null): Promise<void> {
    try {
      await Room.findOneAndUpdate(
        { roomId },
        { 
          activeFile,
          lastActivity: new Date()
        },
        { upsert: true }
      );
      console.log(`✅ Updated active file for room: ${roomId}`);
    } catch (error) {
      console.error('❌ Error updating active file:', error);
      throw error;
    }
  }

  static async updateDrawingData(roomId: string, drawingData: any): Promise<void> {
    try {
      await Room.findOneAndUpdate(
        { roomId },
        { 
          drawingData,
          lastActivity: new Date()
        },
        { upsert: true }
      );
      console.log(`✅ Updated drawing data for room: ${roomId}`);
    } catch (error) {
      console.error('❌ Error updating drawing data:', error);
      throw error;
    }
  }

  static async getRoomData(roomId: string): Promise<IRoom | null> {
    try {
      const room = await Room.findOne({ roomId });
      if (room) {
        // Update last activity
        room.lastActivity = new Date();
        await room.save();
      }
      return room;
    } catch (error) {
      console.error('❌ Error getting room data:', error);
      throw error;
    }
  }
}