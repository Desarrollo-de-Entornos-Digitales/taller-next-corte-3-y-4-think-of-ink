'use client';

import Link from 'next/link';

import { CustomButton } from '../components/buttons';

import { CardList } from './ui/CardList';

export default function Feed() {
    // Datos centra
    const infoData = [
        {
            id: 1,
            autor: 'Usuario Regular',
            ubicacion: 'Bogotá, Colombia',
            titulo: 'Busco diseño de tatuaje personalizado',
            categoria: 'Solicitud',
            descripcion:
                'Estoy buscando un diseño de tatuaje en estilo geométrico con elementos naturales. Me gustaría algo en el antebrazo. ¡Gracias!',
            imagenes: [1],
        },
        {
            id: 2,
            autor: 'Estudio Black Ink',
            ubicacion: 'Medellín, Colombia',
            titulo: 'Promoción del mes',
            categoria: 'Promoción',
            descripcion: '20% de descuento en tatuajes grandes. Agenda tu cita ahora y lleva tu idea a otro nivel.',
            imagenes: [1, 2, 3],
        },
    ];

    return (
        <main className="min-h-screen bg-white text-black font-sans">
            {/* NAVBAR SUPERIOR */}
            <nav className="h-20 border-b border-gray-200 flex items-center justify-between px-8 bg-white sticky top-0 z-50">
                <div className="flex flex-col">
                    <span className="text-xl font-bold leading-tight">Think of ink</span>
                    <span className="text-[10px] text-gray-400">Conecta ideas, crea arte.</span>
                </div>

                <div className="flex items-center gap-8">
                    <span className="text-sm font-medium">Inicio</span>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E5D9F2] flex items-center justify-center text-[#6000FF]">
                            <span className="text-xs">👤</span>
                        </div>
                        <span className="text-sm font-bold">Usuario</span>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* SIDEBAR IZQUIERDA */}
                <aside className="w-64 p-6 border-r border-gray-100 flex flex-col gap-4 h-[calc(100vh-5rem)] sticky top-20">
                    <CustomButton className="w-full bg-[#4A4A4A] border-none text-white py-3 rounded-md font-bold text-sm mb-4 hover:bg-black">
                        Nueva publicación
                    </CustomButton>

                    <div className="flex flex-col gap-1">
                        <Link href="#" className="bg-[#ECECEC] px-4 py-3 rounded-md text-sm font-bold">
                            Inicio
                        </Link>
                        <Link href="#" className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50">
                            Explorar
                        </Link>
                        <Link href="#" className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50">
                            Mi perfil
                        </Link>
                        <Link href="#" className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50">
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

                {/* CONTENIDO CENTRAL */}
                <section className="flex-1 bg-white p-8 border-l border-gray-100">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex gap-8 border-b border-gray-200 mb-8">
                            <button className="pb-3 text-xs font-bold border-b-2 border-black">Para ti</button>
                            <button className="pb-3 text-xs font-bold text-gray-400 hover:text-black">
                                Publicaciones recientes
                            </button>
                            <button className="pb-3 text-xs font-bold text-gray-400 hover:text-black">Siguiendo</button>
                        </div>

                        {/* USO DEL COMPONENTE REUTILIZABLE CARDLIST */}
                        <CardList items={infoData} />
                    </div>
                </section>
            </div>
        </main>
    );
}
