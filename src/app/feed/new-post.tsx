'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { CustomButton } from '../components/buttons';
import { Pencil, Megaphone, MessageCircle, Upload, Heart, Bookmark, X, AlertCircle } from 'lucide-react';
import { createPost } from '@/lib/api/posts';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function NewPost() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [postType, setPostType] = useState('Diseño');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadError, setUploadError] = useState<string>('');
    const [username, setUsername] = useState('Usuario Regular');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, [router]);

    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const validateFile = (file: File): string | null => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return 'Formato no válido. Solo se aceptan JPG, PNG y WebP.';
        }
        if (file.size > MAX_SIZE) {
            return 'El archivo es demasiado grande. Máximo 10MB.';
        }
        return null;
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        setUploadError('');
        if (files && files.length > 0) {
            const file = files[0];
            const error = validateFile(file);
            if (error) {
                setUploadError(error);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(null);
        setImagePreview('');
        setUploadError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handlePublish = async () => {
        if (!title.trim() || !description.trim() || !category) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        setIsLoading(true);
        setUploadError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Token no disponible');
                return;
            }

            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('title', title);
                formData.append('content', description);
                formData.append('category', JSON.stringify({ name: category }));
                if (location) formData.append('location', location);
                formData.append('postType', postType);
                await createPost(formData, token);
            } else {
                await createPost(
                    {
                        content: description,
                        category: { name: category },
                        location: location,
                        postType: postType,
                        title: title,
                    },
                    token
                );
            }

            removeImage();
            alert('Publicación creada con éxito!');
            router.push('/feed');
        } catch (error: any) {
            console.error('Error:', error);
            setUploadError(error?.message || 'Error al publicar. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white text-black font-sans">
            <Navbar />

            <div className="flex pt-20">
                <aside className="w-64 p-6 border-r border-gray-100 flex flex-col gap-4 h-[calc(100vh-5rem)] sticky top-20">
                    <CustomButton className="w-full bg-[#4A4A4A] border-none text-white py-3 rounded-md font-bold text-sm mb-4 hover:bg-black">
                        Nueva publicación
                    </CustomButton>

                    <div className="flex flex-col gap-1">
                        <Link
                            href="/feed"
                            className="bg-[#ECECEC] px-4 py-3 rounded-md text-sm font-bold hover:bg-gray-200"
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

                <section className="flex-1 flex gap-8 p-8 overflow-auto">
                    <div className="flex-1 max-w-2xl">
                        <div className="mb-8">
                            <h1 className="text-3xl font-black mb-2">Nueva publicación</h1>
                            <p className="text-gray-600 text-sm">
                                Comparte tu diseño, promoción o idea con la comunidad.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-bold block mb-3">
                                    Tipo de publicación
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Diseño', 'Promoción', 'Solicitud'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setPostType(type)}
                                            className={`py-6 px-4 rounded-md border-2 font-bold text-sm transition-all flex flex-col items-center gap-2 ${
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
                                            <span>{type}</span>
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
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-black focus:outline-none font-medium text-sm"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-bold block mb-2">Descripción</label>
                                <textarea
                                    placeholder="Cuéntales a todos sobre tu publicación..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={6}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-black focus:outline-none font-medium text-sm resize-none"
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
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-black focus:outline-none font-medium text-sm bg-white"
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
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-black focus:outline-none font-medium text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold block mb-2">Imagen</label>

                                {uploadError && (
                                    <div className="mb-3 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                                        <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                                        <p className="text-xs font-medium text-red-600">{uploadError}</p>
                                    </div>
                                )}

                                {imagePreview ? (
                                    <div className="relative group">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-md border border-gray-200"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-md flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-xs font-bold px-4 py-2 rounded-md hover:bg-gray-100"
                                            >
                                                Reemplazar
                                            </button>
                                            <button
                                                onClick={removeImage}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-md hover:bg-red-600"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-black transition-colors cursor-pointer relative">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.webp"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload size={28} strokeWidth={1.5} />
                                            <p className="text-sm font-bold">
                                                Arrastra una imagen o selecciona archivo
                                            </p>
                                            <p className="text-xs text-gray-500">JPG, PNG, WebP — Máximo 10MB</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <CustomButton
                                onClick={handlePublish}
                                isLoading={isLoading}
                                className="w-full bg-black text-white py-4 font-black rounded-md hover:bg-[#333] transition-all text-sm"
                            >
                                {isLoading ? 'Publicando...' : 'Publicar'}
                            </CustomButton>
                        </div>
                    </div>

                    <div className="w-96 sticky top-24">
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <h2 className="font-black text-lg mb-4">Vista previa</h2>
                            <p className="text-xs text-gray-600 mb-4">
                                Así se verá tu publicación en el feed.
                            </p>

                            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#E5D9F2] flex items-center justify-center text-xs">
                                        👤
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">{username}</p>
                                        <p className="text-[10px] text-gray-400">
                                            {location || 'Tu ubicación'}
                                        </p>
                                    </div>
                                </div>

                                {title && (
                                    <>
                                        <h4 className="text-sm font-bold">{title}</h4>
                                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                                            {description || 'Tu descripción aparecerá aquí'}
                                        </p>
                                    </>
                                )}

                                {imagePreview && (
                                    <div className="grid gap-2 grid-cols-1">
                                        <div className="bg-gray-200 rounded flex items-center justify-center overflow-hidden aspect-[2.5/1]">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2 border-t border-gray-200">
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
                </section>
            </div>
        </main>
    );
}
