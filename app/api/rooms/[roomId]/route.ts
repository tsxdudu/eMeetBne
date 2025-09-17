import { NextRequest, NextResponse } from 'next/server';
import { RoomManager } from '@/lib/room-manager';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;

    const room = RoomManager.getRoom(roomId);
    if (!room) {
      return NextResponse.json(
        { error: 'Sala não encontrada' },
        { status: 404 }
      );
    }


    const roomInfo = {
      id: room.id,
      name: room.name,
      isPublic: room.isPublic,
      createdAt: room.createdAt,
      participantCount: room.participantCount,
      maxParticipants: room.maxParticipants,
    };

    return NextResponse.json(roomInfo);
  } catch (error) {
    console.error('Erro ao buscar sala:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;

    const deleted = RoomManager.deleteRoom(roomId);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Sala não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Sala removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover sala:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}