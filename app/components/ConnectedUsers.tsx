"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { type User } from "../lib/userAuth";

interface ConnectedUsersProps {
  participants: string[];
  currentUser?: User | null;
}

export default function ConnectedUsers({ participants, currentUser }: ConnectedUsersProps) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const mockUsers = participants.map((identity, index) => ({
      id: `user-${index}`,
      name: identity,
      email: `${identity}@example.com`,
      avatar: `data:image/svg+xml;base64,${btoa(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#${Math.floor(Math.random()*16777215).toString(16)}"/>
          <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">${identity.charAt(0).toUpperCase()}</text>
        </svg>
      `)}`
    }));
    if (currentUser && !participants.includes(currentUser.name)) {
      mockUsers.unshift({
        ...currentUser,
        avatar: currentUser.avatar || `data:image/svg+xml;base64,${btoa(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#5865f2"/>
            <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">${currentUser.name.charAt(0).toUpperCase()}</text>
          </svg>
        `)}`
      });
    }

    setUsers(mockUsers);
  }, [participants, currentUser]);

  if (users.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
      <h4 className="text-white/80 text-sm font-medium mb-3">
        Conectados na call ({users.length})
      </h4>
      
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3">
            <div className="relative">
              {user.avatar ? (
                <Image 
                  src={user.avatar} 
                  alt={user.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5865f2] to-[#7b61ff] flex items-center justify-center text-white text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2c2f36]"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-white/90 text-sm font-medium truncate">
                {user.name}
                {currentUser && user.id === currentUser.id && (
                  <span className="text-white/60 ml-1">(você)</span>
                )}
              </div>
              <div className="text-white/60 text-xs">
                Na call
              </div>
            </div>
            
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-green-500/20 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
