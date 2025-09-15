import { Room, CreateRoomRequest } from '@/types/room';
import { v4 as uuidv4 } from 'uuid';

// Armazenamento em memória das salas (em produção, use um banco de dados)
const rooms = new Map<string, Room>();

export class RoomManager {
  static createRoom(request: CreateRoomRequest): Room {
    const room: Room = {
      id: uuidv4(),
      name: request.name,
      isPublic: request.isPublic,
      password: request.password,
      createdAt: new Date(),
      participantCount: 0,
      maxParticipants: request.maxParticipants || 10,
    };

    rooms.set(room.id, room);
    return room;
  }

  static getRoom(roomId: string): Room | undefined {
    return rooms.get(roomId);
  }

  static getRoomByName(name: string): Room | undefined {
    for (const room of rooms.values()) {
      if (room.name === name) {
        return room;
      }
    }
    return undefined;
  }

  static getPublicRooms(): Room[] {
    return Array.from(rooms.values()).filter(room => room.isPublic);
  }

  static deleteRoom(roomId: string): boolean {
    return rooms.delete(roomId);
  }

  static updateParticipantCount(roomId: string, count: number): void {
    const room = rooms.get(roomId);
    if (room) {
      room.participantCount = count;
    }
  }

  static validateRoomAccess(roomId: string, password?: string): boolean {
    const room = rooms.get(roomId);
    if (!room) return false;

    if (room.isPublic) return true;
    
    return room.password === password;
  }

  static getAllRooms(): Room[] {
    return Array.from(rooms.values());
  }
}