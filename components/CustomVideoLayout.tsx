'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  useParticipants, 
  useTracks,
  VideoTrack,
  ParticipantName,
  useIsSpeaking,
  TrackReferenceOrPlaceholder
} from '@livekit/components-react';
import { Track, Participant } from 'livekit-client';

interface VolumeModalState {
  isOpen: boolean;
  participant: Participant | null;
  position: { x: number; y: number };
  volume: number;
  isMuted: boolean;
}

function VolumeModal({ 
  isOpen, 
  participant, 
  position, 
  volume, 
  isMuted, 
  onVolumeChange, 
  onMuteToggle, 
  onClose 
}: {
  isOpen: boolean;
  participant: Participant | null;
  position: { x: number; y: number };
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !participant) return null;

  return (
    <div 
      ref={modalRef}
      className="fixed bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-4 z-50 min-w-[220px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
        .slider {
          background: linear-gradient(to right, #3b82f6 0%, #3b82f6 ${isMuted ? 0 : (volume / 2)}%, #4b5563 ${isMuted ? 0 : (volume / 2)}%, #4b5563 100%);
        }
      `}</style>
      <div className="flex items-center justify-between mb-3">
        <span className="text-white text-sm font-medium">
          {participant.name || participant.identity}
        </span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={onMuteToggle}
            className={`p-2 rounded-full transition-colors ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
            title={isMuted ? 'Ativar áudio' : 'Silenciar'}
          >
            {isMuted ? (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <span className="text-white text-sm">
            {isMuted ? 'Silenciado' : 'Volume'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-xs">0%</span>
          <input
            type="range"
            min="0"
            max="200"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseInt(e.target.value))}
            disabled={isMuted}
            className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed slider"
          />
          <span className="text-gray-400 text-xs">200%</span>
        </div>
        
        <div className="text-center text-xs text-gray-400">
          {isMuted ? '0%' : `${volume}%`}
        </div>
      </div>
    </div>
  );
}

function SidebarParticipantCard({ 
  participant, 
  videoTrack, 
  onContextMenu 
}: { 
  participant: Participant; 
  videoTrack: TrackReferenceOrPlaceholder | undefined; 
  onContextMenu: (event: React.MouseEvent, participant: Participant) => void;
}) {
  const isSpeaking = useIsSpeaking(participant);
  const shouldShowVideo = videoTrack?.publication && participant.isCameraEnabled;
  
  return (
    <div 
      className={`relative bg-gray-700 rounded-lg overflow-hidden h-32 transition-all duration-200 ${
        isSpeaking ? 'ring-3 ring-green-500 ring-opacity-80' : ''
      }`}
      onContextMenu={(e) => onContextMenu(e, participant)}
      data-lk-participant-identity={participant.identity}
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

function ParticipantCard({ 
  participant, 
  videoTrack, 
  onContextMenu 
}: { 
  participant: Participant; 
  videoTrack: TrackReferenceOrPlaceholder | undefined; 
  onContextMenu: (event: React.MouseEvent, participant: Participant) => void;
}) {
  const isSpeaking = useIsSpeaking(participant);
  const shouldShowVideo = videoTrack?.publication && participant.isCameraEnabled;
  
  return (
    <div 
      className={`relative rounded-lg overflow-hidden bg-gray-800 transition-all duration-200 ${
        isSpeaking ? 'ring-4 ring-green-500 ring-opacity-80' : ''
      }`}
      onContextMenu={(e) => onContextMenu(e, participant)}
      data-lk-participant-identity={participant.identity}
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
  const [volumeModal, setVolumeModal] = useState<VolumeModalState>({
    isOpen: false,
    participant: null,
    position: { x: 0, y: 0 },
    volume: 100,
    isMuted: false
  });
  const [participantVolumes, setParticipantVolumes] = useState<Map<string, { volume: number; isMuted: boolean }>>(new Map());
  const [audioContexts, setAudioContexts] = useState<Map<string, { context: AudioContext; gainNode: GainNode; source: MediaElementAudioSourceNode }>>(new Map());
  
  const participants = useParticipants();
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  const screenShareTracks = tracks.filter(track => 
    track.source === Track.Source.ScreenShare && track.publication
  );

  const setupAudioContext = useCallback((participantId: string, audioElement: HTMLAudioElement) => {
    try {
      if (audioContexts.has(participantId)) {
        return audioContexts.get(participantId);
      }

      const context = new AudioContext();
      const source = context.createMediaElementSource(audioElement);
      const gainNode = context.createGain();
      
      source.connect(gainNode);
      gainNode.connect(context.destination);

      const audioSetup = { context, gainNode, source };
      setAudioContexts(prev => new Map(prev).set(participantId, audioSetup));
      
      return audioSetup;
    } catch (error) {
      console.warn('Erro ao configurar Web Audio API:', error);
      return null;
    }
  }, [audioContexts, setAudioContexts]);
  const findAudioElement = useCallback(async (participantId: string, maxRetries = 5): Promise<HTMLAudioElement | null> => {
    console.log('🔍 Procurando elemento de áudio para:', participantId);
    const allAudios = document.querySelectorAll('audio');
    console.log('🎵 Total de elementos de áudio encontrados:', allAudios.length);
    allAudios.forEach((audio, index) => {
      console.log(`🎵 Áudio ${index}:`, {
        src: audio.src || 'sem src',
        srcObject: audio.srcObject ? 'tem srcObject' : 'sem srcObject',
        autoplay: audio.autoplay,
        muted: audio.muted,
        volume: audio.volume,
        paused: audio.paused,
        parentElement: audio.parentElement?.className || 'sem parent'
      });
    });

    for (let attempt = 0; attempt < maxRetries; attempt++) {

      let audioElement = document.querySelector(`[data-lk-participant-identity="${participantId}"] audio`) as HTMLAudioElement;
      
      if (!audioElement) {
        const livekitComponents = document.querySelectorAll('[data-lk-participant]');
        for (const component of livekitComponents) {
          const participantAttr = component.getAttribute('data-lk-participant');
          if (participantAttr && participantAttr.includes(participantId)) {
            audioElement = component.querySelector('audio') as HTMLAudioElement;
            if (audioElement) break;
          }
        }
      }
      
      if (!audioElement && allAudios.length > 0) {
        if (allAudios.length === 1) {
          audioElement = allAudios[0] as HTMLAudioElement;
        }
        else {
          for (const audio of allAudios) {
            if (audio.srcObject && !audio.muted && audio.volume > 0) {
              audioElement = audio as HTMLAudioElement;
              break;
            }
          }
          if (!audioElement) {
            for (const audio of allAudios) {
              if (audio.srcObject) {
                audioElement = audio as HTMLAudioElement;
                break;
              }
            }
          }
        }
      }

      if (audioElement) {
        console.log(`✅ Elemento de áudio encontrado para ${participantId} na tentativa ${attempt + 1}:`, audioElement);
        return audioElement;
      }
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    console.warn(`❌ Elemento de áudio não encontrado para participante ${participantId} após ${maxRetries} tentativas`);
    return null;
  }, []);

  const applyVolumeWithWebAudio = (participantId: string, volume: number, isMuted: boolean) => {
    const audioSetup = audioContexts.get(participantId);
    if (audioSetup) {
      const gainValue = isMuted ? 0 : volume / 100; // Permite volumes > 100%
      audioSetup.gainNode.gain.setValueAtTime(gainValue, audioSetup.context.currentTime);
      return true;
    }
    return false;
  };

  const hasScreenShare = screenShareTracks.length > 0;


  const calculateModalPosition = (event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const modalWidth = 220;
    const modalHeight = 160;
    const padding = 10;
    
   
    let x = rect.left;
    let y = rect.bottom + padding;
    
    if (x + modalWidth > window.innerWidth) {
      x = rect.right - modalWidth;
    }
    
    if (x + modalWidth > window.innerWidth) {
      x = window.innerWidth - modalWidth - padding;
    }
    
    if (y + modalHeight > window.innerHeight) {
      y = rect.top - modalHeight - padding;
    }
    

    if (y < 0) {
      y = (window.innerHeight - modalHeight) / 2;
    }
    
  
    x = Math.max(padding, x);
    y = Math.max(padding, y);
    
    return { x, y };
  };

  const handleContextMenu = (event: React.MouseEvent, participant: Participant) => {
    event.preventDefault();
    
    // Não permitir controle de volume do próprio usuário
    if (participant.isLocal) {
      return;
    }
    
    const position = calculateModalPosition(event);
    const currentSettings = participantVolumes.get(participant.identity) || { volume: 100, isMuted: false };
    
    setVolumeModal({
      isOpen: true,
      participant,
      position,
      volume: currentSettings.volume,
      isMuted: currentSettings.isMuted
    });
  };

  
  const closeVolumeModal = () => {
    setVolumeModal(prev => ({ ...prev, isOpen: false, participant: null }));
  };

  // Função para alterar volume
  const handleVolumeChange = async (newVolume: number) => {
    if (!volumeModal.participant) return;
    
    const participantId = volumeModal.participant.identity;
    setParticipantVolumes(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(participantId) || { volume: 100, isMuted: false };
      newMap.set(participantId, { ...current, volume: newVolume });
      return newMap;
    });
    
    setVolumeModal(prev => ({ ...prev, volume: newVolume }));

    try {
      const audioElement = await findAudioElement(participantId);

      if (audioElement) {
        // Tentar usar Web Audio API primeiro (permite volume > 100%)
        if (!applyVolumeWithWebAudio(participantId, newVolume, false)) {
          // Fallback para controle HTML5 padrão (limitado a 100%)
          const volumeLevel = Math.min(newVolume / 100, 1);
          audioElement.volume = volumeLevel;
          
          // Se o volume desejado é > 100%, configurar Web Audio API
          if (newVolume > 100) {
            const audioSetup = setupAudioContext(participantId, audioElement);
            if (audioSetup) {
              audioSetup.gainNode.gain.setValueAtTime(newVolume / 100, audioSetup.context.currentTime);
            }
          }
        }
        
        // Forçar atualização
        audioElement.muted = false;
        
        console.log(`Volume ajustado para ${participantId}: ${newVolume}%`);
      } else {
        console.warn(`Não foi possível encontrar elemento de áudio para ${participantId}`);
      }
    } catch (error) {
      console.warn('Erro ao ajustar volume:', error);
    }
  };

  const handleMuteToggle = async () => {
    if (!volumeModal.participant) return;
    
    const participantId = volumeModal.participant.identity;
    const newMutedState = !volumeModal.isMuted;
    
    setParticipantVolumes(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(participantId) || { volume: 100, isMuted: false };
      newMap.set(participantId, { ...current, isMuted: newMutedState });
      return newMap;
    });
    
    setVolumeModal(prev => ({ ...prev, isMuted: newMutedState }));
    
    try {
      const audioElement = await findAudioElement(participantId);

      if (audioElement) {
        if (newMutedState) {
          // Mutar: usar Web Audio API primeiro, depois fallback
          if (!applyVolumeWithWebAudio(participantId, 0, true)) {
            audioElement.muted = true;
            audioElement.volume = 0;
          }
        } else {
          // Desmutar: restaurar propriedades
          const currentSettings = participantVolumes.get(participantId) || { volume: 100, isMuted: false };
          
          if (!applyVolumeWithWebAudio(participantId, currentSettings.volume, false)) {
            audioElement.muted = false;
            audioElement.volume = Math.min(currentSettings.volume / 100, 1);
            
            // Se o volume é > 100%, configurar Web Audio API
            if (currentSettings.volume > 100) {
              const audioSetup = setupAudioContext(participantId, audioElement);
              if (audioSetup) {
                audioSetup.gainNode.gain.setValueAtTime(currentSettings.volume / 100, audioSetup.context.currentTime);
              }
            }
          }
        }
        
        console.log(`Mute ${newMutedState ? 'ativado' : 'desativado'} para ${participantId}`);
      } else {
        console.warn(`Não foi possível encontrar elemento de áudio para ${participantId}`);
      }
    } catch (error) {
      console.warn('Erro ao alterar mute:', error);
    }
  };

  useEffect(() => {
    if (selectedScreenShare >= screenShareTracks.length) {
      setSelectedScreenShare(0);
    }
  }, [screenShareTracks.length, selectedScreenShare]);


  useEffect(() => {
    const applyVolumeSettings = async () => {
      for (const participant of participants) {
        const settings = participantVolumes.get(participant.identity);
        if (settings && !participant.isLocal) { // Não aplicar ao usuário local
          try {
            const audioElement = await findAudioElement(participant.identity, 2); // Menos tentativas no useEffect
            
            if (audioElement) {
              if (settings.isMuted) {
                audioElement.muted = true;
                audioElement.volume = 0;
              } else {
                audioElement.muted = false;
                audioElement.volume = Math.min(settings.volume / 100, 1);
                
                // Se volume > 100%, tentar Web Audio API
                if (settings.volume > 100) {
                  const audioSetup = setupAudioContext(participant.identity, audioElement);
                  if (audioSetup) {
                    audioSetup.gainNode.gain.setValueAtTime(settings.volume / 100, audioSetup.context.currentTime);
                  }
                }
              }
            }
          } catch {
            // Silenciar erro se elemento não existir ainda
          }
        }
      }
    };

    applyVolumeSettings();
  }, [participants, participantVolumes, tracks, setupAudioContext, findAudioElement]);
  useEffect(() => {
    if (isFullscreen && screenShareTracks.length > 0) {
      console.log('Fullscreen mode activated - requesting high quality video');
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
      // Ocultar overflow do body quando em modo fullscreen
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar overflow quando sair do modo fullscreen
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
          <div className="flex-1 flex items-center justify-center">
            {screenShareTracks[selectedScreenShare] && (
              <div className="relative w-full h-full cursor-pointer">
                {screenShareTracks[selectedScreenShare].publication && (
                  <VideoTrack 
                    trackRef={{
                      participant: screenShareTracks[selectedScreenShare].participant,
                      source: screenShareTracks[selectedScreenShare].source,
                      publication: screenShareTracks[selectedScreenShare].publication
                    }}
                    className="w-full h-full object-contain transition-all duration-300 livekit-video-fullscreen"
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
                          video.style.width = '100%';
                          video.style.height = '100%';
                          video.style.maxWidth = 'none';
                          video.style.maxHeight = 'none';
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
                  onContextMenu={handleContextMenu}
                />
              );
            })}
          </div>
        </div>

        <VolumeModal
          isOpen={volumeModal.isOpen}
          participant={volumeModal.participant}
          position={volumeModal.position}
          volume={volumeModal.volume}
          isMuted={volumeModal.isMuted}
          onVolumeChange={handleVolumeChange}
          onMuteToggle={handleMuteToggle}
          onClose={closeVolumeModal}
        />
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
              onContextMenu={handleContextMenu}
            />
          );
        })}
      </div>
      
      {participantCount > 12 && (
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded-lg">
          +{participantCount - 12} participantes
        </div>
      )}

      <VolumeModal
        isOpen={volumeModal.isOpen}
        participant={volumeModal.participant}
        position={volumeModal.position}
        volume={volumeModal.volume}
        isMuted={volumeModal.isMuted}
        onVolumeChange={handleVolumeChange}
        onMuteToggle={handleMuteToggle}
        onClose={closeVolumeModal}
      />
    </div>
  );
}