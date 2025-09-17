import { NextRequest, NextResponse } from 'next/server';
import { RoomManager } from '@/lib/room-manager';
import { createLiveKitToken } from '@/lib/livekit-token';
import { JoinRoomRequest, LiveKitTokenResponse } from '@/types/room';

export async function POST(request: NextRequest) {
  try {
    const body: JoinRoomRequest = await request.json();

    if (!body.roomId || !body.userName) {
      return NextResponse.json(
        { error: 'ID da sala e nome do usuário são obrigatórios' },
        { status: 400 }
      );
    }

    const room = RoomManager.getRoom(body.roomId);
    if (!room) {
      return NextResponse.json(
        { error: 'Sala não encontrada' },
        { status: 404 }
      );
    }

    if (room.participantCount >= room.maxParticipants) {
      return NextResponse.json(
        { error: 'Sala lotada' },
        { status: 400 }
      );
    }

    if (!RoomManager.validateRoomAccess(body.roomId, body.password)) {
      return NextResponse.json(
        { error: 'Senha incorreta ou acesso negado' },
        { status: 403 }
      );
    }


    const token = await createLiveKitToken(room.id, body.userName);

    const response: LiveKitTokenResponse = {
      token,
      url: process.env.LIVEKIT_URL!,
      roomName: room.id,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao entrar na sala:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}