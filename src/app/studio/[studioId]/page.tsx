'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, MessageCircle, MapPin, X, Camera, Globe, Star } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { MOCK_STUDIOS, getMockPostsForStudio } from '@/lib/mock-profiles';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Post {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    likesCount: number;
    commentsCount: number;
    createdAt: string;
}

export default function StudioProfilePage() {
    const params = useParams();
    const router = useRouter();
    const studioId = params?.studioId as string;
    const [studio, setStudio] = useState<any>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const getCount = (v: any): number => typeof v === 'number' ? v : (Array.isArray(v) ? v.length : 0);

    useEffect(() => {
        if (!studioId) return;
        const token = localStorage.getItem('token');
        const load = async () => {
            try {
                const headers: Record<string, string> = {};
                if (token) headers.Authorization = `Bearer ${token}`;

                const [studioRes, postsRes] = await Promise.all([
                    fetch(`${API_URL}/studios/${studioId}`, { headers }).then((r) => r.json()),
                    fetch(`${API_URL}/posts/studio/${studioId}`, { headers }).then((r) => r.json()),
                ]);

                const s = studioRes.user || studioRes.data || studioRes;
                setStudio(s);

                const postsArray = Array.isArray(postsRes) ? postsRes
                    : postsRes.data && Array.isArray(postsRes.data) ? postsRes.data
                    : postsRes.posts && Array.isArray(postsRes.posts) ? postsRes.posts
                    : [];
                const mapped: Post[] = postsArray.map((post: any) => ({
                    id: post.id,
                    title: post.title || 'Trabajo',
                    content: post.content || '',
                    imageUrl: post.imageUrl,
                    likesCount: getCount(post._count?.likes ?? post.likes ?? post.likesCount ?? 0),
                    commentsCount: getCount(post._count?.comments ?? post.comments ?? post.commentsCount ?? 0),
                    createdAt: post.createdAt || new Date().toISOString(),
                }));
                setPosts(mapped);
            } catch {
                const mock = MOCK_STUDIOS[studioId];
                if (mock) {
                    setStudio(mock);
                    setPosts(getMockPostsForStudio(studioId));
                }
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [studioId]);

    if (loading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
            </main>
        );
    }

    if (!studio) {
        return (
            <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <p className="text-lg font-bold text-gray-500">Estudio no encontrado</p>
                <Link href="/feed" className="text-sm font-bold text-black underline">Volver al inicio</Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white text-black">
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-gray-600 hover:text-black transition-colors">
                        <ArrowLeft size={22} />
                    </button>
                    <div>
                        <p className="text-sm font-bold leading-tight">{studio.name || 'Estudio'}</p>
                        <p className="text-[11px] text-gray-500">{posts.length} trabajos publicados</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
                    <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-gray-100">
                        {studio.logoUrl ? (
                            <img src={studio.logoUrl} alt={studio.name} className="w-full h-full object-cover" />
                        ) : (
                            <Camera size={32} className="text-gray-400" />
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-xl md:text-2xl font-black tracking-tight mb-1">{studio.name || 'Estudio'}</h1>

                        <div className="flex justify-center md:justify-start gap-8 mb-4">
                            <div className="text-center">
                                <p className="text-lg font-bold">{posts.length}</p>
                                <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">trabajos</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold">{studio.followersCount ?? studio._count?.followers ?? 0}</p>
                                <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">seguidores</p>
                            </div>
                        </div>

                        {studio.description && (
                            <p className="text-sm text-gray-600 leading-relaxed max-w-md whitespace-pre-line">{studio.description}</p>
                        )}
                        {studio.location && (
                            <p className="text-xs text-gray-400 font-medium flex items-center gap-1 justify-center md:justify-start mt-2">
                                <MapPin size={13} /> {studio.location}
                            </p>
                        )}
                        {studio.rating && (
                            <p className="text-xs text-gray-500 font-bold flex items-center gap-1 justify-center md:justify-start mt-1">
                                <Star size={13} className="text-yellow-500 fill-yellow-500" /> {studio.rating.toFixed(1)}
                            </p>
                        )}
                        {studio.website && (
                            <a
                                href={studio.website.startsWith('http') ? studio.website : `https://${studio.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1.5 transition-colors mt-2 justify-center md:justify-start"
                            >
                                <Globe size={13} /> Sitio web
                            </a>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    {posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <Camera size={40} strokeWidth={1} className="mb-4" />
                            <p className="text-sm font-bold">No hay trabajos publicados</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-4">
                            {posts.map((post) => (
                                <button
                                    key={post.id}
                                    onClick={() => setSelectedPost(post)}
                                    className="group relative aspect-square bg-gray-100 overflow-hidden border border-gray-200 hover:border-black transition-colors text-left"
                                >
                                    {post.imageUrl ? (
                                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold p-4 text-center">{post.title}</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-6 text-white font-bold text-sm">
                                            <span className="flex items-center gap-1.5"><Heart size={16} fill="white" /> {post.likesCount}</span>
                                            <span className="flex items-center gap-1.5"><MessageCircle size={16} fill="white" /> {post.commentsCount}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedPost && (
                <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedPost(null)}>
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedPost(null)}
                            className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/10 rounded-full flex items-center justify-center hover:bg-black/20 transition-colors"
                        ><X size={18} /></button>

                        {selectedPost.imageUrl && (
                            <div className="aspect-[2/1] bg-gray-100 overflow-hidden rounded-t-xl">
                                <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="p-6">
                            <h3 className="text-lg font-bold mb-2">{selectedPost.title}</h3>
                            {selectedPost.content && <p className="text-sm text-gray-600 leading-relaxed mb-4">{selectedPost.content}</p>}
                            <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                                <span className="flex items-center gap-2 text-sm font-bold text-gray-600"><Heart size={18} /> {selectedPost.likesCount} likes</span>
                                <span className="flex items-center gap-2 text-sm font-bold text-gray-600"><MessageCircle size={18} /> {selectedPost.commentsCount} comentarios</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-3">{formatDate(selectedPost.createdAt)}</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}