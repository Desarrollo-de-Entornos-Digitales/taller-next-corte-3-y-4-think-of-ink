'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Navbar } from '../components/Navbar';
import { InfoCard } from './ui/InfoCard';
import { Pencil, Megaphone, MessageCircle, Upload, Heart, Bookmark } from 'lucide-react';
import { getAllPosts, createPost, normalizePostsResponse } from '@/lib/api/posts';

export default function Feed() {
    const [infoData, setInfoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showNewPostModal, setShowNewPostModal] = useState(false);
    const [postType, setPostType] = useState('Diseño');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isPublishing, setIsPublishing] = useState(false);
    const [username, setUsername] = useState('Usuario Regular');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
        }
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setError(null);
                setLoading(true);
                const token = localStorage.getItem('token');

                if (!token) {
                    setError('Token no disponible');
                    return;
                }

                // Usar el nuevo servicio con endpoint correcto
                const response = await getAllPosts(token);
                const postsArray = normalizePostsResponse(response);

                const mappedData = postsArray.map((post: any) => ({
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
                setError('No pudimos cargar las publicaciones. Intenta nuevamente.');
                setInfoData([]);
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setImages((prev) => [...prev, event.target?.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handlePublish = async () => {
        if (!title.trim() || !description.trim() || !category) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        setIsPublishing(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Token no disponible');
                return;
            }

            await createPost(
                {
                    content: description,
                    category: { name: category },
                    location: location,
                    imageUrl: images.length > 0 ? images[0] : null,
                    postType: postType,
                    title: title,
                },
                token
            );

            alert('Publicación creada con éxito!');
            // Reset form
            setTitle('');
            setDescription('');
            setCategory('');
            setLocation('');
            setImages([]);
            setPostType('Diseño');
            setShowNewPostModal(false);
            // Refresh posts without recargar la página
            const response = await getAllPosts(token);
            const postsArray = normalizePostsResponse(response);
            const mappedData = postsArray.map((post: any) => ({
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
            console.error('Error:', error);
            alert('Error al publicar. Intenta nuevamente.');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <main className="min-h-screen bg-white text-black font-sans">
            <Navbar />

            <div className="flex pt-20">
                <aside className="w-64 p-6 border-r border-gray-100 flex flex-col gap-4 h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto">
                    <button
                        onClick={() => setShowNewPostModal(true)}
                        className="w-full bg-[#4A4A4A] text-white py-3 rounded-md font-bold text-sm mb-4 hover:bg-black transition-colors"
                    >
                        Nueva publicación
                    </button>

                    <div className="flex flex-col gap-1">
                        <Link
                            href="/feed"
                            className="bg-[#ECECEC] px-4 py-3 rounded-md text-sm font-bold transition-colors"
                        >
                            Inicio
                        </Link>

                        <Link
                            href="#"
                            className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
                        >
                            Explorar
                        </Link>

                        <Link
                            href="#"
                            className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
                        >
                            Mi perfil
                        </Link>

                        <Link
                            href="#"
                            className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
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

                <section className="flex-1 bg-white p-8 border-l border-gray-100 overflow-y-auto h-[calc(100vh-5rem)]">
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
                                            imagenes={
                                                item.imagenes.length > 0
                                                    ? Array(item.imagenes.length)
                                                    : []
                                            }
                                            onVerMas={() =>
                                                console.log(`Ver publicación ${item.id}`)
                                            }
                                        />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex justify-center gap-3 mt-10 pb-8">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                            (page) => (
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
                                            )
                                        )}
                                    </div>
                                )}
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

            {/* Modal Nueva Publicación */}
            {showNewPostModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-8 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h1 className="text-2xl font-black">Nueva publicación</h1>
                                <p className="text-sm text-gray-600">
                                    Comparte tu diseño, promoción o idea con la comunidad.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowNewPostModal(false)}
                                className="text-2xl text-gray-400 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto flex gap-8 p-6">
                            {/* Form */}
                            <div className="flex-1 max-w-2xl space-y-6">
                                <div>
                                    <label className="text-sm font-bold block mb-3">
                                        Tipo de publicación
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Diseño', 'Promoción', 'Solicitud'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setPostType(type)}
                                                className={`py-4 px-3 rounded-md border-2 font-bold text-sm transition-all flex flex-col items-center gap-2 ${
                                                    postType === type
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-gray-300 bg-white text-black hover:border-black'
                                                }`}
                                            >
                                                {type === 'Diseño' && (
                                                    <Pencil size={20} strokeWidth={1.5} />
                                                )}
                                                {type === 'Promoción' && (
                                                    <Megaphone size={20} strokeWidth={1.5} />
                                                )}
                                                {type === 'Solicitud' && (
                                                    <MessageCircle size={20} strokeWidth={1.5} />
                                                )}
                                                <span className="text-xs">{type}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold block mb-2">Título</label>
                                    <input
                                        type="text"
                                        placeholder="Escribe un título atractivo"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-black focus:outline-none font-medium text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-bold block mb-2">
                                        Descripción
                                    </label>
                                    <textarea
                                        placeholder="Cuéntales a todos sobre tu publicación..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={5}
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-black focus:outline-none font-medium text-sm resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold block mb-2">
                                            Categoría
                                        </label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-black focus:outline-none font-medium text-sm bg-white cursor-pointer"
                                        >
                                            <option value="">Selecciona una categoría</option>
                                            <option value="Tatuaje">Tatuaje</option>
                                            <option value="Diseño">Diseño</option>
                                            <option value="Estudio">Estudio</option>
                                            <option value="Artista">Artista</option>
                                            <option value="Promoción">Promoción</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold block mb-2">
                                            Ubicación
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ej. Bogotá, Colombia"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-black focus:outline-none font-medium text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold block mb-2">Imágenes</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-black transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload size={28} strokeWidth={1.5} />
                                            <p className="text-sm font-bold">
                                                Arrastra imágenes o selecciona archivos
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                JPG, PNG hasta 10MB
                                            </p>
                                        </div>
                                    </div>

                                    {images.length > 0 && (
                                        <div className="mt-3 grid grid-cols-3 gap-2">
                                            {images.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={image}
                                                        alt={`Preview ${index}`}
                                                        className="w-full h-16 object-cover rounded-md border border-gray-200"
                                                    />
                                                    <button
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handlePublish}
                                    disabled={isPublishing}
                                    className="w-full bg-black text-white py-3 font-black rounded-md hover:bg-[#333] transition-all text-sm disabled:opacity-50"
                                >
                                    {isPublishing ? 'Publicando...' : 'Publicar'}
                                </button>
                            </div>

                            {/* Preview */}
                            <div className="w-80">
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 sticky top-6">
                                    <h2 className="font-black text-sm mb-3">Vista previa</h2>
                                    <p className="text-xs text-gray-600 mb-3">
                                        Así se verá tu publicación en el feed.
                                    </p>

                                    <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-[#E5D9F2] flex items-center justify-center text-xs">
                                                    👤
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold">{username}</p>
                                                    <p className="text-[9px] text-gray-400">
                                                        {location || 'Tu ubicación'} · 2h
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-black text-sm">
                                                ⋮
                                            </button>
                                        </div>

                                        {title && (
                                            <>
                                                <h4 className="text-xs font-bold">{title}</h4>
                                                <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-2">
                                                    {description}
                                                </p>
                                            </>
                                        )}

                                        {images.length > 0 && (
                                            <div
                                                className={`grid gap-1 ${
                                                    images.length > 1
                                                        ? 'grid-cols-3'
                                                        : 'grid-cols-1'
                                                }`}
                                            >
                                                {images.map((img, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`bg-gray-200 rounded flex items-center justify-center overflow-hidden ${
                                                            images.length === 1
                                                                ? 'aspect-[2/1]'
                                                                : 'aspect-square'
                                                        }`}
                                                    >
                                                        <img
                                                            src={img}
                                                            alt={`Preview ${idx}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex gap-2 pt-2 border-t border-gray-200">
                                            <button className="flex-1 flex justify-center py-2">
                                                <Heart size={18} strokeWidth={1.5} />
                                            </button>

                                            <button className="flex-1 flex justify-center py-2">
                                                <MessageCircle size={18} strokeWidth={1.5} />
                                            </button>

                                            <button className="flex-1 flex justify-center py-2">
                                                <Bookmark size={18} strokeWidth={1.5} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
