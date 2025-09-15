'use client';

import { 
  useParticipants, 
  useTracks,
  VideoTrack,
  ParticipantName
} from '@livekit/components-react';
import { Track } from 'livekit-client';

export function CustomVideoLayout() {
  const participants = useParticipants();
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  // Separar tracks de tela compartilhada
  const screenShareTracks = tracks.filter(track => 
    track.source === Track.Source.ScreenShare && track.publication
  );

  const hasScreenShare = screenShareTracks.length > 0;

  if (hasScreenShare) {
    // Layout com compartilhamento de tela
    return (
      <div className="h-full flex">
        {/* Área principal - Tela compartilhada */}
        <div className="flex-1 bg-gray-900 flex items-center justify-center p-4">
          {screenShareTracks.map((track) => (
            <div key={track.participant.identity} className="relative w-full h-full">
              {track.publication && (
                <VideoTrack 
                  trackRef={{
                    participant: track.participant,
                    source: track.source,
                    publication: track.publication
                  }}
                  className="w-full h-full object-contain rounded-lg"
                />
              )}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg text-sm">
                {track.participant.name || track.participant.identity} está compartilhando
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar direita - Participantes */}
        <div className="w-80 bg-gray-800 p-4 overflow-y-auto">
          <div className="space-y-3">
            {participants.map((participant) => {
              // Buscar o track de vídeo do participante
              const videoTrack = tracks.find(
                track => track.participant.identity === participant.identity && 
                track.source === Track.Source.Camera && track.publication
              );
              
              // Verificar se a câmera está habilitada
              const shouldShowVideo = videoTrack?.publication && participant.isCameraEnabled;
              
              return (
                <div key={participant.identity} className="relative bg-gray-700 rounded-lg overflow-hidden h-32">
                  {shouldShowVideo ? (
                    <VideoTrack 
                      trackRef={{
                        participant: videoTrack.participant,
                        source: videoTrack.source,
                        publication: videoTrack.publication
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-600">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {(participant.name || participant.identity).charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                    <ParticipantName participant={participant} />
                    {participant.isLocal && ' (Você)'}
                  </div>
                  
                  {/* Indicadores de mute */}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    {!participant.isMicrophoneEnabled && (
                      <div className="bg-red-600 p-1 rounded-full">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    {!participant.isCameraEnabled && (
                      <div className="bg-red-600 p-1 rounded-full">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A2 2 0 0017 13V7a2 2 0 00-2-2h-3.382l-.724-.447A1 1 0 0010 4H6.382l-.724-.447A1 1 0 004 3H1a1 1 0 000 2h3.382l.724.447A1 1 0 006 6h4c.218 0 .424-.07.594-.2L12 4.8V13l1.707 1.707zM3 7a2 2 0 00-2 2v4a2 2 0 002 2h8a2 2 0 002-2v-1.586L10.414 9H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Layout em grid normal (sem compartilhamento de tela)
  const participantCount = participants.length;
  
  // Determinar o layout baseado no número de participantes
  let gridClass = '';
  if (participantCount === 1) {
    gridClass = 'grid-cols-1 grid-rows-1';
  } else if (participantCount === 2) {
    gridClass = 'grid-cols-2 grid-rows-1';
  } else if (participantCount <= 4) {
    gridClass = 'grid-cols-2 grid-rows-2';
  } else if (participantCount <= 6) {
    gridClass = 'grid-cols-3 grid-rows-2';
  } else if (participantCount <= 9) {
    gridClass = 'grid-cols-3 grid-rows-3';
  } else {
    gridClass = 'grid-cols-4 grid-rows-3';
  }

  return (
    <div className="h-full bg-gray-900 p-4">
      <div className={`grid ${gridClass} gap-4 h-full`}>
        {participants.slice(0, 12).map((participant) => {
          // Buscar o track de vídeo do participante
          const videoTrack = tracks.find(
            track => track.participant.identity === participant.identity && 
            track.source === Track.Source.Camera && track.publication
          );
          
          // Verificar se a câmera está habilitada
          const shouldShowVideo = videoTrack?.publication && participant.isCameraEnabled;
          
          return (
            <div key={participant.identity} className="relative rounded-lg overflow-hidden bg-gray-800">
              {shouldShowVideo ? (
                <VideoTrack 
                  trackRef={{
                    participant: videoTrack.participant,
                    source: videoTrack.source,
                    publication: videoTrack.publication
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                    {(participant.name || participant.identity).charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
              
              <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg text-sm">
                <ParticipantName participant={participant} />
                {participant.isLocal && ' (Você)'}
              </div>
              
              {/* Indicadores de áudio/vídeo */}
              <div className="absolute top-3 right-3 flex space-x-1">
                {!participant.isMicrophoneEnabled && (
                  <div className="bg-red-600 p-1 rounded-full">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {!participant.isCameraEnabled && (
                  <div className="bg-red-600 p-1 rounded-full">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A2 2 0 0017 13V7a2 2 0 00-2-2h-3.382l-.724-.447A1 1 0 0010 4H6.382l-.724-.447A1 1 0 004 3H1a1 1 0 000 2h3.382l.724.447A1 1 0 006 6h4c.218 0 .424-.07.594-.2L12 4.8V13l1.707 1.707zM3 7a2 2 0 00-2 2v4a2 2 0 002 2h8a2 2 0 002-2v-1.586L10.414 9H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mostrar indicador se há mais participantes */}
      {participantCount > 12 && (
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded-lg">
          +{participantCount - 12} participantes
        </div>
      )}
    </div>
  );
}