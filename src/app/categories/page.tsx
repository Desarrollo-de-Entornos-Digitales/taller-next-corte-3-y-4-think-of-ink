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
import { getAllPosts, normalizePostsResponse } from '@/lib/api/posts';

const CATEGORIES = [
    'Todas', 'Blackwork', 'Realismo', 'Fine Line', 'Tradicional',
    'Neo Tradicional', 'Minimalista', 'Geométrico', 'Anime',
    'Lettering', 'Color', 'Tribal', 'Piercing', 'Estudios',
];

const ARTISTS = [
    { name: 'Black Ink Studio', city: 'Bogotá, Colombia', specialty: 'Blackwork y Realismo', rating: 4.9, avatar: 'B' },
    { name: 'Real Ink Tattoo', city: 'Medellín, Colombia', specialty: 'Realismo y Color', rating: 4.8, avatar: 'R' },
    { name: 'Fine Line Studio', city: 'Cali, Colombia', specialty: 'Fine Line y Minimalista', rating: 4.7, avatar: 'F' },
    { name: 'Neo Ink Art', city: 'Barranquilla, Colombia', specialty: 'Neo Tradicional', rating: 4.9, avatar: 'N' },
];

const STUDIOS = [
    { name: 'Estudio 79 Tattoo', city: 'Bogotá', rating: 4.9 },
    { name: 'La Vida Tattoo', city: 'Medellín', rating: 4.8 },
    { name: 'Tinta Finita', city: 'Cali', rating: 4.7 },
    { name: 'Seven Ink Studio', city: 'Cartagena', rating: 4.9 },
];

const VIRAL_POSTS = [
    { id: '5', image: '/images/tattoos/tattoo-5.jpg', author: 'Ink Master', authorAvatar: 'I', title: 'Neo tradicional rosa y dagas', likes: 234, comments: 56 },
    { id: '6', image: '/images/tattoos/tattoo-6.jpg', author: 'Sofía Toro', authorAvatar: 'S', title: 'Lettering frase completa en espalda', likes: 189, comments: 42 },
    { id: '7', image: '/images/tattoos/tattoo-7.jpg', author: 'Luis Rojas', authorAvatar: 'L', title: 'Color realismo ave exótica', likes: 312, comments: 78 },
];

const TOP_LIKED = [
    { id: '8', image: '/images/tattoos/tattoo-8.jpg', author: 'Black Ink', authorAvatar: 'B', title: 'Anime sleeve completo', likes: 567, comments: 102 },
    { id: '9', image: '/images/tattoos/tattoo-9.jpg', author: 'Pablo Gil', authorAvatar: 'P', title: 'Tribal brazo geométrico', likes: 423, comments: 89 },
    { id: '10', image: '/images/tattoos/tattoo-10.jpg', author: 'Diana Cruz', authorAvatar: 'D', title: 'Fine line rostro femenino', likes: 398, comments: 67 },
];

export default function CategoriesPage() {
    const [activeCategory, setActiveCategory] = useState('Todas');
    const [search, setSearch] = useState('');
    const [allPosts, setAllPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) return;
                const response = await getAllPosts(token);
                const postsArray = normalizePostsResponse(response);
                setAllPosts(postsArray);
            } catch (err) {
                console.error('Error fetching posts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const filteredPosts = allPosts.filter((post) => {
        if (activeCategory === 'Todas') return true;
        const categoryName = post.category?.name || '';
        return categoryName.toLowerCase() === activeCategory.toLowerCase();
    });

    const recentPosts = [...filteredPosts]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4);

    const getLikeCount = (p: any): number => {
        const v = p._count?.likes ?? p.likes ?? p.likesCount ?? 0;
        return typeof v === 'number' ? v : (Array.isArray(v) ? v.length : 0);
    };
    const getCommentCount = (p: any): number => {
        const v = p._count?.comments ?? p.comments ?? p.commentsCount ?? 0;
        return typeof v === 'number' ? v : (Array.isArray(v) ? v.length : 0);
    };

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
                                categories={CATEGORIES}
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
                                                        image={post.imageUrl}
                                                        author={post.user?.username || 'Usuario'}
                                                        authorAvatar={getInitial(post.user?.username)}
                                                        title={post.title || 'Nueva publicación'}
                                                        likes={getLikeCount(post)}
                                                        comments={getCommentCount(post)}
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
                                                    image={post.image}
                                                    author={post.author}
                                                    authorAvatar={post.authorAvatar}
                                                    title={post.title}
                                                    likes={post.likes}
                                                    comments={post.comments}
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
                                                    image={post.image}
                                                    author={post.author}
                                                    authorAvatar={post.authorAvatar}
                                                    title={post.title}
                                                    likes={post.likes}
                                                    comments={post.comments}
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
