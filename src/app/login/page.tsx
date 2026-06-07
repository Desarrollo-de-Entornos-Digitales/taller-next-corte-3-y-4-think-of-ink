'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { AuthForm } from '../components/FormField';
import { loginUser } from './login.service';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = await loginUser(email, password);

            if (data?.access_token) {
                localStorage.setItem('token', data.access_token);

                window.location.href = '/feed';
            }
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || 'Credenciales inválidas. Inténtalo de nuevo.';
            alert(errorMessage);
        }
    };

    const loginFields = [
        {
            label: 'Correo electrónico',
            type: 'email',
            placeholder: 'usuario@gmail.com',
            value: email,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
            required: true,
        },
        {
            label: 'Contraseña',
            type: 'password',
            placeholder: '••••••••',
            value: password,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
            required: true,
        },
    ];

    return (
        <main className="min-h-screen flex flex-col md:flex-row bg-white text-black font-sans">
            <section className="md:w-[35%] bg-[#F2F2F2] p-10 md:p-16 flex flex-col justify-between relative border-r border-gray-100">
                <div className="text-xl font-black tracking-tighter uppercase">Think of ink</div>

                <div className="mb-20">
                    <h1 className="text-6xl font-black leading-[1] mb-8 uppercase tracking-tighter">
                        Conecta ideas, crea arte.
                    </h1>

                    <p className="text-[15px] font-medium leading-relaxed text-black/80">
                        La red social para amantes del tatuaje. Encuentra inspiración, comparte tu
                        talento y conecta con estudios y clientes.
                    </p>
                </div>
            </section>

            <section className="flex-1 flex flex-col p-10 md:p-20 relative justify-center">
                <div className="absolute top-12 right-12 text-[11px] font-black uppercase tracking-widest">
                    ¿No tienes cuenta?
                    <Link
                        href="/register"
                        data-cy="link-to-register"
                        className="border-b-2 border-black pb-0.5 ml-2 hover:text-gray-600 transition-colors"
                    >
                        Regístrate
                    </Link>
                </div>

                <AuthForm
                    title="Iniciar Sesión"
                    subtitle="Bienvenido de nuevo a la comunidad."
                    fields={loginFields}
                    buttonText="Entrar en la red"
                    onSubmit={handleLogin}
                    footer={
                        <div className="text-center">
                            <Link
                                href="/forgot-password"
                                className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    }
                />
            </section>
        </main>
    );
}
