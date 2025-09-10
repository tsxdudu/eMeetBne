    "use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Room } from "livekit-client";
import LiveKitRoom from "../components/LiveKitRoom";
import Sidebar from "../components/Sidebar";
import { userStorage, type User } from "../lib/userAuth";

export default function ServidorPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentCall, setCurrentCall] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [roomInstance, setRoomInstance] = useState<Room | null>(null);

  useEffect(() => {
    const user = userStorage.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
  }, [router]);

  const generateTokenAndConnect = async (callId: string) => {
    if (!currentUser) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/livekit/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName: callId,
          participantName: currentUser.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar token");
      }

      const data = await response.json();
      setToken(data.token);
      setServerUrl(data.url);
      setCurrentCall(callId);
    } catch (err) {
      console.error("Error generating token:", err);
      setError("Erro ao gerar token. Verifique suas configurações.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCall = (callId: string) => {
    if (currentCall === callId) {
      // Se já está na call, desconectar
      handleLeaveCall();
    } else {
      generateTokenAndConnect(callId);
    }
  };

  const handleLeaveCall = () => {
    setCurrentCall(null);
    setToken("");
    setServerUrl("");
    setParticipants([]);
    setError("");
    setIsMicMuted(false);
    setRoomInstance(null);
  };

  const handleToggleMic = async () => {
    if (roomInstance) {
      try {
        if (isMicMuted) {
          await roomInstance.localParticipant.setMicrophoneEnabled(true);
        } else {
          await roomInstance.localParticipant.setMicrophoneEnabled(false);
        }
        setIsMicMuted(!isMicMuted);
      } catch (err) {
        console.error("Erro ao controlar microfone:", err);
      }
    }
  };

  const handleToggleCamera = async () => {
    if (roomInstance) {
      try {
        await roomInstance.localParticipant.setCameraEnabled(!roomInstance.localParticipant.isCameraEnabled);
      } catch (err) {
        console.error("Erro ao controlar câmera:", err);
      }
    }
  };

  const handleToggleScreenShare = async () => {
    if (roomInstance) {
      try {
        if (roomInstance.localParticipant.isScreenShareEnabled) {
          await roomInstance.localParticipant.setScreenShareEnabled(false);
        } else {
          await roomInstance.localParticipant.setScreenShareEnabled(true);
        }
      } catch (err) {
        console.error("Erro ao controlar compartilhamento de tela:", err);
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2c2f36] to-[#36393f] flex">
      {/* Sidebar */}
      <Sidebar 
        serverId="Principal"
        currentCall={currentCall}
        onJoinCall={handleJoinCall}
        onLeaveCall={handleLeaveCall}
        participants={participants}
        isConnecting={loading}
        isConnected={!!currentCall && !!token && !!serverUrl}
        isMicMuted={isMicMuted}
        onToggleMic={handleToggleMic}
        onToggleCamera={handleToggleCamera}
        onToggleScreenShare={handleToggleScreenShare}
      />

      {/* Conteúdo principal */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200">
              {error}
            </div>
          )}

          {currentCall && token && serverUrl && (
            <div className="mb-6">
              <div className="mb-4 p-4 rounded-lg">
              </div>

              <LiveKitRoom
                serverUrl={serverUrl}
                token={token}
                name={currentUser.name}
                onParticipantsChange={setParticipants}
                onRoomInstance={setRoomInstance}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

