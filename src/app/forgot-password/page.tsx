'use client';

import Link from 'next/link';

import { CustomButton } from '../components/buttons';

export default function ForgotPassword() {
    return (
        <main className="bg-base-200 min-h-screen flex items-center justify-center p-4">
            <div className="card bg-base-100 w-full max-w-md shadow-xl border border-slate-200 p-8">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-6">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Acceso Denegado</h1>

                    <p className="py-4 text-slate-600 text-sm leading-relaxed">
                        Lo sentimos, la contraseña y/o el nombre de usuario que has introducido no coinciden con
                        nuestros registros.
                    </p>

                    <div className="divider w-full my-4"></div>

                    <div className="flex flex-col w-full gap-3 mt-2">
                        <Link href="/login" className="w-full">
                            <CustomButton variant="primary" className="w-full">
                                Intentar de nuevo
                            </CustomButton>
                        </Link>

                        <Link href="/register" className="w-full">
                            <CustomButton variant="outline" className="w-full">
                                No tengo una cuenta
                            </CustomButton>
                        </Link>
                    </div>

                    <div className="mt-8">
                        <Link href="/">
                            <CustomButton variant="link" className="text-xs text-slate-400">
                                Volver al inicio
                            </CustomButton>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
