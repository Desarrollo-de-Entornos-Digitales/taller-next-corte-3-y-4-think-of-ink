'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { AuthForm } from '../components/FormField';

import { registerUser } from './register.service';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica antes de llamar al servicio
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            // Enviamos los datos al servicio siguiendo tu interfaz: username, email, password
            const data = await registerUser(username, email, password);

            if (data) {
                alert('Cuenta creada con éxito. Ahora puedes iniciar sesión.');
                router.push('/login');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al crear la cuenta';
            alert(errorMessage);
        }
    };

    const registerFields = [
        {
            label: 'Nombre de usuario',
            type: 'text',
            placeholder: '',
            value: username,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value),
            required: true,
        },
        {
            label: 'Correo electrónico',
            type: 'email',
            placeholder: '',
            value: email,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
            required: true,
        },
        {
            label: 'Contraseña',
            type: 'password',
            placeholder: '',
            value: password,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
            required: true,
        },
        {
            label: 'Confirmar contraseña',
            type: 'password',
            placeholder: '',
            value: confirmPassword,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value),
            required: true,
        },
    ];

    return (
        <main className="min-h-screen flex bg-white text-black font-sans">
            {/* PANEL IZQUIERDO: Aspecto fiel a Captura de pantalla 2026-05-03 160335_2.png */}
            <section className="hidden md:flex md:w-[41%] bg-[#DEDEDE] p-16 flex-col justify-between">
                <div className="text-sm font-medium tracking-tight text-black">Think of ink</div>

                <div className="max-w-xs mb-20">
                    <h1 className="text-[54px] font-black leading-[1.1] mb-10 text-black tracking-tight">
                        Conecta.
                        <br />
                        Inspira.
                        <br />
                        Crea
                    </h1>
                    <p className="text-[15px] font-medium leading-relaxed text-black/80">
                        Únete a la comunidad de tatuadores, estudios y clientes. Comparte tu talento y encuentra nuevas
                        oportunidades.
                    </p>
                </div>

                <div className="opacity-0 text-xs">TOI</div>
            </section>

            {/* PANEL DERECHO: Formulario alineado */}
            <section className="flex-1 overflow-y-auto px-8 md:px-24 pt-12 pb-20 relative flex flex-col items-center">
                <div className="w-full flex justify-end text-[11px] mb-8">
                    <p className="text-gray-600">
                        ¿Ya tienes cuenta?
                        <Link href="/login" className="font-bold text-black ml-1 hover:underline">
                            Iniciar sesión
                        </Link>
                    </p>
                </div>

                <div className="w-full max-w-md">
                    <AuthForm
                        title="Crear cuenta"
                        subtitle="Completa tus datos para comenzar."
                        fields={registerFields}
                        buttonText="Crear cuenta"
                        onSubmit={handleRegister}
                    />
                </div>
            </section>
        </main>
    );
}
