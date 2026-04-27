'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { CustomButton } from '../components/buttons';
import { registerUser } from './register.service';

export default function Register() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log('CLICK REGISTER'); // prueba

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
        <main className="bg-base-200 min-h-screen flex items-center justify-center p-4">
            <div className="card bg-base-100 w-full max-w-md shadow-xl border border-slate-200 p-8">
                <h1 className="text-4xl font-bold text-center mb-2">Únete</h1>
                <p className="text-slate-500 text-center mb-8 text-sm">Crea tu perfil para empezar a compartir.</p>

                <form onSubmit={(e) => handleRegister(e)}>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Nombre de Usuario</span>
                        </label>
                        <input
                            type="text"
                            placeholder="@artist_name"
                            className="input input-bordered"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            placeholder="correo@ejemplo.com"
                            className="input input-bordered"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Contraseña</span>
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="input input-bordered"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <CustomButton type="submit" variant="primary" className="w-full mt-4">
                        Registrarse
                    </CustomButton>

                </form>

                <div className="divider text-xs text-slate-400">¿YA TIENES CUENTA?</div>

                <Link href="/login" className="w-full">
                    <CustomButton variant="outline" className="w-full">
                        Volver al Login
                    </CustomButton>
                </Link>
            </div>
        </main>
    );
}