"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userStorage } from './lib/userAuth';
import AuthForm from "./components/AuthForm";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário está logado
    const user = userStorage.getUser();
    
    if (user) {
      // Se logado, redirecionar para servidor
      router.push('/servidor');
    }
  }, [router]);

  // Se não está logado, mostrar formulário de login
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <AuthForm mode="login" />
    </div>
  );
}
