'use client';

import { useState, useEffect } from 'react';
import { Room, RoomEvent, DisconnectReason } from 'livekit-client';

export interface UseRoomStateReturn {
  isConnected: boolean;
  isReconnecting: boolean;
  error: string | null;
  participantCount: number;
}

export function useRoomState(room: Room | undefined): UseRoomStateReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    if (!room) return;

    const handleConnected = () => {
      setIsConnected(true);
      setIsReconnecting(false);
      setError(null);
      setParticipantCount(room.numParticipants); // Total participants including local
    };

    const handleDisconnected = (reason?: DisconnectReason) => {
      setIsConnected(false);
      setIsReconnecting(false);
      
      if (reason) {
        switch (reason) {
          case DisconnectReason.ROOM_DELETED:
            setError('A sala foi encerrada');
            break;
          case DisconnectReason.PARTICIPANT_REMOVED:
            setError('Você foi removido da sala');
            break;
          case DisconnectReason.CLIENT_INITIATED:
            setError(null); // User left intentionally
            break;
          default:
            setError('Conexão perdida');
        }
      }
    };

    const handleReconnecting = () => {
      setIsReconnecting(true);
      setError(null);
    };

    const handleReconnected = () => {
      setIsReconnecting(false);
      setIsConnected(true);
      setError(null);
    };

    const handleParticipantConnected = () => {
      setParticipantCount(room.numParticipants);
    };

    const handleParticipantDisconnected = () => {
      setParticipantCount(room.numParticipants);
    };

    // Add event listeners
    room.on(RoomEvent.Connected, handleConnected);
    room.on(RoomEvent.Disconnected, handleDisconnected);
    room.on(RoomEvent.Reconnecting, handleReconnecting);
    room.on(RoomEvent.Reconnected, handleReconnected);
    room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
    room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);

    // Initial state
    if (room.state === 'connected') {
      handleConnected();
    }

    return () => {
      room.off(RoomEvent.Connected, handleConnected);
      room.off(RoomEvent.Disconnected, handleDisconnected);
      room.off(RoomEvent.Reconnecting, handleReconnecting);
      room.off(RoomEvent.Reconnected, handleReconnected);
      room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
      room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
    };
  }, [room]);

  return {
    isConnected,
    isReconnecting,
    error,
    participantCount,
  };
}