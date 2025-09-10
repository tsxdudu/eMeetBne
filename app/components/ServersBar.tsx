"use client";

import { useState } from "react";

type Server = { id: string; name: string };

export default function ServersBar({ onSelect }: { onSelect?: (id: string) => void }) {
  const servers: Server[] = [
    { id: "s1", name: "eMeetBNE" },
    { id: "s2", name: "Dev Squad" },
  ];
  const [active, setActive] = useState(servers[0].id);

  function handleSelect(id: string) {
    setActive(id);
    onSelect?.(id);
  }

  return (
    <div className="hidden sm:flex flex-col items-center gap-3 w-16 py-4 bg-[rgba(0,0,0,0.12)]">
      {servers.map((s) => (
        <button key={s.id} onClick={() => handleSelect(s.id)} className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold ${active === s.id ? "ring-2 ring-[#5865f2]" : "bg-white/6"}`}>
          {s.name.charAt(0)}
        </button>
      ))}
    </div>
  );
}
