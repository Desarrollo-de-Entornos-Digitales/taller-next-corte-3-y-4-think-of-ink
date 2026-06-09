'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { CategoryFilter } from './components/CategoryFilter';
import { CategorySection } from './components/CategorySection';
import { TattooCard } from './components/TattooCard';
import { ArtistCard } from './components/ArtistCard';
import { StudioCard } from './components/StudioCard';
import { getAllPosts, normalizePostsResponse, likePost } from '@/lib/api/posts';
import { resolveImageUrl } from '@/lib/utils';
import { CATEGORIES, normalizeCategory } from '@/lib/categories';
import { MOCK_FEED_POSTS } from '@/lib/mock-profiles';

const ARTISTS = [
    { name: 'Black Ink Studio', city: 'Bogotá, Colombia', specialty: 'Blackwork y Realismo', rating: 4.9, avatar: 'B', logoUrl: '/images/logos/blackwork-studio.png', studioId: 'black-ink-studio' },
    { name: 'Real Ink Tattoo', city: 'Medellín, Colombia', specialty: 'Realismo y Color', rating: 4.8, avatar: 'R', logoUrl: '/images/logos/real-ink-tattoo.png', studioId: 'real-ink-tattoo' },
    { name: 'Fine Line Studio', city: 'Cali, Colombia', specialty: 'Fine Line y Minimalista', rating: 4.7, avatar: 'F', logoUrl: '/images/logos/fine-line-studio.png', studioId: 'fine-line-studio' },
    { name: 'Neo Ink Art', city: 'Barranquilla, Colombia', specialty: 'Neo Tradicional', rating: 4.9, avatar: 'N', logoUrl: '/images/logos/neo-art-studio.png', studioId: 'neo-art-studio' },
];

const LOGO_MAP: Record<string, string> = {
    'Ink Starter Studio': '/images/logos/ink-starter-studio.png',
    'Mini Tattoo Cali': '/images/logos/mini-tattoo-cali.png',
    'Fine Line Studio': '/images/logos/fine-line-studio.png',
    'Neo Art Tattoo': '/images/logos/neo-art-studio.png',
    'Black House Tattoo': '/images/logos/blackwork-studio.png',
    'Real Ink Tattoo': '/images/logos/real-ink-tattoo.png',
    'Premium Blackwork': '/images/logos/premium-blackwork.png',
    'Artistic Cali': '/images/logos/artistic-cali.png',
    'Elite Tattoo Studio': '/images/logos/elite-tattoo-studio.png',
    'Master Ink Collective': '/images/logos/master-ink-collective.png',
    'Black Ink Studio': '/images/logos/blackwork-studio.png',
    'Neo Ink Art': '/images/logos/neo-art-studio.png',
    'Golden Needle': '/images/logos/golden-needle.png',
    'Urban Ink': '/images/logos/urban-ink.png',
};

const FALLBACK_LOGO = '/images/logos/ink-starter-studio.png';

const STUDIOS = [
    { name: 'Ink Starter Studio', city: 'Cali, Colombia', rating: 4.9, studioId: 'ink-starter-studio' },
    { name: 'Mini Tattoo Cali', city: 'San Fernando, Cali', rating: 4.8, studioId: 'mini-tattoo-cali' },
    { name: 'Fine Line Studio', city: 'Granada, Cali', rating: 4.7, studioId: 'fine-line-studio' },
    { name: 'Black House Tattoo', city: 'Granada, Cali', rating: 4.9, studioId: 'black-house-tattoo' },
];

const VIRAL_POSTS = [
    { id: 'mock-feed-1', image: '/images/tattoos/tattoo-5.jpg', author: 'Ink Master', authorAvatar: 'I', title: 'Neo tradicional rosa y dagas', likes: 234, comments: 56, studioId: 'ink-master' },
    { id: 'mock-feed-2', image: '/images/tattoos/tattoo-6.jpg', author: 'Camila Sánchez', authorAvatar: 'C', title: 'Lettering frase completa en espalda', likes: 189, comments: 42, userId: 'camilasanchez' },
    { id: 'mock-feed-3', image: '/images/tattoos/tattoo-7.jpg', author: 'Luis Rojas', authorAvatar: 'L', title: 'Color realismo ave exótica', likes: 312, comments: 78, userId: 'luis-rojas' },
];

const TOP_LIKED = [
    { id: 'mock-feed-4', image: '/images/tattoos/tattoo-8.jpg', author: 'Black Ink', authorAvatar: 'B', title: 'Anime sleeve completo', likes: 567, comments: 102, studioId: 'black-ink' },
    { id: 'mock-feed-5', image: '/images/tattoos/tattoo-9.jpg', author: 'Pablo Gil', authorAvatar: 'P', title: 'Tribal brazo geométrico', likes: 423, comments: 89, userId: 'pablo-gil' },
    { id: 'mock-feed-6', image: '/images/tattoos/tattoo-10.jpg', author: 'Diana Cruz', authorAvatar: 'D', title: 'Fine line rostro femenino', likes: 398, comments: 67, userId: 'diana-cruz' },
];

export default function CategoriesPage() {
    const [activeCategory, setActiveCategory] = useState('Todas');
    const [search, setSearch] = useState('');
    const [allPosts, setAllPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    setAllPosts(
                        MOCK_FEED_POSTS.map(p => ({
                            ...p,
                            imageUrl: resolveImageUrl(p.imageUrl || ''),
                            category: typeof p.category === 'string' ? { name: p.category } : p.category,
                        }))
                    );
                    setLoading(false);
                    return;
                }
                const response = await getAllPosts(token);
                const apiPosts = normalizePostsResponse(response).map(p => {
                    const rawCategory = p.category;
                    const normalizedCategory = normalizeCategory(rawCategory);
                    return {
                        ...p,
                        category: normalizedCategory,
                        imageUrl: resolveImageUrl(p.imageUrl),
                    };
                });
                const mockPosts = MOCK_FEED_POSTS.map(p => ({
                    ...p,
                    imageUrl: resolveImageUrl(p.imageUrl || ''),
                    category: typeof p.category === 'string' ? { name: p.category } : p.category,
                }));
                const seenIds = new Set(apiPosts.map(p => p.id));
                const merged = [...apiPosts, ...mockPosts.filter(p => !seenIds.has(p.id))];

                console.log(
                    `[Categories] API posts: ${apiPosts.length}, ` +
                    `Mock posts kept: ${merged.length - apiPosts.length}, ` +
                    `Total merged: ${merged.length}`
                );

                setAllPosts(merged);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setAllPosts(
                    MOCK_FEED_POSTS.map(p => ({
                        ...p,
                        imageUrl: resolveImageUrl(p.imageUrl || ''),
                        category: typeof p.category === 'string' ? { name: p.category } : p.category,
                    }))
                );
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleLike = async (postId: string) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        // Optimistic update
        const prevLiked = likedPosts.has(postId);
        const currentDisplay = likeCounts[postId] ?? (() => {
            const apiPost = allPosts.find((p) => p.id === postId);
            if (apiPost) return getLikeCount(apiPost);
            for (const p of [...VIRAL_POSTS, ...TOP_LIKED]) {
                if (p.id === postId) return p.likes;
            }
            return 0;
        })();
        setLikedPosts((prev) => {
            const next = new Set(prev);
            if (prevLiked) next.delete(postId);
            else next.add(postId);
            return next;
        });
        setLikeCounts((prev) => ({
            ...prev,
            [postId]: currentDisplay + (prevLiked ? -1 : 1),
        }));
        try {
            const result = await likePost(postId, token);
            const newLikesCount = result?.likesCount ?? result?.likes ?? result?._count?.likes ?? result?.count;
            const nowLiked = result?.likedByCurrentUser ?? result?.isLiked ?? result?.liked ?? !prevLiked;
            setLikedPosts((prev) => {
                const next = new Set(prev);
                if (nowLiked) next.add(postId);
                else next.delete(postId);
                return next;
            });
            if (newLikesCount !== undefined) {
                setLikeCounts((prev) => ({ ...prev, [postId]: newLikesCount }));
            }
            setAllPosts((prev) =>
                prev.map((p) => {
                    if (p.id !== postId) return p;
                    const currentCount = getLikeCount(p);
                    const updatedCount = newLikesCount !== undefined
                        ? newLikesCount
                        : nowLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
                    return { ...p, likesCount: updatedCount, _count: { ...p._count, likes: updatedCount } };
                })
            );
        } catch (err) {
            console.error('Error toggling like:', err);
            // Rollback on error
            setLikedPosts((prev) => {
                const next = new Set(prev);
                if (prevLiked) next.add(postId);
                else next.delete(postId);
                return next;
            });
            setLikeCounts((prev) => {
                const copy = { ...prev };
                delete copy[postId];
                return copy;
            });
        }
    };

    const getLikeCount = (p: any): number => {
        const v = p._count?.likes ?? p.likes ?? p.likesCount ?? 0;
        return typeof v === 'number' ? v : (Array.isArray(v) ? v.length : 0);
    };
    const getCommentCount = (p: any): number => {
        const v = p._count?.comments ?? p.comments ?? p.commentsCount ?? 0;
        return typeof v === 'number' ? v : (Array.isArray(v) ? v.length : 0);
    };
    const getLikeCountForDisplay = (postId: string): number => {
        if (likeCounts[postId] !== undefined) return likeCounts[postId];
        const apiPost = allPosts.find((p) => p.id === postId);
        if (apiPost) return getLikeCount(apiPost);
        for (const p of [...VIRAL_POSTS, ...TOP_LIKED]) {
            if (p.id === postId) return p.likes;
        }
        return 0;
    };

    const filteredPosts = allPosts.filter((post) => {
        if (activeCategory === 'Todas') return true;
        const categoryName = post.category?.name || '';
        return categoryName.toLowerCase() === activeCategory.toLowerCase();
    });

    const recentPosts = [...filteredPosts]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4);

    const getInitial = (name: string) => (name ? name.charAt(0).toUpperCase() : '?');

    return (
        <main className="min-h-screen bg-white text-black">
            <Navbar />
            <div className="flex pt-20">
                <Sidebar />
                <section className="flex-1 bg-white overflow-y-auto h-[calc(100vh-5rem)]">
                    <div className="max-w-6xl mx-auto px-6 py-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-black tracking-tight text-black mb-2">
                                Categorías
                            </h1>
                            <p className="text-sm text-[#474747] font-medium">
                                Explora tatuajes, artistas y estudios según tus intereses.
                            </p>
                        </div>

                        <div className="relative mb-6">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#474747]" />
                            <input
                                type="text"
                                placeholder="Buscar estilos, tatuadores o estudios..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border-2 border-[#D9D9D9] rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none text-sm font-medium transition-all bg-white"
                            />
                        </div>

                        <div className="mb-10">
                    <CategoryFilter
                        categories={['Todas', ...CATEGORIES]}
                        active={activeCategory}
                        onSelect={setActiveCategory}
                    />
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                            </div>
                        ) : (
                            <>
                                {recentPosts.length > 0 && (
                                    <div className="mb-12">
                                        <CategorySection title="Recientes" seeAllHref="#">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                                {recentPosts.map((post) => (
                                                    <TattooCard
                                                        key={post.id}
                                                        postId={post.id}
                                                        image={post.imageUrl}
                                                        author={post.user?.username || 'Usuario'}
                                                        authorAvatar={getInitial(post.user?.username)}
                                                        title={post.title || 'Nueva publicación'}
                                                        likes={getLikeCount(post)}
                                                        comments={getCommentCount(post)}
                                                        userId={post.user?.id}
                                                        liked={likedPosts.has(post.id)}
                                                        onLike={handleLike}
                                                    />
                                                ))}
                                            </div>
                                        </CategorySection>
                                    </div>
                                )}

                                <div className="mb-12">
                                    <CategorySection title="Más virales" seeAllHref="#">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                            {VIRAL_POSTS.map((post) => (
                                                <TattooCard
                                                    key={post.id}
                                                    postId={post.id}
                                                    image={post.image}
                                                    author={post.author}
                                                    authorAvatar={post.authorAvatar}
                                                    title={post.title}
                                                    likes={getLikeCountForDisplay(post.id)}
                                                    comments={post.comments}
                                                    userId={post.userId || undefined}
                                                    studioId={post.studioId || undefined}
                                                    liked={likedPosts.has(post.id)}
                                                    onLike={handleLike}
                                                />
                                            ))}
                                        </div>
                                    </CategorySection>
                                </div>

                                <div className="mb-12">
                                    <CategorySection title="Más likes" seeAllHref="#">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                            {TOP_LIKED.map((post) => (
                                                <TattooCard
                                                    key={post.id}
                                                    postId={post.id}
                                                    image={post.image}
                                                    author={post.author}
                                                    authorAvatar={post.authorAvatar}
                                                    title={post.title}
                                                    likes={getLikeCountForDisplay(post.id)}
                                                    comments={post.comments}
                                                    userId={post.userId || undefined}
                                                    studioId={post.studioId || undefined}
                                                    liked={likedPosts.has(post.id)}
                                                    onLike={handleLike}
                                                />
                                            ))}
                                        </div>
                                    </CategorySection>
                                </div>

                                {filteredPosts.length === 0 && !loading && (
                                    <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center mb-12">
                                        <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">
                                            No hay publicaciones en esta categoría
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="mb-12">
                            <CategorySection title="Tatuadores cerca de ti" seeAllHref="#">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {ARTISTS.map((artist) => (
                                        <ArtistCard
                                            key={artist.name}
                                            name={artist.name}
                                            city={artist.city}
                                            specialty={artist.specialty}
                                            rating={artist.rating}
                                            avatar={artist.avatar}
                                            logoUrl={artist.logoUrl}
                                            studioId={artist.studioId || undefined}
                                        />
                                    ))}
                                </div>
                            </CategorySection>
                        </div>

                        <div className="mb-12">
                            <CategorySection title="Estudios destacados" seeAllHref="#">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {STUDIOS.map((studio) => (
                                        <StudioCard
                                            key={studio.name}
                                            name={studio.name}
                                            city={studio.city}
                                            rating={studio.rating}
                                            image={LOGO_MAP[studio.name] || FALLBACK_LOGO}
                                            studioId={studio.studioId || undefined}
                                        />
                                    ))}
                                </div>
                            </CategorySection>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}