'use client';

import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  LiveKitRoom, 
  RoomAudioRenderer,
  useParticipants,
  useLocalParticipant
} from '@livekit/components-react';
import {
  DisconnectReason
} from 'livekit-client';
import { CustomVideoLayout } from '../../../components/CustomVideoLayout';
import { ChatPanel } from '../../../components/ChatPanel';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Monitor,
  MonitorOff,
  Users,
  Copy,
  Settings,
  MessageSquare
} from 'lucide-react';

export default function RoomPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  
  const [token, setToken] = useState<string>('');
  const [serverUrl, setServerUrl] = useState<string>('');
  const [roomName, setRoomName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinUserName, setJoinUserName] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const urlParam = searchParams.get('url');
    const roomNameParam = searchParams.get('roomName');
    const userNameParam = searchParams.get('userName');

    if (tokenParam && urlParam && roomNameParam && userNameParam) {
      // Acesso com parâmetros (método normal)
      setToken(tokenParam);
      setServerUrl(urlParam);
      setRoomName(roomNameParam);
      setUserName(userNameParam);
    } else {
      // Acesso direto via link - mostrar modal para capturar nome
      setShowJoinModal(true);
    }
  }, [searchParams]);

  const handleJoinFromLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!joinUserName.trim()) {
      alert('Por favor, digite seu nome');
      return;
    }

    setJoining(true);
    const roomId = params.roomId as string;

    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: roomId,
          userName: joinUserName.trim(),
          password: joinPassword.trim() || undefined,
        }),
      });

      if (response.ok) {
        const { token, url, roomName } = await response.json();
        setToken(token);
        setServerUrl(url);
        setRoomName(roomName);
        setUserName(joinUserName.trim());
        setShowJoinModal(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao entrar na sala');
      }
    } catch (error) {
      console.error('Erro ao entrar na sala:', error);
      alert('Erro ao entrar na sala');
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveRoom = () => {
    router.push('/');
  };

  const copyRoomLink = () => {
    const roomId = params.roomId as string;
    const link = `${window.location.origin}/${roomId}`;
    navigator.clipboard.writeText(link);
    alert('Link da sala copiado!');
  };

  const handleDisconnected = (reason?: DisconnectReason) => {
    console.log('Desconectado da sala:', reason);
    setIsConnected(false);
    
    if (reason === DisconnectReason.ROOM_DELETED) {
      alert('A sala foi encerrada pelo criador');
    } else if (reason === DisconnectReason.PARTICIPANT_REMOVED) {
      alert('Você foi removido da sala');
    }
    
    router.push('/');
  };

  const handleConnected = () => {
    setIsConnected(true);
  };

  if (!token || !serverUrl) {
    if (showJoinModal) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Entrar na Sala
            </h2>
            <form onSubmit={handleJoinFromLink}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seu Nome
                </label>
                <input
                  type="text"
                  value={joinUserName}
                  onChange={(e) => setJoinUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Digite seu nome"
                  required
                  autoFocus
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha (se necessário)
                </label>
                <input
                  type="password"
                  value={joinPassword}
                  onChange={(e) => setJoinPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Digite a senha da sala"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={joining}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {joining ? 'Entrando...' : 'Entrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <LiveKitRoom
        video={false}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: '100vh' }}
        onConnected={handleConnected}
        onDisconnected={handleDisconnected}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-gray-800 bg-opacity-90 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-white">
                {roomName}
              </h1>
              {isConnected && (
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <ParticipantCount />
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={copyRoomLink}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                title="Copiar link da sala"
              >
                <Copy className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setShowParticipants(!showParticipants)}
                className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                title="Participantes"
              >
                <Users className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setShowChat(!showChat)}
                className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                title="Chat"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                title="Configurações"
              >
                <Settings className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleLeaveRoom}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                title="Sair da sala"
              >
                <PhoneOff className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="h-full pt-16">
          {isConnected ? (
            <>
              <CustomVideoLayout />
              
              {/* Participants Panel */}
              {showParticipants && (
                <ParticipantsPanel onClose={() => setShowParticipants(false)} />
              )}

              {/* Settings Panel */}
              {showSettings && (
                <SettingsPanel onClose={() => setShowSettings(false)} />
              )}

              {/* Chat Panel */}
              {showChat && (
                <ChatPanel onClose={() => setShowChat(false)} />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-xl">Conectando à sala...</p>
                <p className="text-gray-400 mt-2">Usuário: {userName}</p>
              </div>
            </div>
          )}
        </div>

        {/* Audio Renderer */}
        <RoomAudioRenderer />
        
        {/* Auto disable camera on connect */}
        {isConnected && <AutoDisableCamera />}
        
        {/* Custom Controls (if needed) */}
        {isConnected && <CustomControls />}
      </LiveKitRoom>
    </div>
  );
}

// Componente para desligar câmera automaticamente
function AutoDisableCamera() {
  const { localParticipant } = useLocalParticipant();

  useEffect(() => {
    if (localParticipant) {
      // Desligar a câmera automaticamente quando conectar
      localParticipant.setCameraEnabled(false);
    }
  }, [localParticipant]);

  return null; // Este componente não renderiza nada
}

// Componente para contar participantes
function ParticipantCount() {
  const participants = useParticipants();
  return <span>{participants.length}</span>;
}

// Componente para controles customizados
function CustomControls() {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const { localParticipant } = useLocalParticipant();

  // Verificar se o participante local existe e obter estado dos dispositivos
  const isVideoEnabled = localParticipant?.isCameraEnabled ?? false;
  const isAudioEnabled = localParticipant?.isMicrophoneEnabled ?? false;

  const toggleVideo = async () => {
    if (localParticipant) {
      try {
        await localParticipant.setCameraEnabled(!isVideoEnabled);
      } catch (error) {
        console.error('Erro ao alternar vídeo:', error);
      }
    }
  };

  const toggleAudio = async () => {
    if (localParticipant) {
      try {
        await localParticipant.setMicrophoneEnabled(!isAudioEnabled);
      } catch (error) {
        console.error('Erro ao alternar áudio:', error);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (localParticipant) {
      try {
        if (isScreenSharing) {
          await localParticipant.setScreenShareEnabled(false);
        } else {
          await localParticipant.setScreenShareEnabled(true);
        }
        setIsScreenSharing(!isScreenSharing);
      } catch (error) {
        console.error('Erro ao alternar compartilhamento de tela:', error);
      }
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center space-x-4 bg-gray-800 bg-opacity-90 px-6 py-3 rounded-full">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full transition-colors ${
            isAudioEnabled ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'
          }`}
          title={isAudioEnabled ? 'Desativar microfone' : 'Ativar microfone'}
        >
          {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full transition-colors ${
            isVideoEnabled ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'
          }`}
          title={isVideoEnabled ? 'Desativar câmera' : 'Ativar câmera'}
        >
          {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>

        <button
          onClick={toggleScreenShare}
          className={`p-3 rounded-full transition-colors ${
            isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
          }`}
          title={isScreenSharing ? 'Parar compartilhamento' : 'Compartilhar tela'}
        >
          {isScreenSharing ? <MonitorOff className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}

// Componente do painel de participantes
function ParticipantsPanel({ onClose }: { onClose: () => void }) {
  const participants = useParticipants();

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-gray-800 bg-opacity-95 z-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Participantes ({participants.length})</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-3">
        {participants.map((participant) => (
          <div
            key={participant.identity}
            className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">
                {participant.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium">{participant.name || participant.identity}</p>
              <p className="text-xs text-gray-400">
                {participant.isLocal ? 'Você' : 'Participante'}
              </p>
            </div>
            <div className="flex space-x-1">
              {participant.isMicrophoneEnabled ? (
                <Mic className="h-4 w-4 text-green-400" />
              ) : (
                <MicOff className="h-4 w-4 text-red-400" />
              )}
              {participant.isCameraEnabled ? (
                <Video className="h-4 w-4 text-green-400" />
              ) : (
                <VideoOff className="h-4 w-4 text-red-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente do painel de configurações
function SettingsPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-gray-800 bg-opacity-95 z-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Configurações</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Qualidade de vídeo</label>
          <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2">
            <option>Alta (HD)</option>
            <option>Média</option>
            <option>Baixa</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Dispositivos</label>
          <div className="space-y-2">
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2">
              <option>Câmera padrão</option>
            </select>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2">
              <option>Microfone padrão</option>
            </select>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2">
              <option>Alto-falante padrão</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="noise-cancellation" className="rounded" />
          <label htmlFor="noise-cancellation" className="text-sm">
            Cancelamento de ruído
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="echo-cancellation" className="rounded" />
          <label htmlFor="echo-cancellation" className="text-sm">
            Cancelamento de eco
          </label>
        </div>
      </div>
    </div>
  );
}