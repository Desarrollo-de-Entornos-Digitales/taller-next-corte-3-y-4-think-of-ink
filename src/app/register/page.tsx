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

    // 👉 función async (está bien)
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
        <main className="flex items-center justify-center min-h-screen">
            <div className="w-96 p-6 shadow-lg border">
                <h2 className="text-xl mb-4">Registro</h2>

                <form onSubmit={(e) => handleRegister(e)} className="flex flex-col gap-3">
                    <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />

                    <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">Registrarse</button>
                </form>

                <Link href="/login">Ir al login</Link>
            </div>
        </main>
    );
}
