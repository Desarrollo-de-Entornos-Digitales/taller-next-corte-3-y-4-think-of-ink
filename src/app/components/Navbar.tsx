'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const Navbar = () => {
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-20">
            <div className="h-full px-8 flex items-center justify-between">
                <div>
                    <Link href="/feed" className="text-lg font-black tracking-tight block">
                        Think of Ink
                    </Link>
                    <p className="text-xs text-gray-500 font-medium">Conecta ideas, crea arte.</p>
                </div>

                <div className="flex items-center gap-8">
                    <Link href="/feed" className="text-sm font-bold text-gray-600 hover:text-black">
                        Inicio
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="text-sm font-bold text-gray-600 hover:text-black flex items-center gap-2"
                        >
                            <div className="w-6 h-6 rounded-full bg-[#E5D9F2] flex items-center justify-center text-xs">
                                👤
                            </div>
                            <span>Usuario</span>
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
                                <Link
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
                                >
                                    Mi perfil
                                </Link>
                                <Link
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
                                >
                                    Configuración
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};