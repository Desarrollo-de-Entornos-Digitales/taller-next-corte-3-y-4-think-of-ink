'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/Input'; // Importamos tu nuevo componente

export default function Feed() {
    const infoData = [
        { id: 1, author: 'Usuario Regular', location: 'Bogotá', time: '2h', title: 'Busco diseño personalizado', content: 'Estilo geométrico para antebrazo.', images: [1] },
        { id: 2, author: 'Estudio Black Ink', location: 'Medellín', time: '4h', title: 'Promoción del mes', content: '20% de descuento en piezas grandes.', images: [1, 2, 3] },
    ];

    return (
        <main className="min-h-screen bg-white flex flex-col font-sans text-black">
            <header className="h-24 border-b border-gray-100 flex items-center justify-between px-12 bg-white sticky top-0 z-50">
                <div className="flex flex-col">
                    <span className="text-2xl font-black tracking-tighter uppercase">Think of ink</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Conecta ideas, crea arte.</span>
                </div>
                <div className="flex items-center gap-12">
                    <div className="w-64 hidden md:block">
                        {/* INPUT REUTILIZABLE: Usado como buscador */}
                        <Input placeholder="Buscar tatuajes o estudios..." className="py-2" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#E5D9F2] flex items-center justify-center text-[#6000FF]">
                            <span className="text-xs">👤</span>
                        </div>
                        <span className="text-sm font-black">Usuario</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                <aside className="w-72 border-r border-gray-100 p-8 hidden lg:flex flex-col gap-6 sticky top-24 h-[calc(100vh-6rem)]">
                    <button className="w-full bg-[#4A4A4A] text-white font-black py-4 rounded-md text-sm hover:bg-black transition-colors">
                        Nueva publicación
                    </button>
                    <nav className="flex flex-col gap-2">
                        <SidebarLink label="Inicio" active />
                        <SidebarLink label="Explorar" />
                        <SidebarLink label="Mi perfil" />
                    </nav>
                </aside>

                <section className="flex-1 bg-white p-8 lg:p-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex gap-10 border-b border-gray-100 mb-10">
                            <button className="pb-4 text-[11px] font-black border-b-2 border-black uppercase tracking-widest">Para ti</button>
                            <button className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Recientes</button>
                        </div>

                        <div className="space-y-10">
                            {infoData.map((post) => (
                                <article key={post.id} className="border border-gray-200 rounded-2xl p-8 bg-white">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-[#E5D9F2] flex items-center justify-center text-[#6000FF]">
                                            <span className="text-xs">👤</span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black leading-none mb-1">{post.author}</h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{post.location} . {post.time}</p>
                                        </div>
                                    </div>
                                    <h3 className="text-base font-black mb-2">{post.title}</h3>
                                    <p className="text-xs text-gray-500 font-medium mb-6">{post.content}</p>
                                    <div className={`grid gap-4 ${post.images.length > 1 ? 'grid-cols-3' : 'grid-cols-1'}`}>
                                        {post.images.map((_, i) => (
                                            <div key={i} className={`bg-[#D9D9D9] rounded-lg relative overflow-hidden ${post.images.length === 1 ? 'aspect-[2.4/1]' : 'aspect-square'}`}>
                                                <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                                                    <div className="w-full h-[1px] bg-black rotate-12"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

function SidebarLink({ label, active = false }: { label: string, active?: boolean }) {
    return (
        <button className={`flex items-center gap-4 px-4 py-3 rounded-md text-sm font-black transition-all ${
            active ? 'bg-[#ECECEC] text-black' : 'text-black hover:bg-gray-50'
        }`}>
            {label}
        </button>
    );
}