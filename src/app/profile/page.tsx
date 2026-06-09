'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/app/components/Navbar';
import { Sidebar } from '@/app/components/Sidebar';
import { Heart, MessageCircle, MapPin, X, Globe, Camera } from 'lucide-react';
import { getMyPosts, normalizePostsResponse } from '@/lib/api/posts';
import { getUserProfile } from '@/lib/api/users';
import { formatDate, resolveImageUrl } from '@/lib/utils';

interface GalleryPost {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    likes: number;
    comments: number;
    user: { id: string; username: string };
    category?: { name: string };
    location?: string;
    createdAt: string;
}

const linkIcon = (url: string, label: string) => {
    if (!url) return null;
    const h = url.toLowerCase();
    if (h.includes('instagram')) return <Camera size={16} />;
    if (h.includes('behance')) return <Globe size={16} />;
    if (h.includes('linkedin')) return <Globe size={16} />;
    return <Globe size={16} />;
};

export default function ProfilePage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [profession, setProfession] = useState('');
    const [avatar, setAvatar] = useState('');
    const [website, setWebsite] = useState('');
    const [instagram, setInstagram] = useState('');
    const [behance, setBehance] = useState('');
    const [portfolio, setPortfolio] = useState('');
    const [posts, setPosts] = useState<GalleryPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);

    const socialLinks = [
        { url: instagram, label: 'Instagram' },
        { url: behance, label: 'Behance' },
        { url: portfolio, label: 'Portafolio' },
        { url: website, label: 'Sitio web' },
    ].filter((s) => s.url);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/login'); return; }

        const load = async () => {
            try {
                const data = await getUserProfile(token);
                const p = data.user || data.data || data;
                const u = p.username || localStorage.getItem('username') || 'Usuario';
                setUsername(u);
                setFullName(p.name || u);
                setBio(p.bio || '');
                setLocation(p.location || '');
                setProfession(p.profession || '');
                const apiAvatar = resolveImageUrl(p.avatar || p.avatarUrl || '');
                const storedUser = localStorage.getItem('user');
                let storedAvatar = '';
                if (storedUser) {
                    try { const parsed = JSON.parse(storedUser); if (parsed.avatar) storedAvatar = parsed.avatar; } catch {}
                }
                setAvatar(apiAvatar || storedAvatar);
                setWebsite(p.website || '');
                setInstagram(p.instagram || '');
                setBehance(p.behance || '');
                setPortfolio(p.portfolio || '');
            } catch {
                const u = localStorage.getItem('username') || 'Usuario';
                setUsername(u); setFullName(u);
                const stored = localStorage.getItem('user');
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        if (parsed.avatar) setAvatar(parsed.avatar);
                    } catch {}
                }
            }

            try {
                const response = await getMyPosts(token);
                const postsArray = normalizePostsResponse(response);
                const getCount = (v: any): number =>
                    typeof v === 'number' ? v : (Array.isArray(v) ? v.length : 0);
                const mapped: GalleryPost[] = postsArray.map((p: any) => ({
                    id: p.id, title: p.title || 'Nueva publicación',
                    content: p.content || '', imageUrl: resolveImageUrl(p.imageUrl),
                    likes: getCount(p._count?.likes ?? p.likes ?? p.likesCount ?? 0),
                    comments: getCount(p._count?.comments ?? p.comments ?? p.commentsCount ?? 0),
                    user: { id: p.user?.id || '', username: p.user?.username || username },
                    category: p.category, location: p.location,
                    createdAt: p.createdAt || new Date().toISOString(),
                }));
                setPosts(mapped);
            } catch { setPosts([]); }
            finally { setLoading(false); }
        };
        load();
    }, [router]);

    const visiblePosts = posts.slice(0, 10);

    return (
        <main className="min-h-screen bg-white text-black">
            <Navbar />
            <div className="flex pt-20">
                <Sidebar />
                <section className="flex-1 bg-white overflow-y-auto h-[calc(100vh-5rem)]">
                    <div className="max-w-5xl mx-auto px-6 py-14">
                        <div className="flex flex-col items-center mb-12">
                            <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-2xl">
                                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-[#E5D9F2] flex items-center justify-center text-5xl font-bold text-[#6000FF] flex-shrink-0 overflow-hidden">
                                    {avatar ? (
                                        <img src={avatar} alt={username} className="w-full h-full object-cover" />
                                    ) : (
                                        username.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-0.5">{fullName}</h1>
                                    <p className="text-base text-gray-500 font-medium mb-2">@{username}</p>
                                    {profession && <p className="text-sm font-bold text-gray-600 mb-1">{profession}</p>}
                                    {bio && <p className="text-sm text-gray-600 leading-relaxed mb-1">{bio}</p>}
                                    {location && (
                                        <p className="text-xs text-gray-400 font-medium flex items-center gap-1 justify-center md:justify-start">
                                            <MapPin size={14} /> {location}
                                        </p>
                                    )}

                                    {socialLinks.length > 0 && (
                                        <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start">
                                            {socialLinks.map((s) => (
                                                <a
                                                    key={s.label}
                                                    href={s.url!.startsWith('http') ? s.url! : `https://${s.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 transition-colors"
                                                >
                                                    {linkIcon(s.url!, s.label)}
                                                    {s.label}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-center gap-12 mt-8">
                                <div className="text-center">
                                    <p className="text-xl font-black">{posts.length}</p>
                                    <p className="text-xs text-gray-500 font-medium">publicaciones</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-black">0</p>
                                    <p className="text-xs text-gray-500 font-medium">seguidores</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-black">0</p>
                                    <p className="text-xs text-gray-500 font-medium">seguidos</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-8">
                            {loading ? (
                                <div className="flex justify-center py-16">
                                    <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                                </div>
                            ) : visiblePosts.length === 0 ? (
                                <div className="border border-dashed border-gray-300 rounded-lg p-12 text-center">
                                    <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">No hay publicaciones todavía</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {visiblePosts.map((post) => (
                                        <button key={post.id} onClick={() => setSelectedPost(post)}
                                            className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-black transition-colors text-left"
                                        >
                                            {post.imageUrl ? (
                                                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold p-4 text-center">{post.title}</div>
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-6 text-white font-bold">
                                                    <span className="flex items-center gap-1.5"><Heart size={18} fill="white" /> {post.likes}</span>
                                                    <span className="flex items-center gap-1.5"><MessageCircle size={18} fill="white" /> {post.comments}</span>
                                                </div>
                                            </div>
                                            {!post.imageUrl && (
                                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                                                    <p className="text-xs font-bold text-white truncate">{post.title}</p>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {selectedPost && (
                        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
                            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                                <button onClick={() => setSelectedPost(null)}
                                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/10 rounded-full flex items-center justify-center hover:bg-black/20 transition-colors"
                                ><X size={18} /></button>

                                {selectedPost.imageUrl && (
                                    <div className="aspect-[2/1] bg-gray-100 overflow-hidden rounded-t-xl">
                                        <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-[#E5D9F2] flex items-center justify-center text-sm font-bold text-[#6000FF]">
                                            {selectedPost.user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{selectedPost.user.username}</p>
                                            <p className="text-xs text-gray-400">{formatDate(selectedPost.createdAt)}</p>
                                        </div>
                                    </div>
                                    {selectedPost.category?.name && (
                                        <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-gray-100 px-2 py-1 rounded mb-3">{selectedPost.category.name}</span>
                                    )}
                                    <h3 className="text-lg font-bold mb-2">{selectedPost.title}</h3>
                                    {selectedPost.content && <p className="text-sm text-gray-600 leading-relaxed mb-4">{selectedPost.content}</p>}
                                    <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                                        <span className="flex items-center gap-2 text-sm font-bold text-gray-600"><Heart size={18} /> {selectedPost.likes} likes</span>
                                        <span className="flex items-center gap-2 text-sm font-bold text-gray-600"><MessageCircle size={18} /> {selectedPost.comments} comentarios</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
