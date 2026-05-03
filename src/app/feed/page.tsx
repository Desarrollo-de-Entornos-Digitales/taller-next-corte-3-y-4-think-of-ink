'use client';

import Link from 'next/link';

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
        {
            id: 3,
            author: 'Tatuador Independiente',
            location: 'Cali, Colombia',
            time: '6h',
            title: 'Nuevo diseño disponible',
            content: 'Disponible para tatuar este diseño en realismo. ¡Escríbeme para más info!',
            images: [1],
        },
    ];

    return (
        <main className="min-h-screen bg-white flex flex-col font-sans text-black">
            <header className="h-24 border-b border-gray-100 flex items-center justify-between px-12 bg-white sticky top-0 z-50">
                <div className="flex flex-col">
                    <span className="text-2xl font-black tracking-tighter uppercase">Think of ink</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                        Conecta ideas, crea arte.
                    </span>
                </div>

                <div className="flex items-center gap-12">
                    <nav className="hidden md:flex">
                        <Link href="#" className="text-sm font-black border-b-2 border-black pb-1">
                            Inicio
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#E5D9F2] flex items-center justify-center text-[#6000FF]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7"
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
                        <span className="text-sm font-black">Usuario</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                <aside className="w-72 border-r border-gray-100 p-8 hidden lg:flex flex-col gap-6 sticky top-24 h-[calc(100vh-6rem)]">
                    <button className="w-full bg-[#4A4A4A] text-white font-black py-4 rounded-md text-sm hover:bg-black transition-colors mb-2">
                        Nueva publicación
                    </button>

                    <nav className="flex flex-col gap-2">
                        <SidebarLink label="Inicio" active />
                        <SidebarLink label="Explorar" />
                        <div className="flex items-center gap-4 px-4 py-3">
                            <div className="w-8 h-8 rounded-full border-2 border-[#E5D9F2] flex items-center justify-center text-[#6000FF] opacity-70">
                                <span className="text-xs">👤</span>
                            </div>
                            <span className="text-sm font-black">Mi perfil</span>
                        </div>
                        <SidebarLink label="Configuración" />
                    </nav>

                    <div className="mt-12 pt-12 border-t border-gray-100">
                        <h3 className="text-xl font-black mb-6">Filtros</h3>
                        <div className="flex flex-col gap-5">
                            <button className="text-sm font-bold text-left hover:text-gray-500 transition-colors">
                                Ubicación
                            </button>
                            <button className="text-sm font-bold text-left hover:text-gray-500 transition-colors">
                                Categoría
                            </button>
                            <button className="text-sm font-bold text-left hover:text-gray-500 transition-colors">
                                Rango de precio
                            </button>
                        </div>
                    </div>
                </aside>

                <section className="flex-1 bg-white p-8 lg:p-12 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex gap-10 border-b border-gray-100 mb-10">
                            <button className="pb-4 text-[11px] font-black border-b-2 border-black uppercase tracking-widest">
                                Para ti
                            </button>
                            <button className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-black">
                                Publicaciones recientes
                            </button>
                            <button className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-black">
                                Siguiendo
                            </button>
                        </div>

                        <div className="space-y-10">
                            {infoData.length > 0 ? (
                                infoData.map((post) => (
                                    <div key={post.id} className="border border-gray-200 rounded-2xl p-8 bg-white">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-[#E5D9F2] flex items-center justify-center text-[#6000FF]">
                                                <span className="text-xs">👤</span>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black leading-none mb-1">{post.author}</h4>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                                    {post.location} . {post.time}
                                                </p>
                                            </div>
                                        </div>

                                        <h3 className="text-base font-black mb-2">{post.title}</h3>
                                        <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                                            {post.content}
                                        </p>

                                        <div
                                            className={`grid gap-4 ${post.images.length > 1 ? 'grid-cols-3' : 'grid-cols-1'}`}
                                        >
                                            {post.images.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={`bg-[#D9D9D9] border border-gray-300 rounded-lg relative overflow-hidden flex items-center justify-center
                                                        ${post.images.length === 1 ? 'aspect-[2.4/1]' : 'aspect-square'}`}
                                                >
                                                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-[150%] h-[1px] bg-black rotate-[20deg]"></div>
                                                            <div className="w-[150%] h-[1px] bg-black -rotate-[20deg]"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-24 text-center border-2 border-dashed border-gray-200 rounded-3xl">
                                    <h2 className="text-2xl font-black text-gray-300 italic uppercase">
                                        Sin contenido disponible
                                    </h2>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

function SidebarLink({ label, active = false }: { label: string; active?: boolean }) {
    return (
        <button
            className={`flex items-center gap-4 px-4 py-3 rounded-md text-sm font-black transition-all ${
                active ? 'bg-[#ECECEC] text-black' : 'text-black hover:bg-gray-50'
            }`}
        >
            {label}
        </button>
    );
}
