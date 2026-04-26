'use client';

import Link from 'next/link';

/*import { InfoCard } from '@/components/ui/InfoCard';*/

export default function Feed() {
    const infoData = [];

    return (
        <main className="bg-base-200 min-h-screen relative">
            <div className="navbar bg-base-100 shadow-sm px-4 md:px-8">
                <div className="flex-1">
                    <span className="text-xl font-bold tracking-tight text-primary">APP NAME</span>
                </div>
                <div className="flex-none gap-2">
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar border border-slate-200"
                        >
                            <div className="w-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                                <span className="text-xs">JD</span>
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                        >
                            <li>
                                <a>Perfil</a>
                            </li>
                            <li>
                                <a>Ajustes</a>
                            </li>
                            <hr className="my-1 border-slate-200" />
                            <li>
                                <Link href="/login">Cerrar Sesión</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6 md:p-10">
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-800">Panel de Información</h1>
                    <p className="text-slate-500 mt-1">Explora las últimas actualizaciones y contenido disponible.</p>
                </header>

                {/* Zona de Contenido Visual */}
                {infoData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
                ) : (
                    /* Placeholder Visual de "Estado Vacío" Neutro */
                    <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white/40 rounded-3xl border-2 border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center mb-6 rotate-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-slate-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-700">Sin contenido disponible</h2>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2">
                            Actualmente no hay tarjetas de información para mostrar. Los nuevos elementos aparecerán
                            aquí automáticamente.
                        </p>
                    </div>
                )}
            </div>

            <button className="btn btn-primary btn-circle btn-lg fixed bottom-8 right-8 shadow-2xl">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </main>
    );
}
