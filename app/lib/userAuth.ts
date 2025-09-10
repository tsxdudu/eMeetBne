// Tipos para o sistema de usuário
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Funções para gerenciar usuário no localStorage
export const userStorage = {
  // Salvar usuário logado
  setUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('emeetbne-user', JSON.stringify(user));
      // Também definir cookie para o middleware
      document.cookie = `emeetbne-user=${JSON.stringify(user)}; path=/; max-age=86400`; // 24 horas
    }
  },

  // Obter usuário logado
  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('emeetbne-user');
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }
    return null;
  },

  // Remover usuário (logout)
  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('emeetbne-user');
      // Remover cookie também
      document.cookie = 'emeetbne-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  },

  // Verificar se está logado
  isLoggedIn: (): boolean => {
    return userStorage.getUser() !== null;
  }
};

// Gerar avatar baseado no nome
export const generateAvatar = (name: string): string => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join('');
  
  // Cores para o avatar
  const colors = [
    '#5865f2', '#7b61ff', '#00d4aa', '#ff6b6b', 
    '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'
  ];
  
  const colorIndex = name.length % colors.length;
  const color = colors[colorIndex];
  
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="${color}"/>
      <text x="20" y="25" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">${initials}</text>
    </svg>
  `)}`;
};
