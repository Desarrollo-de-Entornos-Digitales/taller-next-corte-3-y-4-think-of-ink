'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, MessageCircle, MapPin, X, Globe, Camera, Briefcase, ExternalLink } from 'lucide-react';
import { getPublicProfile, getPostsByUser } from '@/lib/api/users';
import { formatDate, resolveImageUrl } from '@/lib/utils';
import { MOCK_USERS, getMockPostsForUser } from '@/lib/mock-profiles';

interface Post {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    likesCount: number;
    commentsCount: number;
    createdAt: string;
}

const socialMeta = [
    { key: 'instagram', icon: Camera, label: 'Instagram', color: 'hover:text-pink-600' },
    { key: 'behance', icon: Briefcase, label: 'Behance', color: 'hover:text-blue-600' },
    { key: 'portfolio', icon: ExternalLink, label: 'Portafolio', color: 'hover:text-gray-600' },
    { key: 'linkedin', icon: Globe, label: 'LinkedIn', color: 'hover:text-blue-700' },
    { key: 'website', icon: Globe, label: 'Sitio web', color: 'hover:text-gray-600' },
];

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const userId = params?.userId as string;
    const [profile, setProfile] = useState<any>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const getCount = (v: any): number => typeof v === 'number' ? v : (Array.isArray(v) ? v.length : 0);

    useEffect(() => {
        if (!userId || userId === 'undefined') {
            router.push('/feed');
            return;
        }
        const token = localStorage.getItem('token') || undefined;
        const load = async () => {
            try {
                const [profileRes, postsRes] = await Promise.all([
                    getPublicProfile(userId, token),
                    getPostsByUser(userId, token),
                ]);
                const p = profileRes.user || profileRes.data || profileRes;
                setProfile(p);
                const postsArray = Array.isArray(postsRes) ? postsRes
                    : postsRes.data && Array.isArray(postsRes.data) ? postsRes.data
                    : postsRes.posts && Array.isArray(postsRes.posts) ? postsRes.posts
                    : [];
                const mapped: Post[] = postsArray.map((post: any) => ({
                    id: post.id,
                    title: post.title || 'Nueva publicación',
                    content: post.content || '',
                    imageUrl: resolveImageUrl(post.imageUrl),
                    likesCount: getCount(post._count?.likes ?? post.likes ?? post.likesCount ?? 0),
                    commentsCount: getCount(post._count?.comments ?? post.comments ?? post.commentsCount ?? 0),
                    createdAt: post.createdAt || new Date().toISOString(),
                }));
                setPosts(mapped);
            } catch {
                const mock = MOCK_USERS[userId];
                if (mock) {
                    setProfile(mock);
                    const mockPosts = getMockPostsForUser(userId);
                    setPosts(mockPosts);
                }
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [userId]);

    if (loading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
            </main>
        );
    }

    if (!profile) {
        return (
            <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <p className="text-lg font-bold text-gray-500">Usuario no encontrado</p>
                <Link href="/feed" className="text-sm font-bold text-black underline">Volver al inicio</Link>
            </main>
        );
    }

    const socialLinks = socialMeta
        .map((s) => ({ ...s, url: profile[s.key] }))
        .filter((s) => s.url);

    return (
        <main className="min-h-screen bg-white text-black">
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-gray-600 hover:text-black transition-colors">
                        <ArrowLeft size={22} />
                    </button>
                    <div>
                        <p className="text-sm font-bold leading-tight">{profile.username || 'Perfil'}</p>
                        <p className="text-[11px] text-gray-500">{posts.length} publicaciones</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
                    <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-[#E5D9F2] flex items-center justify-center text-4xl md:text-6xl font-bold text-[#6000FF] flex-shrink-0 overflow-hidden ring-2 ring-gray-100">
                        {profile.avatar ? (
                            <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
                        ) : (
                            (profile.username || '?').charAt(0).toUpperCase()
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                            <h1 className="text-xl md:text-2xl font-black tracking-tight">{profile.username || 'Usuario'}</h1>
                        </div>

                        <div className="flex justify-center md:justify-start gap-8 mb-4">
                            <div className="text-center">
                                <p className="text-lg font-bold">{posts.length}</p>
                                <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">publicaciones</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold">{profile.followersCount ?? profile._count?.followers ?? 0}</p>
                                <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">seguidores</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold">{profile.followingCount ?? profile._count?.following ?? 0}</p>
                                <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">seguidos</p>
                            </div>
                        </div>

                        {profile.name && (
                            <p className="text-sm font-bold">{profile.name}</p>
                        )}
                        {profile.profession && (
                            <p className="text-sm text-gray-600 font-medium">{profile.profession}</p>
                        )}
                        {profile.bio && (
                            <p className="text-sm text-gray-600 leading-relaxed mt-1 max-w-md whitespace-pre-line">{profile.bio}</p>
                        )}
                        {profile.location && (
                            <p className="text-xs text-gray-400 font-medium flex items-center gap-1 justify-center md:justify-start mt-1">
                                <MapPin size={13} /> {profile.location}
                            </p>
                        )}

                        {socialLinks.length > 0 && (
                            <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                                {socialLinks.map((s) => (
                                    <a
                                        key={s.key}
                                        href={s.url!.startsWith('http') ? s.url! : `https://${s.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-xs font-bold text-gray-500 ${s.color} flex items-center gap-1.5 transition-colors`}
                                    >
                                        <s.icon size={14} /> {s.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    {posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <Camera size={40} strokeWidth={1} className="mb-4" />
                            <p className="text-sm font-bold">No hay publicaciones</p>
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