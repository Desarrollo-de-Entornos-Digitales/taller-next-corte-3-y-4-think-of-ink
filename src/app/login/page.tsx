'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomButton } from '../components/buttons';
import { loginUser } from './login.service';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: any) => {
        e.preventDefault();

        try {
            const data = await loginUser(email, password);

            // guardar token
            localStorage.setItem('token', data.access_token);

            // redirigir
            router.push('/');

        } catch (error: any) {
            alert(error.message || 'Error al iniciar sesión');
        }
    };

    return (
        <main className="bg-base-200 min-h-screen flex items-center justify-center p-4">
            <div className="card bg-base-100 w-full max-w-md shadow-xl border border-slate-200 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-black tracking-tighter text-primary">INKNET</h1>
                    <p className="text-slate-500 mt-2 text-sm">Inicia sesión en tu red de tatuajes</p>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Email</span>
                        </label>
                        <input
                            type="email"
                            placeholder="nombre@ejemplo.com"
                            className="input input-bordered focus:input-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Contraseña</span>
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="input input-bordered focus:input-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <CustomButton variant="primary" className="w-full mt-4">
                        Entrar
                    </CustomButton>
                </form>

                <div className="divider text-xs text-slate-400 my-8">O ÚNETE A LA COMUNIDAD</div>

                <div className="flex flex-col gap-3">
                    <Link href="/register">
                        <CustomButton variant="outline" className="w-full">
                            Crear cuenta nueva
                        </CustomButton>
                    </Link>

                    <Link href="/forgot-password">
                        <CustomButton variant="link" className="w-full text-xs text-slate-400 uppercase">
                            ¿Olvidaste tu contraseña?
                        </CustomButton>
                    </Link>
                </div>
            </div>
        </main>
    );
}