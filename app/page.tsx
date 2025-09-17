"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, LogIn, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';

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

  const [roomName, setRoomName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [creatorName, setCreatorName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [userName, setUserName] = useState('');
  
  const [showNameModal, setShowNameModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [modalUserName, setModalUserName] = useState('');

  useEffect(() => {
    fetchPublicRooms();
  }, []);


  useEffect(() => {
    if (showCreateForm || showJoinForm) return; 
    const interval = setInterval(() => {
      fetchPublicRooms();
    }, 15000);
    return () => clearInterval(interval);
  }, [showCreateForm, showJoinForm]);

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
    <div className="relative min-h-screen overflow-hidden text-slate-100">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-fuchsia-600/30 blur-[120px] float-slow" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-96 w-[34rem] rounded-full bg-cyan-500/20 blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 py-14 md:py-20">
        <header className="text-center mb-14 max-w-3xl mx-auto space-y-6 fade-in">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="gradient-text">eMeet</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mt-2 text-2xl md:text-3xl font-normal">Conecte-se, Colabore, Conquiste</span>
          </h1>
          <p className="text-slate-300/90 text-lg md:text-xl max-w-2xl mx-auto">
            Crie e participe de salas de videoconferência em segundos. Simples, rápido e elegante para suas reuniões e encontros online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              variant="gradient"
              size="lg"
              onClick={() => { setShowCreateForm(true); setShowJoinForm(false); }}
              leftIcon={<Plus className="h-5 w-5" />}
              className="shadow-xl"
            >Criar Sala</Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => { setShowJoinForm(true); setShowCreateForm(false); }}
              leftIcon={<LogIn className="h-5 w-5" />}
              className="shadow-xl"
            >Entrar em Sala</Button>
          </div>
        </header>
        {showCreateForm && (
          <Modal
            open={showCreateForm}
            onClose={() => setShowCreateForm(false)}
            title="Criar Nova Sala"
            footer={
              <div className="flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={() => setShowCreateForm(false)}>Cancelar</Button>
                <Button variant="gradient" type="submit" form="create-room-form" loading={loading}>{loading ? 'Criando...' : 'Criar Sala'}</Button>
              </div>
            }
          >
            <form id="create-room-form" onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">Nome da Sala</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full rounded-md bg-slate-900/60 border border-slate-700/60 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none"
                  placeholder="Digite o nome da sala"
                  required
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="public-room"
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="public-room" className="text-sm text-slate-300">Sala pública (visível para todos)</label>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">Máximo de Participantes</label>
                <input
                  type="number"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                  className="w-full rounded-md bg-slate-900/60 border border-slate-700/60 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none"
                  min={1}
                  max={50}
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1">Entre 1 e 50 participantes</p>
              </div>
              {!isPublic && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">Seu Nome</label>
                    <input
                      type="text"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      className="w-full rounded-md bg-slate-900/60 border border-slate-700/60 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none"
                      placeholder="Digite seu nome"
                      required={!isPublic}
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Você entrará automaticamente após criar.</p>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">Senha da Sala</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-md bg-slate-900/60 border border-slate-700/60 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none"
                      placeholder="Digite uma senha"
                      required={!isPublic}
                    />
                  </div>
                </>
              )}
            </form>
          </Modal>
        )}

        {showJoinForm && (
          <Modal
            open={showJoinForm}
            onClose={() => setShowJoinForm(false)}
            title="Entrar em Sala"
            footer={
              <div className="flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={() => setShowJoinForm(false)}>Cancelar</Button>
                <Button variant="primary" type="submit" form="join-room-form" loading={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button>
              </div>
            }
          >
            <form id="join-room-form" onSubmit={handleJoinFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">Seu Nome</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full rounded-md bg-slate-900/60 border border-slate-700/60 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none"
                  placeholder="Digite seu nome"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">ID da Sala</label>
                <input
                  type="text"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  className="w-full rounded-md bg-slate-900/60 border border-slate-700/60 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none"
                  placeholder="Cole o ID da sala"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">Senha (se necessário)</label>
                <input
                  type="password"
                  value={joinPassword}
                  onChange={(e) => setJoinPassword(e.target.value)}
                  className="w-full rounded-md bg-slate-900/60 border border-slate-700/60 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none"
                  placeholder="Digite a senha da sala"
                />
              </div>
            </form>
          </Modal>
        )}

        {!showCreateForm && !showJoinForm && (
          <section className="max-w-5xl mx-auto pt-4">
            <div className="flex items-center mb-4 gap-2">
              <Users className="h-5 w-5 text-indigo-400" />
              <h2 className="text-xl font-semibold tracking-wide">Salas Públicas</h2>
              <button
                onClick={fetchPublicRooms}
                aria-label="Atualizar salas"
                className="ml-auto inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Atualizar
              </button>
            </div>

            {publicRooms.length === 0 ? (
              <Card padding="lg" className="text-center">
                {loading ? (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <Spinner size={30} />
                    <p className="text-sm text-slate-400">Carregando salas...</p>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">Nenhuma sala pública disponível no momento</p>
                )}
              </Card>
            ) : (
              <div className="grid gap-4">
                {publicRooms.map((room) => {
                  const isFull = room.participantCount >= room.maxParticipants;
                  return (
                    <Card key={room.id} padding="lg" className="relative overflow-hidden">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                            <span className="truncate max-w-[340px]">{room.name}</span>
                            {!isFull && <span className="pulse-ring h-2 w-2 rounded-full bg-emerald-400" aria-hidden />}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{room.participantCount}/{room.maxParticipants}</span>
                            <span>Criada {new Date(room.createdAt).toLocaleDateString()}</span>
                            <span className="hidden sm:inline-flex">ID: {room.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 md:ml-auto">
                          <Button
                            variant={isFull ? 'outline' : 'primary'}
                            disabled={loading || isFull}
                            onClick={() => handlePublicRoomJoin(room.id)}
                            className="min-w-[110px]"
                          >
                            {isFull ? 'Lotada' : 'Entrar'}
                          </Button>
                        </div>
                      </div>
                      <div className="pointer-events-none absolute -right-6 -bottom-8 opacity-[0.07]">
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {showNameModal && (
          <Modal
            open={showNameModal}
            onClose={closeModal}
            title="Entrar na Sala"
            footer={
              <div className="flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={closeModal}>Cancelar</Button>
                <Button variant="primary" type="submit" form="public-room-join-form" loading={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button>
              </div>
            }
          >
            <form id="public-room-join-form" onSubmit={handleModalJoin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">Seu Nome</label>
                <input
                  type="text"
                  value={modalUserName}
                  onChange={(e) => setModalUserName(e.target.value)}
                  className="w-full rounded-md bg-slate-900/60 border border-slate-700/60 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none"
                  placeholder="Digite seu nome"
                  required
                  autoFocus
                />
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
}
