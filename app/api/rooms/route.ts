import { NextRequest, NextResponse } from 'next/server';
import { RoomManager } from '@/lib/room-manager';
import { CreateRoomRequest } from '@/types/room';

export async function POST(request: NextRequest) {
  try {
    const body: CreateRoomRequest = await request.json();


    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nome da sala é obrigatório' },
        { status: 400 }
      );
    }


    const existingRoom = RoomManager.getRoomByName(body.name);
    if (existingRoom) {
      return NextResponse.json(
        { error: 'Já existe uma sala com este nome' },
        { status: 400 }
      );
    }


    if (!body.isPublic && (!body.password || body.password.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Senha é obrigatória para salas privadas' },
        { status: 400 }
      );
    }

    if (body.maxParticipants !== undefined) {
      if (typeof body.maxParticipants !== 'number' || body.maxParticipants < 1 || body.maxParticipants > 50) {
        return NextResponse.json(
          { error: 'Máximo de participantes deve ser entre 1 e 50' },
          { status: 400 }
        );
      }
    }

    const room = RoomManager.createRoom(body);


    const roomResponse = {
      id: room.id,
      name: room.name,
      isPublic: room.isPublic,
      createdAt: room.createdAt,
      participantCount: room.participantCount,
      maxParticipants: room.maxParticipants,
    };

    return NextResponse.json(roomResponse, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar sala:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const publicRooms = RoomManager.getPublicRooms();

    const roomsResponse = publicRooms.map(room => ({
      id: room.id,
      name: room.name,
      isPublic: room.isPublic,
      createdAt: room.createdAt,
      participantCount: room.participantCount,
      maxParticipants: room.maxParticipants,
    }));

    return NextResponse.json(roomsResponse);
  } catch (error) {
    console.error('Erro ao buscar salas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}