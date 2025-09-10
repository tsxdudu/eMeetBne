"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Mic, MicOff, Video, VideoOff, ScreenShare, Settings } from "lucide-react";
import { userStorage, type User, generateAvatar } from "../lib/userAuth";

interface SidebarProps {
  serverId?: string | null;
  currentCall?: string | null;
  onJoinCall?: (callId: string) => void;
  onLeaveCall?: () => void;
  participants?: string[];
  isConnecting?: boolean;
  isConnected?: boolean;
  isMicMuted?: boolean;
  onToggleMic?: () => void;
  onToggleCamera?: () => void;
  onToggleScreenShare?: () => void;
}

export default function Sidebar({ 
  serverId, 
  currentCall, 
  onJoinCall, 
  onLeaveCall, 
  participants = [], 
  isConnecting = false, 
  isConnected = false,
  isMicMuted = false,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare
}: SidebarProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {
    setCurrentUser(userStorage.getUser());
  }, []);

  const channels = [
    { id: "general", name: "# geral" },
    { id: "meetings", name: "# reuniões" },
    { id: "random", name: "# random" },
  ];

  const voiceCalls = [
    { id: "call-geral", name: "🔊 Sala Geral" },
    { id: "call-reuniao", name: "🔊 Reunião" },
    { id: "call-privada", name: "🔊 Privada" },
  ];

  const handleCallClick = (callId: string) => {
    if (onJoinCall) {
      onJoinCall(callId);
    }
  };

  const handleLogout = () => {
    userStorage.removeUser();
    window.location.href = '/login';
  };

  return (
    <aside className="hidden sm:flex sm:flex-col sm:w-64 lg:w-72 min-h-screen p-4 bg-[rgba(255,255,255,0.02)] backdrop-blur-md border-r border-white/6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5865f2] to-[#7b61ff] flex items-center justify-center text-white font-bold">
            {serverId ? serverId.charAt(0).toUpperCase() : "E"}
          </div>
          <h2 className="text-lg font-semibold text-white">
            {serverId ? `Server: ${serverId}` : "eMeetBNE"}
          </h2>
        </div>
        <button className="text-white/60 text-sm">➕</button>
      </div>

      <div className="mb-3">
        <div className="text-sm text-white/80 font-semibold">Canais</div>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <div className="text-xs text-white/60 uppercase tracking-wider">Texto</div>
        {channels.map((c) => (
          <button 
            key={c.id} 
            className="px-3 py-2 rounded text-left text-white/90 hover:bg-white/6 transition-colors"
          >
            {c.name}
          </button>
        ))}

        <div className="mt-3 text-xs text-white/60 uppercase tracking-wider">Chamadas de Voz</div>
        {voiceCalls.map((call) => (
          <div key={call.id} className="mb-2">
            <button
              onClick={() => handleCallClick(call.id)}
              className={`w-full px-3 py-2 rounded text-left text-white/90 hover:bg-white/6 transition-colors ${
                currentCall === call.id ? 'bg-white/10 border-l-2 border-[#5865f2]' : ''
              }`}
            >
              {call.name}
              {currentCall === call.id && (
                <span className="ml-2 text-xs text-green-400">conectado</span>
              )}
            </button>
            
            {/* Mostrar usuários conectados nesta call específica */}
            {currentCall === call.id && participants.length > 0 && (
              <div className="ml-4 mt-2 space-y-1">
                {participants.map((participantName, index) => {
                  const avatar = generateAvatar(participantName);
                  return (
                    <div key={index} className="flex items-center gap-2 text-sm text-white/80 py-1">
                      <Image 
                        src={avatar}
                        alt={participantName}
                        width={20}
                        height={20}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="truncate">{participantName}</span>
                      <div className="w-2 h-2 rounded-full bg-green-500 ml-auto"></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        <div className="mt-4 w-full rounded-md py-2 bg-gradient-to-br from-[#5865f2] to-[#7b61ff] text-white text-center cursor-pointer hover:opacity-90 transition-opacity">
          Criar canal
        </div>
      </div>

      {/* Informações do usuário na parte inferior */}
      {currentUser && (
        <div className="mt-auto pt-4 border-t border-white/6">
          <div className="flex items-center gap-3 mb-3">
            {currentUser.avatar ? (
              <Image 
                src={currentUser.avatar}
                alt={currentUser.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5865f2] to-[#7b61ff] flex items-center justify-center text-white text-sm font-bold">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-white/90 text-sm font-medium truncate">
                {currentUser.name}
              </div>
              <div className="text-white/60 text-xs">
                {isConnecting ? (
                  <span className="text-blue-400">🔄 Conectando na call...</span>
                ) : isConnected && currentCall ? (
                  <span className="text-green-400">🔊 Conectado na call</span>
                ) : (
                  "Online"
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/60 hover:text-white/80 text-xs"
              title="Sair"
            >
              Sair
            </button>
          </div>
          
          {/* Botão para sair da call */}
          {isConnected && currentCall && (
            <div className="mb-3">
              <button
                onClick={onLeaveCall}
                className="w-full px-3 py-2 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
              >
                Sair da Call
              </button>
            </div>
          )}
          
          {/* Controles de mídia */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleMic}
                className={`p-2 rounded-md transition-colors ${
                  !isMicMuted ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                }`}
                title={!isMicMuted ? "Desativar microfone" : "Ativar microfone"}
                disabled={!isConnected}
              >
                {!isMicMuted ? <Mic size={16} /> : <MicOff size={16} />}
              </button>
              
              <button
                onClick={() => {
                  setIsCameraOn(!isCameraOn);
                  onToggleCamera?.();
                }}
                className={`p-2 rounded-md transition-colors ${
                  isCameraOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
                title={isCameraOn ? "Desativar câmera" : "Ativar câmera"}
                disabled={!isConnected}
              >
                {isCameraOn ? <Video size={16} /> : <VideoOff size={16} />}
              </button>
              
              <button
                onClick={() => {
                  setIsScreenSharing(!isScreenSharing);
                  onToggleScreenShare?.();
                }}
                className={`p-2 rounded-md transition-colors ${
                  isScreenSharing ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
                title={isScreenSharing ? "Parar compartilhamento" : "Compartilhar tela"}
                disabled={!isConnected}
              >
                <ScreenShare size={16} />
              </button>
            </div>
            
            <button
              className="p-2 rounded-md bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 transition-colors"
              title="Configurações"
            >
              <Settings size={16} />
            </button>
          </div>
          
          <div className="text-xs text-white/60">eMeetBNE • v0.1</div>
        </div>
      )}
    </aside>
  );
}
