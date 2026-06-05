'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Input } from '../components/input';
import { CustomButton } from '../components/buttons';
import { registerUser } from './register.service';

export default function Register() {
    const [role, setRole] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [location, setLocation] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validaciones
        if (!role) {
            alert('Por favor selecciona un rol');
            setIsLoading(false);
            return;
        }

        if (!fullName.trim() || !username.trim() || !email.trim() || !location.trim()) {
            alert('Por favor completa todos los campos');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        if (!termsAccepted) {
            alert('Debes aceptar los términos y condiciones');
            setIsLoading(false);
            return;
        }

        try {
            const data = await registerUser(username, email, password, {
                role,
                fullName,
                location,
            });

            if (data) {
                alert('Cuenta creada con éxito. Ahora puedes iniciar sesión.');
                router.push('/login');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al crear la cuenta';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex bg-white text-black font-sans">
            <section className="hidden md:flex md:w-[41%] bg-[#D9D9D9] p-16 flex-col justify-between">
                <div className="text-sm font-medium tracking-tight text-black">Think of ink</div>

                <div className="max-w-xs mb-20">
                    <h1 className="text-[54px] font-black leading-[1.1] mb-10 text-black tracking-tight">
                        Conecta.
                        <br />
                        Inspira.
                        <br />
                        Crea
                    </h1>
                    <p className="text-[15px] font-medium leading-relaxed text-[#474747]">
                        Únete a la comunidad de tatuadores, estudios y clientes. Comparte tu talento y encuentra nuevas
                        oportunidades.
                    </p>
                </div>

                <div className="opacity-0 text-xs">TOI</div>
            </section>

            <section className="flex-1 overflow-y-auto px-8 md:px-24 pt-12 pb-20 relative">
                <div className="w-full flex justify-end text-[11px] mb-8">
                    <p className="text-[#474747]">
                        ¿Ya tienes cuenta?
                        <Link href="/login" className="font-bold text-black ml-1 hover:underline">
                            Iniciar sesión
                        </Link>
                    </p>
                </div>

                <div className="w-full max-w-md mx-auto">
                    <header className="mb-8">
                        <h2 className="text-2xl font-black mb-2 tracking-tighter uppercase">Crear cuenta</h2>
                        <p className="text-[#474747] text-xs font-bold uppercase tracking-widest">
                            Completa tus datos para comenzar.
                        </p>
                    </header>

                    <form onSubmit={handleRegister} className="space-y-6">
                        {/* Role Selection */}
                        <div>
                            <label className="text-[11px] font-black uppercase tracking-widest text-black ml-1 block mb-3">
                                Soy...
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Usuario', 'Tatuador/Estudio'].map((roleOption) => (
                                    <button
                                        key={roleOption}
                                        type="button"
                                        onClick={() => setRole(roleOption)}
                                        className={`py-4 px-3 rounded-md border-2 font-bold text-sm transition-all ${
                                            role === roleOption
                                                ? 'border-black bg-black text-white'
                                                : 'border-[#D9D9D9] bg-white text-black hover:border-black'
                                        }`}
                                    >
                                        {roleOption}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Full Name */}
                        <Input
                            label="Nombre completo"
                            type="text"
                            placeholder=""
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />

                        {/* Username */}
                        <Input
                            label="Nombre de usuario"
                            type="text"
                            placeholder=""
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        {/* Email */}
                        <Input
                            label="Correo electrónico"
                            type="email"
                            placeholder=""
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        {/* Password */}
                        <Input
                            label="Contraseña"
                            type="password"
                            placeholder=""
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* Confirm Password */}
                        <Input
                            label="Confirmar contraseña"
                            type="password"
                            placeholder=""
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        {/* Location */}
                        <Input
                            label="Ubicación"
                            type="text"
                            placeholder=""
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />

                        {/* Terms and Conditions */}
                        <div className="flex items-center gap-3 py-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                className="w-4 h-4 rounded border-2 border-[#D9D9D9] cursor-pointer accent-black"
                            />
                            <label htmlFor="terms" className="text-xs font-medium text-[#474747] cursor-pointer">
                                Acepto los Términos de servicio y la Política de privacidad.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <CustomButton
                            type="submit"
                            isLoading={isLoading}
                            className="w-full bg-black text-white py-5 font-black tracking-[0.2em] uppercase text-xs hover:bg-[#333] transition-all shadow-xl active:scale-[0.98] rounded-md border-none"
                        >
                            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </CustomButton>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-[#D9D9D9]"></div>
                        <span className="text-xs font-bold text-[#474747]">o registrate con</span>
                        <div className="flex-1 h-px bg-[#D9D9D9]"></div>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="space-y-3">
                        <button className="w-full py-3 px-4 border-2 border-[#D9D9D9] rounded-md font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                            Continuar con Google
                        </button>

                        <button className="w-full py-3 px-4 border-2 border-[#D9D9D9] rounded-md font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                            Continuar con Facebook
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
