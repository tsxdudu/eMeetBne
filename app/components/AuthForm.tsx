"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "./Card";
import { userStorage, generateAvatar, type User } from "../lib/userAuth";

type Props = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "login") {
        const user: User = {
          id: Date.now().toString(),
          name: username || name || email.split('@')[0],
          email,
          avatar: generateAvatar(username || name || email.split('@')[0])
        };
        
        userStorage.setUser(user);
        setMessage("Login realizado com sucesso!");
        
        setTimeout(() => {
          router.push('/servidor');
        }, 1000);
      } else {
        const user: User = {
          id: Date.now().toString(),
          name: username || name,
          email,
          avatar: generateAvatar(username || name)
        };
        
        userStorage.setUser(user);
        setMessage("Conta criada com sucesso!");
        
        setTimeout(() => {
          router.push('/servidor');
        }, 1000);
      }
    } catch {
      setMessage("Falha na autenticação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title={mode === "login" ? "Bem de volta" : "Crie sua conta"} description={mode === "login" ? "Faça login para continuar" : "Cadastre-se para começar"}>
      <div className="mt-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nome de usuário (aparecerá nas calls)"
            className="rounded-md px-3 py-2 bg-white/6 text-white border border-white/8 focus:outline-none focus:ring-2 focus:ring-[#5865f2]/60"
            required
          />

          {mode === "register" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
              className="rounded-md px-3 py-2 bg-white/6 text-white border border-white/8 focus:outline-none focus:ring-2 focus:ring-[#5865f2]/60"
            />
          )}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            type="email"
            className="rounded-md px-3 py-2 bg-white/6 text-white border border-white/8 focus:outline-none focus:ring-2 focus:ring-[#5865f2]/60"
            required
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            type="password"
            className="rounded-md px-3 py-2 bg-white/6 text-white border border-white/8 focus:outline-none focus:ring-2 focus:ring-[#5865f2]/60"
            required
          />

          <button
            type="submit"
            className="mt-1 rounded-md px-4 py-2 bg-gradient-to-br from-[#5865f2] to-[#7b61ff] text-white font-semibold shadow-lg disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Registrar"}
          </button>

          <div className="flex items-center gap-3 mt-2">
            <div className="h-px bg-white/10 flex-1" />
            <div className="text-sm text-white/60">ou</div>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" className="flex-1 rounded-md px-3 py-2 bg-white/8 text-white">Entrar com Google</button>
            <button type="button" className="flex-1 rounded-md px-3 py-2 bg-white/8 text-white">Entrar com Github</button>
          </div>

          <div className="text-sm text-white/70 mt-3">
            {mode === "login" ? (
              <>
                Não tem conta? <a href="/register" className="text-white underline">Crie uma</a>
              </>
            ) : (
              <>
                Já tem conta? <a href="/login" className="text-white underline">Entrar</a>
              </>
            )}
          </div>

          {message && <div className="text-sm text-white/80 mt-2">{message}</div>}
        </form>
      </div>
    </Card>
  );
}
