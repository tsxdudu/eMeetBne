'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { Send, X } from 'lucide-react';
import { RemoteParticipant } from 'livekit-client';

export interface ChatMessage {
  id: string;
  participantName: string;
  message: string;
  timestamp: Date;
  isLocal: boolean;
}

interface ChatPanelProps {
  onClose: () => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export function ChatPanel({ onClose, messages, setMessages }: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!room) return;

    setIsConnected(true);

    const handleDataReceived = (payload: Uint8Array, participant?: RemoteParticipant) => {
      if (!participant) {
        return;
      }
      
      try {
        const decoder = new TextDecoder();
        const message = decoder.decode(payload);
        
        const data = JSON.parse(message);

        if (data.type === 'chat') {
          const chatMessage: ChatMessage = {
            id: `${participant.identity}-${Date.now()}`,
            participantName: data.participantName || participant.name || participant.identity,
            message: data.message,
            timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
            isLocal: false
          };
          
          setMessages(prev => {
            return [...prev, chatMessage];
          });
        }
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
      }
    };

    room.on('dataReceived', handleDataReceived);

    return () => {
      room.off('dataReceived', handleDataReceived);
    };
  }, [room, setMessages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !room || !localParticipant) return;

    try {

  
      const messageData = {
        type: 'chat',
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        participantName: localParticipant.name || localParticipant.identity
      };

      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(messageData));
      
      await localParticipant.publishData(data, { reliable: true });

      const localMessage: ChatMessage = {
        id: `local-${Date.now()}`,
        participantName: localParticipant.name || localParticipant.identity,
        message: newMessage.trim(),
        timestamp: new Date(),
        isLocal: true
      };
      setMessages(prev => [...prev, localMessage]);

      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-gray-800 bg-opacity-95 z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-600">
        <h3 className="text-lg font-semibold text-white">Chat da Sala</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!isConnected && (
          <div className="text-center text-gray-400 text-sm">
            Conectando ao chat...
          </div>
        )}
        
        {messages.length === 0 && isConnected && (
          <div className="text-center text-gray-400 text-sm">
            Nenhuma mensagem ainda. Seja o primeiro a enviar uma mensagem!
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.isLocal ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 ${
                message.isLocal
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              {!message.isLocal && (
                <div className="text-xs text-gray-300 mb-1 font-medium">
                  {message.participantName}
                </div>
              )}
              <div className="text-sm break-words">
                {message.message}
              </div>
              <div
                className={`text-xs mt-1 ${
                  message.isLocal ? 'text-blue-200' : 'text-gray-400'
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-600">
        <div className="flex space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Pressione Enter para enviar, Shift+Enter para nova linha
        </div>
      </div>
    </div>
  );
}