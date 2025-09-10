"use client";

import { useState } from "react";

type Props = {
  name?: string | null;
  avatarUrl?: string | null;
};

export default function UserInCall({ name, avatarUrl }: Props) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const initials = (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div className="mt-4 space-y-4">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-white/6 flex items-center justify-center overflow-hidden border border-white/8">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={name || "avatar"} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white/90 font-semibold">{initials || "U"}</span>
          )}
        </div>

        <div>
          <div className="text-sm text-white/90 font-medium">{name || "Usuário"}</div>
          <div className="text-xs text-white/60">Na call • Conectado</div>
        </div>
      </div>

      {/* Media Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-2 rounded-full transition-colors ${
            isMuted 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-white/10 hover:bg-white/20"
          }`}
          title={isMuted ? "Desmutar microfone" : "Mutar microfone"}
        >
          {isMuted ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/>
            </svg>
          )}
        </button>

        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`p-2 rounded-full transition-colors ${
            isVideoOff 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-white/10 hover:bg-white/20"
          }`}
          title={isVideoOff ? "Ligar câmera" : "Desligar câmera"}
        >
          {isVideoOff ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82l-2-2H16c1.1 0 2 .9 2 2v1.5l4-4v1zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h10.73l1.73 1.73L17.73 16 21 19.27 19.73 20.54 3.27 2z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          )}
        </button>

        <button
          className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors ml-2"
          title="Sair da chamada"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.69.28-.26 0-.51-.1-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.7l-2.48 2.48c-.18.18-.43.29-.69.29-.26 0-.51-.1-.69-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
          </svg>
        </button>
      </div>

      {/* Connection Status */}
      <div className="text-xs text-white/60">
        Qualidade: <span className="text-green-400">Boa</span> • 
        Latência: <span className="text-green-400">24ms</span>
      </div>
    </div>
  );
}
