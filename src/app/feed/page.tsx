'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { CustomButton } from '../components/buttons';
import { Navbar } from '../components/Navbar';
import { InfoCard } from './ui/InfoCard';

export default function Feed() {
    const [infoData, setInfoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login';
        }
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch('http://localhost:3002/post', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                const mappedData = data.map((post: any) => ({
                    id: post.id,
                    autor: post.user?.username || 'Usuario Regular',
                    ubicacion: post.user?.location || 'Colombia',
                    titulo: 'Nueva publicación',
                    categoria: post.category?.name || 'General',
                    descripcion: post.content,
                    imagenes: post.imageUrl ? [post.imageUrl] : [],
                    timeAgo: '3h',
                }));

                setInfoData(mappedData);
            } catch (error) {
                console.error('Error obteniendo posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const itemsPerPage = 2;
    const totalPages = Math.ceil(infoData.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentItems = infoData.slice(start, end);

    return (
        <main className="min-h-screen bg-white text-black font-sans">
            <Navbar />

            <div className="flex">
                <aside className="w-64 p-6 border-r border-gray-100 flex flex-col gap-4 h-[calc(100vh-5rem)] sticky top-20">
                    <CustomButton className="w-full bg-[#4A4A4A] border-none text-white py-3 rounded-md font-bold text-sm mb-4 hover:bg-black">
                        Nueva publicación
                    </CustomButton>

                    <div className="flex flex-col gap-1">
                        <Link href="/feed" className="bg-[#ECECEC] px-4 py-3 rounded-md text-sm font-bold">
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

                <section className="flex-1 bg-white p-8 border-l border-gray-100">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex gap-8 border-b border-gray-200 mb-8">
                            <button className="pb-3 text-xs font-bold border-b-2 border-black">
                                Para ti
                            </button>

                            <button className="pb-3 text-xs font-bold text-gray-400 hover:text-black">
                                Publicaciones recientes
                            </button>

                            <button className="pb-3 text-xs font-bold text-gray-400 hover:text-black">
                                Siguiendo
                            </button>
                        </div>

                        {loading && (
                            <div className="flex justify-center py-10">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                        )}

                        {!loading && infoData.length > 0 && (
                            <>
                                <div className="flex flex-col gap-6">
                                    {currentItems.map((item) => (
                                        <InfoCard
                                            key={item.id}
                                            titulo={item.titulo}
                                            descripcion={item.descripcion}
                                            categoria={item.categoria}
                                            autor={item.autor}
                                            ubicacion={item.ubicacion}
                                            imagenes={item.imagenes.length > 0 ? Array(item.imagenes.length) : []}
                                            onVerMas={() => console.log(`Ver publicación ${item.id}`)}
                                        />
                                    ))}
                                </div>

                                <div className="flex justify-center gap-2 mt-10">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                                                page === currentPage
                                                    ? 'bg-black text-white'
                                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {!loading && infoData.length === 0 && (
                            <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center">
                                <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">
                                    No hay publicaciones todavía
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}