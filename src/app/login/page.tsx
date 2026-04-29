'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { loginUser } from './login.service';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await loginUser(email, password);
            localStorage.setItem('token', data.access_token);
            router.push('/');
        } catch (error: any) {
            alert('Credenciales inválidas');
        }
    };

    return (
        <main className="min-h-screen flex flex-col md:flex-row bg-white text-black font-sans">
            <section className="md:w-[35%] bg-[#E5E5E5] p-10 md:p-16 flex flex-col justify-between relative">
                <div className="text-xl font-semibold tracking-tight">Think of ink</div>

                <div className="mb-20">
                    <h1 className="text-6xl font-bold leading-[1.1] mb-8">
                        Conecta
                        <br />
                        ideas, crea
                        <br />
                        arte.
                    </h1>
                    <p className="text-gray-600 text-lg max-w-xs leading-relaxed">
                        La red social para amantes del tatuaje. Encuentra inspiración, comparte tu talento y conecta con
                        estudios y clientes.
                    </p>
                </div>

                <div className="w-10 h-10 bg-[#222] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    N
                </div>
            </section>

            <section className="flex-1 flex flex-col p-10 md:p-20 relative justify-center">
                <div className="absolute top-10 right-10 text-sm">
                    ¿No tienes cuenta?{' '}
                    <Link href="/register" className="font-bold border-b border-black">
                        Regístrate
                    </Link>
                </div>

                <div className="max-w-md w-full mx-auto">
                    <header className="mb-12">
                        <h2 className="text-4xl font-bold mb-3 tracking-tight">Iniciar Sesión</h2>
                        <p className="text-gray-500">Bienvenido de nuevo, inicia sesión para continuar.</p>
                    </header>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold uppercase tracking-wider">Correo electrónico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-400 p-3 rounded-none focus:outline-none focus:border-black transition-colors"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold uppercase tracking-wider">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-400 p-3 rounded-none focus:outline-none focus:border-black transition-colors"
                            />
                            <div className="text-right mt-1">
                                <Link
                                    href="/forgot-password"
                                    title="password-error"
                                    className="text-xs text-gray-400 hover:text-black"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-4 font-bold tracking-widest uppercase text-sm hover:bg-gray-900 transition-all shadow-lg active:scale-[0.98]"
                        >
                            Iniciar Sesión
                        </button>
                    </form>

                    <div className="relative my-12">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-4">
                                <div className="w-3 h-3 border border-gray-400 rounded-full bg-white"></div>
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button className="w-full border border-gray-300 py-3 font-bold text-sm hover:bg-gray-50 transition-colors">
                            Continuar con Google
                        </button>
                        <button className="w-full border border-gray-300 py-3 font-bold text-sm hover:bg-gray-50 transition-colors">
                            Continuar con Facebook
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
