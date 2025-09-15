'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Users, Plus, LogIn } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  isPublic: boolean;
  createdAt: string;
  participantCount: number;
  maxParticipants: number;
}

export default function Home() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [publicRooms, setPublicRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form states
  const [roomName, setRoomName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [creatorName, setCreatorName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [userName, setUserName] = useState('');
  
  // Modal states for entering public rooms
  const [showNameModal, setShowNameModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [modalUserName, setModalUserName] = useState('');

  useEffect(() => {
    fetchPublicRooms();
  }, []);

  const fetchPublicRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      if (response.ok) {
        const rooms = await response.json();
        setPublicRooms(rooms);
      }
    } catch (error) {
      console.error('Erro ao buscar salas públicas:', error);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isPublic && !creatorName.trim()) {
      alert('Por favor, digite seu nome para criar uma sala privada');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: roomName,
          isPublic,
          password: isPublic ? undefined : password,
          maxParticipants: maxParticipants,
        }),
      });

      if (response.ok) {
        const room = await response.json();
        
        // Se for sala privada, entrar automaticamente
        if (!isPublic && creatorName.trim()) {
          try {
            const joinResponse = await fetch('/api/rooms/join', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                roomId: room.id,
                userName: creatorName.trim(),
                password: password,
              }),
            });

            if (joinResponse.ok) {
              const { token, url, roomName: liveKitRoomName } = await joinResponse.json();
              // Redirecionar para a sala privada criada
              router.push(`/room/${room.id}?token=${encodeURIComponent(token)}&url=${encodeURIComponent(url)}&roomName=${encodeURIComponent(liveKitRoomName)}&userName=${encodeURIComponent(creatorName)}`);
              return;
            } else {
              const joinError = await joinResponse.json();
              alert(`Sala criada, mas erro ao entrar: ${joinError.error}`);
            }
          } catch (joinError) {
            console.error('Erro ao entrar na sala criada:', joinError);
            alert('Sala criada, mas erro ao entrar automaticamente');
          }
        }

        // Para salas públicas ou caso de erro, apenas mostrar sucesso
        alert(`Sala "${room.name}" criada com sucesso!`);
        setShowCreateForm(false);
        setRoomName('');
        setPassword('');
        setMaxParticipants(10);
        setCreatorName('');
        fetchPublicRooms();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao criar sala');
      }
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      alert('Erro ao criar sala');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId: string, roomPassword?: string) => {
    if (!userName.trim()) {
      alert('Por favor, digite seu nome');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          userName: userName.trim(),
          password: roomPassword,
        }),
      });

      if (response.ok) {
        const { token, url, roomName } = await response.json();
        // Redirecionar para a sala com os parâmetros necessários
        router.push(`/room/${roomId}?token=${encodeURIComponent(token)}&url=${encodeURIComponent(url)}&roomName=${encodeURIComponent(roomName)}&userName=${encodeURIComponent(userName)}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao entrar na sala');
      }
    } catch (error) {
      console.error('Erro ao entrar na sala:', error);
      alert('Erro ao entrar na sala');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleJoinRoom(joinRoomId, joinPassword);
  };

  const handlePublicRoomJoin = (roomId: string) => {
    setSelectedRoomId(roomId);
    setShowNameModal(true);
  };

  const handleModalJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!modalUserName.trim()) {
      alert('Por favor, digite seu nome');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: selectedRoomId,
          userName: modalUserName.trim(),
        }),
      });

      if (response.ok) {
        const { token, url, roomName } = await response.json();
        // Redirecionar para a sala com os parâmetros necessários
        router.push(`/room/${selectedRoomId}?token=${encodeURIComponent(token)}&url=${encodeURIComponent(url)}&roomName=${encodeURIComponent(roomName)}&userName=${encodeURIComponent(modalUserName)}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao entrar na sala');
      }
    } catch (error) {
      console.error('Erro ao entrar na sala:', error);
      alert('Erro ao entrar na sala');
    } finally {
      setLoading(false);
      setShowNameModal(false);
      setModalUserName('');
      setSelectedRoomId('');
    }
  };

  const closeModal = () => {
    setShowNameModal(false);
    setModalUserName('');
    setSelectedRoomId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Video className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">LiveMeet</h1>
          </div>
          <p className="text-xl text-gray-600">
            Conecte-se com qualquer pessoa, em qualquer lugar
          </p>
        </div>

        {/* Quick Actions */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Create Room Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <Plus className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Criar Sala</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Crie uma nova sala de videoconferência e convide outras pessoas
              </p>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                {showCreateForm ? 'Cancelar' : 'Criar Nova Sala'}
              </button>
            </div>

            {/* Join Room Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <LogIn className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Entrar em Sala</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Entre em uma sala existente usando o ID ou link da sala
              </p>
              <button
                onClick={() => setShowJoinForm(!showJoinForm)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {showJoinForm ? 'Cancelar' : 'Entrar em Sala'}
              </button>
            </div>
          </div>
        </div>

        {/* Create Room Form */}
        {showCreateForm && (
          <div className="max-w-md mx-auto mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-black">Criar Nova Sala</h3>
              <form onSubmit={handleCreateRoom}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Sala
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    placeholder="Digite o nome da sala"
                    required
                  />
                </div>

                {!isPublic && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seu Nome (para entrar na sala)
                    </label>
                    <input
                      type="text"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                      placeholder="Digite seu nome"
                      required={!isPublic}
                    />
                    <p className="text-xs text-gray-500 mt-1">Você entrará automaticamente na sala após criar</p>
                  </div>
                )}
                
                <div className="mb-4">
                  <label className="flex items-center text-black">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="mr-2"
                    />
                    Sala pública (visível para todos)
                  </label>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de Participantes
                  </label>
                  <input
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    placeholder="Número máximo de participantes"
                    min="1"
                    max="50"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Entre 1 e 50 participantes</p>
                </div>

                {!isPublic && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha da Sala
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                      placeholder="Digite uma senha"
                      required={!isPublic}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Criando...' : 'Criar Sala'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Join Room Form */}
        {showJoinForm && (
          <div className="max-w-md mx-auto mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Entrar em Sala</h3>
              <form onSubmit={handleJoinFormSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Digite seu nome"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID da Sala
                  </label>
                  <input
                    type="text"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Cole o ID da sala"
                    required
                  />
                </div>

                <div className="mb-4">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Entrando...' : 'Entrar na Sala'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Public Rooms */}
        {!showCreateForm && !showJoinForm && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 text-gray-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Salas Públicas</h2>
            </div>

            {publicRooms.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <p className="text-gray-500">Nenhuma sala pública disponível no momento</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {publicRooms.map((room) => (
                  <div key={room.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {room.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="mr-4">
                            {room.participantCount}/{room.maxParticipants} participantes
                          </span>
                          <span className="text-xs">
                            Criada em {new Date(room.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handlePublicRoomJoin(room.id)}
                          disabled={loading || room.participantCount >= room.maxParticipants}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {room.participantCount >= room.maxParticipants ? 'Lotada' : 'Entrar'}
                        </button>
                        <div className="text-xs text-gray-400">
                          ID: {room.id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal for entering name to join public room */}
        {showNameModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Entrar na Sala
              </h2>
              <form onSubmit={handleModalJoin}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    value={modalUserName}
                    onChange={(e) => setModalUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Digite seu nome"
                    required
                    autoFocus
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
