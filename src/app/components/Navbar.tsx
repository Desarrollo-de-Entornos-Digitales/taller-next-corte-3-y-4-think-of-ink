'use client';

import { useRouter } from 'next/navigation';

export function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="h-20 border-b border-gray-200 flex items-center justify-between px-8 bg-white sticky top-0 z-50">
      <div className="flex flex-col">
        <span className="text-xl font-bold leading-tight">Think of ink</span>
        <span className="text-[10px] text-gray-400">Conecta ideas, crea arte.</span>
      </div>

      <div className="flex items-center gap-8">
        <span className="text-sm font-medium">Inicio</span>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E5D9F2] flex items-center justify-center text-[#6000FF]">
            👤
          </div>
          <span className="text-sm font-bold">Usuario</span>
        </div>

        <button onClick={handleLogout} className="text-sm font-bold text-red-500">
          Logout
        </button>
      </div>
    </nav>
  );
}