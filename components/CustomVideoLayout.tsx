'use client';

import { useState, useEffect } from 'react';
import { 
  useParticipants, 
  useTracks,
  VideoTrack,
  ParticipantName,
  useIsSpeaking,
  TrackReferenceOrPlaceholder
} from '@livekit/components-react';
import { Track, Participant } from 'livekit-client';

function SidebarParticipantCard({ participant, videoTrack }: { 
  participant: Participant; 
  videoTrack: TrackReferenceOrPlaceholder | undefined; 
}) {
  const isSpeaking = useIsSpeaking(participant);
  const shouldShowVideo = videoTrack?.publication && participant.isCameraEnabled;
  
  return (
    <div 
      className={`relative bg-gray-700 rounded-lg overflow-hidden h-32 transition-all duration-200 ${
        isSpeaking ? 'ring-3 ring-green-500 ring-opacity-80' : ''
      }`}
    >
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
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {(participant.name || participant.identity).charAt(0).toUpperCase()}
          </div>
        </div>
      )}
      
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
        <ParticipantName participant={participant} />
        {participant.isLocal && ' (Você)'}
      </div>
      
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
}

function ParticipantCard({ participant, videoTrack }: { 
  participant: Participant; 
  videoTrack: TrackReferenceOrPlaceholder | undefined; 
}) {
  const isSpeaking = useIsSpeaking(participant);
  const shouldShowVideo = videoTrack?.publication && participant.isCameraEnabled;
  
  return (
    <div 
      className={`relative rounded-lg overflow-hidden bg-gray-800 transition-all duration-200 ${
        isSpeaking ? 'ring-4 ring-green-500 ring-opacity-80' : ''
      }`}
    >
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
}

export function CustomVideoLayout() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedScreenShare, setSelectedScreenShare] = useState<number>(0);
  const participants = useParticipants();
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  const screenShareTracks = tracks.filter(track => 
    track.source === Track.Source.ScreenShare && track.publication
  );

  const hasScreenShare = screenShareTracks.length > 0;

  useEffect(() => {
    if (selectedScreenShare >= screenShareTracks.length) {
      setSelectedScreenShare(0);
    }
  }, [screenShareTracks.length, selectedScreenShare]);
  useEffect(() => {
    if (isFullscreen && screenShareTracks.length > 0) {
    }
  }, [isFullscreen, screenShareTracks]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'auto';
    };
  }, [isFullscreen]);

  if (hasScreenShare) {
    if (isFullscreen) {
      return (
        <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col transition-all duration-300 w-screen h-screen">
          <div className="flex-1 flex items-center justify-center p-2">
            {screenShareTracks[selectedScreenShare] && (
                <div className="relative max-w-[98vw] max-h-[96vh] w-auto h-auto cursor-pointer flex items-center justify-center">
                {screenShareTracks[selectedScreenShare].publication && (
                  <VideoTrack 
                    trackRef={{
                      participant: screenShareTracks[selectedScreenShare].participant,
                      source: screenShareTracks[selectedScreenShare].source,
                      publication: screenShareTracks[selectedScreenShare].publication
                    }}
                    className="max-w-full max-h-full object-contain transition-all duration-300 livekit-video-fullscreen block"
                    onClick={toggleFullscreen}
                    style={{
                      imageRendering: 'crisp-edges'
                    }}
                    {...({
                      onLoadedMetadata: (e: React.SyntheticEvent<HTMLVideoElement>) => {
                        const video = e.target as HTMLVideoElement;
                        if (video) {
                          video.setAttribute('playsinline', 'true');
                          video.setAttribute('webkit-playsinline', 'true');
                            video.style.objectFit = 'contain';
                            video.style.width = 'auto';
                            video.style.height = 'auto';
                            video.style.maxWidth = '100vw';
                            video.style.maxHeight = '100vh';
                            video.style.willChange = 'auto';
                        }
                      }
                    })}
                  />
                )}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
                  {screenShareTracks[selectedScreenShare].participant.name || screenShareTracks[selectedScreenShare].participant.identity} está compartilhando - Clique ou pressione ESC para sair do modo tela cheia
                </div>
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg hover:bg-opacity-90 transition-all backdrop-blur-sm"
                  title="Sair do modo tela cheia (ESC)"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {/* Miniatura das outras telas compartilhadas */}
          {screenShareTracks.length > 1 && (
            <div className="bg-gray-800 p-2 border-t border-gray-700">
              <div className="flex space-x-2 overflow-x-auto">
                {screenShareTracks.map((track, index) => (
                  <div 
                    key={track.participant.identity} 
                    className={`relative flex-shrink-0 w-32 h-20 cursor-pointer rounded border-2 transition-all ${
                      index === selectedScreenShare ? 'border-blue-500' : 'border-gray-600 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedScreenShare(index)}
                  >
                    {track.publication && (
                      <VideoTrack 
                        trackRef={{
                          participant: track.participant,
                          source: track.source,
                          publication: track.publication
                        }}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      {(track.participant.name || track.participant.identity).substring(0, 8)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    const screenShareCount = screenShareTracks.length;
    let screenGridClass = '';
    if (screenShareCount === 1) {
      screenGridClass = 'grid-cols-1';
    } else if (screenShareCount === 2) {
      screenGridClass = 'grid-cols-2';
    } else if (screenShareCount <= 4) {
      screenGridClass = 'grid-cols-2';
    } else {
      screenGridClass = 'grid-cols-3';
    }

    return (
      <div className="h-full flex transition-all duration-300">
        <div className="flex-1 bg-gray-900 p-4">
          <div className={`grid ${screenGridClass} gap-4 h-full`}>
            {screenShareTracks.map((track) => (
              <div key={track.participant.identity} className="relative cursor-pointer group bg-gray-800 rounded-lg overflow-hidden">
                {track.publication && (
                  <VideoTrack 
                    trackRef={{
                      participant: track.participant,
                      source: track.source,
                      publication: track.publication
                    }}
                    className="w-full h-full object-contain hover:opacity-95 transition-all duration-200 livekit-video-grid"
                    onClick={() => {
                      setSelectedScreenShare(screenShareTracks.indexOf(track));
                      toggleFullscreen();
                    }}
                    style={{
                      imageRendering: 'crisp-edges'
                    }}
                    {...({
                      onLoadedMetadata: (e: React.SyntheticEvent<HTMLVideoElement>) => {
                        const video = e.target as HTMLVideoElement;
                        if (video) {
                          video.setAttribute('playsinline', 'true');
                          video.style.objectFit = 'contain';
                          video.style.imageRendering = 'crisp-edges';
                        }
                      }
                    })}
                  />
                )}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
                  {track.participant.name || track.participant.identity} está compartilhando - Clique para tela cheia
                </div>
                <button
                  onClick={() => {
                    setSelectedScreenShare(screenShareTracks.indexOf(track));
                    toggleFullscreen();
                  }}
                  className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg hover:bg-opacity-90 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  title="Modo tela cheia"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-80 bg-gray-800 p-4 overflow-y-auto">
          <div className="space-y-3">
            {participants.map((participant) => {
              const videoTrack = tracks.find(
                track => track.participant.identity === participant.identity && 
                track.source === Track.Source.Camera && track.publication
              );
              
              return (
                <SidebarParticipantCard
                  key={participant.identity}
                  participant={participant}
                  videoTrack={videoTrack}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const participantCount = participants.length;
  
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
          const videoTrack = tracks.find(
            track => track.participant.identity === participant.identity && 
            track.source === Track.Source.Camera && track.publication
          );
          
          return (
            <ParticipantCard 
              key={participant.identity}
              participant={participant}
              videoTrack={videoTrack}
            />
          );
        })}
      </div>
      
      {participantCount > 12 && (
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded-lg">
          +{participantCount - 12} participantes
        </div>
      )}
    </div>
  );
}