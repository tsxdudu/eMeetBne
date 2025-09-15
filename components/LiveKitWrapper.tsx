'use client';

import { useEffect } from 'react';
import { Room } from 'livekit-client';

interface LiveKitWrapperProps {
  children: React.ReactNode;
  room?: Room;
}

export function LiveKitWrapper({ children, room }: LiveKitWrapperProps) {
  useEffect(() => {
    if (room) {
      // Configurações adicionais para o room
      room.on('participantConnected', (participant) => {
        console.log('Participante conectado:', participant.identity);
      });

      room.on('participantDisconnected', (participant) => {
        console.log('Participante desconectado:', participant.identity);
      });

      room.on('trackSubscribed', (track, publication, participant) => {
        console.log('Track subscribed:', track.kind, participant.identity);
      });

      room.on('trackUnsubscribed', (track, publication, participant) => {
        console.log('Track unsubscribed:', track.kind, participant.identity);
      });

      // Configurar opções de vídeo
      room.localParticipant.setCameraEnabled(true);
    }

    return () => {
      // Cleanup listeners se necessário
    };
  }, [room]);

  return <>{children}</>;
}