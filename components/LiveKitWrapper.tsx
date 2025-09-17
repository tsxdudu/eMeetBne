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
      room.localParticipant.setCameraEnabled(true);
    }

    return () => {

    };
  }, [room]);

  return <>{children}</>;
}