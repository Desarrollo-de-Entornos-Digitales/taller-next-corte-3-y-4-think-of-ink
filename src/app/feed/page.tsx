'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/Input'; // Mantenemos la importación por si la necesitas en modales

export default function Feed() {
    const infoData = [
        {
            id: 1,
            author: 'Usuario Regular',
            location: 'Bogotá, Colombia',
            time: '2h',
            title: 'Busco diseño de tatuaje personalizado',
            content:
                'Estoy buscando un diseño de tatuaje en estilo geométrico con elementos naturales. Me gustaría algo en el antebrazo. ¡Gracias!',
            images: [1],
        },
        {
            id: 2,
            author: 'Estudio Black Ink',
            location: 'Medellín, Colombia',
            time: '4h',
            title: 'Promoción del mes',
            content: '20% de descuento en tatuajes grandes. Agenda tu cita y lleva tu idea a otro nivel.',
            images: [1, 2, 3],
        },
    ];

    return (
        <main className="min-h-screen bg-white text-black font-sans">
            {/* --- NAVBAR SUPERIOR --- */}
            <nav className="h-20 border-b border-gray-200 flex items-center justify-between px-8 bg-white sticky top-0 z-50">
                <div className="flex flex-col">
                    <span className="text-xl font-bold leading-tight">Think of ink</span>
                    <span className="text-[10px] text-gray-400">Conecta ideas, crea arte.</span>
                </div>

                <div className="flex items-center gap-8">
                    <span className="text-sm font-medium">Inicio</span>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E5D9F2] flex items-center justify-center text-[#6000FF]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                        <span className="text-sm font-bold">Usuario</span>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* --- SIDEBAR IZQUIERDA --- */}
                <aside className="w-64 p-6 border-r border-gray-100 flex flex-col gap-4 h-[calc(100vh-5rem)] sticky top-20">
                    <button className="w-full bg-[#4A4A4A] text-white py-3 rounded-md font-bold text-sm mb-4 hover:bg-black transition-colors">
                        Nueva publicación
                    </button>

                    <div className="flex flex-col gap-1">
                        <Link href="#" className="bg-[#ECECEC] px-4 py-3 rounded-md text-sm font-bold">
                            Inicio
                        </Link>
                        <Link
                            href="#"
                            className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-md"
                        >
                            Explorar
                        </Link>
                        <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 rounded-md">
                            <div className="w-7 h-7 rounded-full border border-[#E5D9F2] flex items-center justify-center text-[#6000FF]">
                                <span className="text-[10px]">👤</span>
                            </div>
                            <span className="text-sm font-bold text-gray-600">Mi perfil</span>
                        </div>
                        <Link
                            href="#"
                            className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-md"
                        >
                            Configuración
                        </Link>
                    </div>

                    <div className="mt-auto border-t border-gray-100 pt-6">
                        <h3 className="font-bold text-lg mb-4">Filtros</h3>
                        <div className="flex flex-col gap-4 text-sm font-bold text-gray-600">
                            <button className="text-left hover:text-black">Ubicación</button>
                            <button className="text-left hover:text-black">Categoría</button>
                            <button className="text-left hover:text-black">Rango de precio</button>
                        </div>
                    </div>
                </aside>

                {/* --- CONTENIDO CENTRAL (FEED) --- */}
                <section className="flex-1 bg-white p-8 border-l border-gray-100">
                    <div className="max-w-3xl mx-auto">
                        {/* TABS DE FILTRADO */}
                        <div className="flex gap-8 border-b border-gray-200 mb-8">
                            <button className="pb-3 text-xs font-bold border-b-2 border-black">Para ti</button>
                            <button className="pb-3 text-xs font-bold text-gray-400 hover:text-black transition-colors">
                                Publicaciones recientes
                            </button>
                            <button className="pb-3 text-xs font-bold text-gray-400 hover:text-black transition-colors">
                                Siguiendo
                            </button>
                        </div>

                        {/* LISTA DE POSTS */}
                        <div className="space-y-6">
                            {infoData.map((post) => (
                                <div key={post.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-[#E5D9F2] flex items-center justify-center text-[#6000FF]">
                                            <span className="text-[10px]">👤</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">{post.author}</p>
                                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">
                                                {post.location} . {post.time}
                                            </p>
                                        </div>
                                    </div>

                                    <h4 className="text-sm font-bold mb-1 tracking-tight">{post.title}</h4>
                                    <p className="text-[11px] text-gray-500 leading-relaxed mb-4">{post.content}</p>

                                    {/* GRID DE IMÁGENES (BOCETOS) */}
                                    <div
                                        className={`grid gap-2 ${post.images.length > 1 ? 'grid-cols-3' : 'grid-cols-1'}`}
                                    >
                                        {post.images.map((_, i) => (
                                            <div
                                                key={i}
                                                className={`bg-[#D9D9D9] border border-gray-200 rounded flex items-center justify-center relative overflow-hidden 
                                                    ${post.images.length === 1 ? 'aspect-[2.5/1]' : 'aspect-square'}`}
                                            >
                                                {/* Efecto de líneas cruzadas de la referencia */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                                    <div className="w-[150%] h-[0.5px] bg-black rotate-[20deg]"></div>
                                                    <div className="w-[150%] h-[0.5px] bg-black -rotate-[20deg]"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
