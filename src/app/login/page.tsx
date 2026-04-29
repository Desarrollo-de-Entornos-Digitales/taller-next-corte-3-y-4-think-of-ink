'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { loginUser } from './login.service';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: any) => {
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
        <main className="bg-base-200 min-h-screen flex items-center justify-center p-4">
            <div className="card bg-base-100 w-full max-w-md shadow-xl border border-slate-200 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-black tracking-tighter text-primary">INKNET</h1>
                    <p className="text-slate-500 mt-2 text-sm">Inicia sesión</p>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="input input-bordered w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="input input-bordered w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* ⚠️ BOTÓN NORMAL PARA EVITAR ERRORES */}
                    <button type="submit" className="btn btn-primary w-full">
                        Entrar
                    </button>
                </form>

                <div className="divider">O</div>

                <Link href="/register">
                    <button className="btn btn-outline w-full">Crear cuenta</button>
                </Link>
            </div>
        </main>
    );
}
