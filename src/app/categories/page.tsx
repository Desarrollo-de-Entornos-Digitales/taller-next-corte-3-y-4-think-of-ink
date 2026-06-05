'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { CategoryFilter } from './components/CategoryFilter';
import { CategorySection } from './components/CategorySection';
import { TattooCard } from './components/TattooCard';
import { ArtistCard } from './components/ArtistCard';
import { StudioCard } from './components/StudioCard';

const CATEGORIES = [
    'Todas', 'Blackwork', 'Realismo', 'Fine Line', 'Tradicional',
    'Neo Tradicional', 'Minimalista', 'Geométrico', 'Anime',
    'Lettering', 'Color', 'Tribal', 'Piercing', 'Estudios',
];

const RECENT_POSTS = [
    { id: '1', image: '/images/tattoos/tattoo-1.jpg', author: 'Ana López', avatar: 'A', title: 'Dragon tradicional a color en proceso', likes: 24, comments: 8 },
    { id: '2', image: '/images/tattoos/tattoo-2.jpg', author: 'Carlos Ruiz', avatar: 'C', title: 'Fine line mandala finalizado', likes: 18, comments: 5 },
    { id: '3', image: '/images/tattoos/tattoo-3.jpg', author: 'María Paz', avatar: 'M', title: 'Blackwork geométrico brazo completo', likes: 32, comments: 12 },
    { id: '4', image: '/images/tattoos/tattoo-4.jpg', author: 'Juan Mora', avatar: 'J', title: 'Realismo retrato escala de grises', likes: 45, comments: 15 },
];

const VIRAL_POSTS = [
    { id: '5', image: '/images/tattoos/tattoo-5.jpg', author: 'Ink Master', avatar: 'I', title: 'Neo tradicional rosa y dagas', likes: 234, comments: 56 },
    { id: '6', image: '/images/tattoos/tattoo-6.jpg', author: 'Sofía Toro', avatar: 'S', title: 'Lettering frase completa en espalda', likes: 189, comments: 42 },
    { id: '7', image: '/images/tattoos/tattoo-7.jpg', author: 'Luis Rojas', avatar: 'L', title: 'Color realismo ave exótica', likes: 312, comments: 78 },
];

const TOP_LIKED = [
    { id: '8', image: '/images/tattoos/tattoo-8.jpg', author: 'Black Ink', avatar: 'B', title: 'Anime sleeve completo', likes: 567, comments: 102 },
    { id: '9', image: '/images/tattoos/tattoo-9.jpg', author: 'Pablo Gil', avatar: 'P', title: 'Tribal brazo geométrico', likes: 423, comments: 89 },
    { id: '10', image: '/images/tattoos/tattoo-10.jpg', author: 'Diana Cruz', avatar: 'D', title: 'Fine line rostro femenino', likes: 398, comments: 67 },
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

export default function CategoriesPage() {
    const [activeCategory, setActiveCategory] = useState('Todas');
    const [search, setSearch] = useState('');

    return (
        <main className="min-h-screen bg-white text-black">
            <Navbar />
            <div className="flex pt-20">
                <Sidebar />
                <section className="flex-1 bg-white overflow-y-auto h-[calc(100vh-5rem)]">
                    <div className="max-w-6xl mx-auto px-6 py-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-black tracking-tight text-black mb-2">
                                Categorías
                            </h1>
                            <p className="text-sm text-[#474747] font-medium">
                                Explora tatuajes, artistas y estudios según tus intereses.
                            </p>
                        </div>

                        {/* Search */}
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

                        {/* Category Filters */}
                        <div className="mb-10">
                            <CategoryFilter
                                categories={CATEGORIES}
                                active={activeCategory}
                                onSelect={setActiveCategory}
                            />
                        </div>

                        {/* Recientes */}
                        <div className="mb-12">
                            <CategorySection title="Recientes" seeAllHref="#">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {RECENT_POSTS.map((post) => (
                                        <TattooCard
                                            key={post.id}
                                            image={post.image}
                                            author={post.author}
                                            authorAvatar={post.avatar}
                                            title={post.title}
                                            likes={post.likes}
                                            comments={post.comments}
                                        />
                                    ))}
                                </div>
                            </CategorySection>
                        </div>

                        {/* Más virales */}
                        <div className="mb-12">
                            <CategorySection title="Más virales" seeAllHref="#">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {VIRAL_POSTS.map((post) => (
                                        <TattooCard
                                            key={post.id}
                                            image={post.image}
                                            author={post.author}
                                            authorAvatar={post.avatar}
                                            title={post.title}
                                            likes={post.likes}
                                            comments={post.comments}
                                        />
                                    ))}
                                </div>
                            </CategorySection>
                        </div>

                        {/* Más likes */}
                        <div className="mb-12">
                            <CategorySection title="Más likes" seeAllHref="#">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {TOP_LIKED.map((post) => (
                                        <TattooCard
                                            key={post.id}
                                            image={post.image}
                                            author={post.author}
                                            authorAvatar={post.avatar}
                                            title={post.title}
                                            likes={post.likes}
                                            comments={post.comments}
                                        />
                                    ))}
                                </div>
                            </CategorySection>
                        </div>

                        {/* Tatuadores cerca de ti */}
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

                        {/* Estudios destacados */}
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
