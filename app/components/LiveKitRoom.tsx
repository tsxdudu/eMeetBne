import { useEffect, useRef, useState } from "react";
import type { Room, RemoteAudioTrack, RemoteParticipant, RemoteTrack, RemoteTrackPublication } from "livekit-client";

type Props = {
  serverUrl?: string;
  token?: string;
  name?: string | null;
  onParticipantsChange?: (participants: string[]) => void;
  onRoomInstance?: (room: Room | null) => void;
};

export default function LiveKitRoom({ serverUrl, token, name, onParticipantsChange, onRoomInstance }: Props) {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [mediaPermission, setMediaPermission] = useState<boolean | null>(null);
  const roomRef = useRef<Room | null>(null);
  const audioContainerRef = useRef<HTMLDivElement | null>(null);
  const [remoteParticipantsList, setRemoteParticipantsList] = useState<string[]>([]);

  useEffect(() => {
    const autoConnect = async () => {
      if (serverUrl && token && name && !connected && !connecting && mediaPermission !== false) {
        const hasPermission = await testMediaPermissions();
        if (hasPermission) {
          if (!token || !serverUrl) return;
          
          setConnecting(true);
          try {
            const lk = await import("livekit-client");
            const { Room } = lk as unknown as typeof import("livekit-client");
            
            const room = new Room({
              adaptiveStream: true,
              dynacast: true,
              publishDefaults: {
                audioPreset: {
                  maxBitrate: 20_000,
                },
              },
            });
            roomRef.current = room;
            
            // Notificar o componente pai sobre a instância da room
            if (onRoomInstance) {
              onRoomInstance(room);
            }

            await room.connect(serverUrl, token, {
              autoSubscribe: true,
            });

            const attachAudioTrack = (track: RemoteAudioTrack) => {
              try {
                const elements: HTMLMediaElement[] = (track as unknown as { attach: () => HTMLMediaElement[] }).attach();
                elements.forEach((el) => {
                  el.autoplay = true;
                  el.muted = false;
                  if (audioContainerRef.current) {
                    audioContainerRef.current.appendChild(el);
                  }
                });
              } catch (e) {
                console.warn("Failed to attach remote audio track", e);
              }
            };

            // Adicionar listeners para tracks de áudio
            (room as unknown as Room).on("trackSubscribed", (track: RemoteTrack, _pub: RemoteTrackPublication, participant: RemoteParticipant) => {
              console.log("trackSubscribed", { kind: track.kind, participant: participant?.identity });
              if (track.kind === "audio") {
                attachAudioTrack(track as RemoteAudioTrack);
              }
            });

            (room as unknown as Room).on("trackUnsubscribed", (track: RemoteTrack, _pub: RemoteTrackPublication, participant: RemoteParticipant) => {
              console.log("trackUnsubscribed", { kind: track?.kind, participant: participant?.identity });
              try {
                const els = (track as unknown as { detach?: () => HTMLElement[] })?.detach?.() || [];
                els.forEach((el: HTMLElement) => el.remove());
              } catch (e) {
                console.warn("Failed to detach audio track", e);
              }
            });

            // Anexar tracks existentes dos participantes já conectados
            try {
              (room.participants as Map<string, RemoteParticipant>).forEach((participant) => {
                const tracks = (participant as unknown as { tracks: Map<string, RemoteTrackPublication> }).tracks;
                tracks.forEach((pub) => {
                  const maybeTrack = (pub as unknown as { track?: RemoteTrack }).track;
                  if (maybeTrack && maybeTrack.kind === "audio") {
                    attachAudioTrack(maybeTrack as RemoteAudioTrack);
                  }
                });
              });
            } catch (e) {
              console.warn("Error attaching existing participant tracks", e);
            }

            // Obter lista inicial de participantes (incluindo o usuário local)
            const list: string[] = [];
            (room.participants as Map<string, RemoteParticipant>).forEach((p) => list.push(p.identity));
            // Adicionar o usuário local à lista
            const allParticipants = name ? [name, ...list] : list;
            setRemoteParticipantsList(list);
            if (onParticipantsChange) onParticipantsChange(allParticipants);

            (room as unknown as Room).on("participantConnected", (p: RemoteParticipant) => {
              setRemoteParticipantsList(prev => {
                const newList = Array.from(new Set([...prev, p.identity]));
                const allParticipants = name ? [name, ...newList] : newList;
                if (onParticipantsChange) onParticipantsChange(allParticipants);
                return newList;
              });
            });

            (room as unknown as Room).on("participantDisconnected", (p: RemoteParticipant) => {
              setRemoteParticipantsList(prev => {
                const newList = prev.filter((id) => id !== p.identity);
                const allParticipants = name ? [name, ...newList] : newList;
                if (onParticipantsChange) onParticipantsChange(allParticipants);
                return newList;
              });
            });
            try {
              if (typeof (room.localParticipant as unknown as { enableCameraAndMicrophone?: () => Promise<void> }).enableCameraAndMicrophone === "function") {
                await (room.localParticipant as unknown as { enableCameraAndMicrophone: () => Promise<void> }).enableCameraAndMicrophone();
              }
            } catch (e) {
              console.warn("Failed to enable microphone", e);
            }

            setConnected(true);
          } catch (err) {
            console.error("LiveKit connect failed:", err);
            alert(`Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
          } finally {
            setConnecting(false);
          }
        }
      }
    };

    autoConnect();
  }, [serverUrl, token, name, connected, connecting, mediaPermission, onParticipantsChange, onRoomInstance]);

  useEffect(() => {
    return () => {
      if (roomRef.current) {
        try {
          roomRef.current.disconnect();
        } catch {}
      }
      // Limpar a instância da room quando o componente for desmontado
      if (onRoomInstance) {
        onRoomInstance(null);
      }
    };
  }, [onRoomInstance]);

  async function testMediaPermissions(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: false 
      });
      
      stream.getTracks().forEach(track => track.stop());
      
      setMediaPermission(true);
      return true;
    } catch (err) {
      console.error("Media permission denied:", err);
      setMediaPermission(false);
      alert("❌ Permissão de áudio negada. Por favor, permita acesso ao microfone para usar a chamada de voz.");
      return false;
    }
  }

  return (
    <div className="w-full max-w-3xl p-4 rounded">
     

      {connected && (
        <div className="mt-6">
          <h4 className="text-white font-medium mb-4">
            Usuários conectados ({remoteParticipantsList.length + 1})
          </h4>
          <div className="flex flex-wrap gap-4">
            {/* Card do usuário local */}
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 border border-white/20 min-w-[120px]">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5865f2] to-[#7b61ff] flex items-center justify-center text-white font-bold text-lg mb-2">
                {name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-white text-sm font-medium truncate w-full text-center">
                {name} (você)
              </span>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-white/70">Online</span>
              </div>
            </div>

            {/* Cards dos participantes remotos */}
            {remoteParticipantsList.map((participantName, index) => {
              const initials = participantName
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map(s => s[0]?.toUpperCase())
                .join('');
              
              const colors = [
                '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
                '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
              ];
              const color = colors[index % colors.length];
              
              return (
                <div key={index} className="flex flex-col items-center p-4 rounded-lg bg-white/10 border border-white/20 min-w-[120px]">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2"
                    style={{ backgroundColor: color }}
                  >
                    {initials}
                  </div>
                  <span className="text-white text-sm font-medium truncate w-full text-center">
                    {participantName}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-white/70">Online</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div ref={audioContainerRef} style={{ display: "none" }} />
    </div>
  );
}
