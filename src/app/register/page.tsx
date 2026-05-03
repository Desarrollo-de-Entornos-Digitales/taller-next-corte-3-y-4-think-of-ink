'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from './register.service';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerUser(username, email, password);
            alert('Usuario creado');
            router.push('/login');
        } catch (error) {
            console.error(error);
            alert('Error al registrar');
        }
    };

    return (
        <main className="flex min-h-screen bg-white font-sans">
            {/* Sección Izquierda: Informativa (Captura de pantalla 2026-05-03 160335.png) */}
            <section className="hidden lg:flex flex-col justify-between w-1/3 bg-[#D9D9D9] p-12">
                <div className="text-black font-medium text-lg">Think of ink</div>
                
                <div className="space-y-6">
                    <h1 className="text-6xl font-bold leading-tight text-black italic">
                        Conecta.<br />Inspira.<br />Crea
                    </h1>
                    <p className="text-xl text-black/70 max-w-sm leading-relaxed italic">
                        Únete a la comunidad de tatuadores, estudios y clientes. 
                        Comparte tu talento y encuentra nuevas oportunidades.
                    </p>
                </div>
                
                <div className="h-10"></div>
            </section>

            {/* Sección Derecha: Formulario (Sin Ubicación, Nombre Completo ni Rol) */}
            <section className="flex-1 flex flex-col p-8 lg:p-20 relative">
                <div className="absolute top-10 right-10 text-sm italic">
                    <span className="text-gray-500 font-bold">¿Ya tienes cuenta? </span>
                    <Link href="/login" className="font-black text-black hover:underline">
                        Iniciar sesión
                    </Link>
                </div>

                <div className="max-w-md w-full mx-auto mt-20 italic">
                    <h2 className="text-4xl font-black text-black mb-2 tracking-tight">Crear cuenta</h2>
                    <p className="text-gray-500 mb-10 font-bold">Completa tus datos para comenzar.</p>

                    <form onSubmit={handleRegister} className="space-y-6 not-italic">
                        {/* Campo: Username */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-black text-black uppercase tracking-wider">Nombre de usuario</label>
                            <input 
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-black font-medium"
                                required
                            />
                        </div>

                        {/* Campo: Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-black text-black uppercase tracking-wider">Correo electrónico</label>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-black font-medium"
                                required
                            />
                        </div>

                        {/* Campo: Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-black text-black uppercase tracking-wider">Contraseña</label>
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-black font-medium"
                                required
                            />
                        </div>

                        {/* Checkbox de términos */}
                        <div className="flex items-start gap-3 py-2 italic">
                            <input type="checkbox" className="w-4 h-4 mt-0.5 accent-black cursor-pointer" required />
                            <label className="text-xs text-gray-500 font-bold leading-tight">
                                Acepto los Términos de servicio y la Política de privacidad.
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-black text-white font-black py-4 rounded-md hover:bg-zinc-800 transition-all active:scale-[0.98] mt-4 text-sm uppercase tracking-widest"
                        >
                            Crear cuenta
                        </button>
                    </form>

                    {/* Separador */}
                    <div className="relative my-10 not-italic">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                            <span className="bg-white px-4 text-gray-400">o regístrate con</span>
                        </div>
                    </div>

                    {/* Botones Sociales */}
                    <div className="space-y-3 not-italic">
                        <SocialButton icon="G" label="Continuar con Google" />
                        <SocialButton icon="f" label="Continuar con Facebook" />
                    </div>
                </div>
            </section>
        </main>
    );
}

function SocialButton({ icon, label }: { icon: string, label: string }) {
    return (
        <button type="button" className="w-full border border-gray-200 rounded-md py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors text-xs font-black text-black uppercase tracking-widest">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-100 text-[10px]">{icon}</span>
            {label}
        </button>
    );
}