'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { DollarSign, Star, MapPin, ChevronDown } from 'lucide-react';
import { filterByPrice } from '@/lib/api/posts';
import { resolveImageUrl } from '@/lib/utils';

const safeStr = (v: any): string | undefined => {
    if (v == null) return undefined;
    if (typeof v === 'string') return v;
    if (typeof v === 'object' && v.name) return v.name;
    return String(v);
};

interface PriceResult {
    id: string;
    name: string;
    logoUrl?: string;
    location?: string;
    category?: string | { id: string; name: string; description?: string };
    minPrice: number;
    maxPrice: number;
    rating: number;
    reviews: number;
    studioId?: string;
    userId?: string;
    studio?: any;
    tattooStyle?: any;
    priceRange?: any;
}

const PRESET_RANGES = [
    { label: 'Menos de $100.000', min: 0, max: 100000 },
    { label: '$100.000 - $300.000', min: 100000, max: 300000 },
    { label: '$300.000 - $600.000', min: 300000, max: 600000 },
    { label: '$600.000 - $1.000.000', min: 600000, max: 1000000 },
    { label: 'Más de $1.000.000', min: 1000000, max: 1500000 },
];

const SORT_OPTIONS = [
    { value: 'recommended', label: 'Recomendados' },
    { value: 'rating', label: 'Mejor calificados' },
    { value: 'minPrice', label: 'Menor precio' },
    { value: 'maxPrice', label: 'Mayor precio' },
];

const MIN = 0;
const MAX = 1500000;
const STEP = 50000;

const MOCK_RESULTS: PriceResult[] = [
    { id: 'm1', name: 'Ink Starter Studio', logoUrl: '/images/logos/ink-starter-studio.png', location: 'Cali, Colombia', category: 'Estudio', minPrice: 30000, maxPrice: 80000, rating: 4.5, reviews: 23 },
    { id: 'm2', name: 'Mini Tattoo Cali', logoUrl: '/images/logos/mini-tattoo-cali.png', location: 'San Fernando, Cali', category: 'Tatuador', minPrice: 50000, maxPrice: 95000, rating: 4.3, reviews: 15 },
    { id: 'm3', name: 'Fine Line Studio', logoUrl: '/images/logos/fine-line-studio.png', location: 'Granada, Cali', category: 'Estudio', minPrice: 120000, maxPrice: 280000, rating: 4.8, reviews: 42 },
    { id: 'm4', name: 'Neo Art Tattoo', logoUrl: '/images/logos/neo-art-studio.png', location: 'Centro, Cali', category: 'Tatuador', minPrice: 150000, maxPrice: 290000, rating: 4.6, reviews: 31 },
    { id: 'm5', name: 'Black House Tattoo', logoUrl: '/images/logos/black-house-tattoo.png', location: 'Granada, Cali', category: 'Estudio', minPrice: 350000, maxPrice: 550000, rating: 4.9, reviews: 78 },
    { id: 'm6', name: 'Real Ink Tattoo', logoUrl: '/images/logos/real-ink-tattoo.png', location: 'Centro, Cali', category: 'Estudio', minPrice: 300000, maxPrice: 580000, rating: 4.7, reviews: 56 },
    { id: 'm7', name: 'Premium Blackwork', logoUrl: '', location: 'San Antonio, Cali', category: 'Tatuador', minPrice: 650000, maxPrice: 950000, rating: 4.9, reviews: 102 },
    { id: 'm8', name: 'Artistic Cali', logoUrl: '', location: 'Menga, Cali', category: 'Estudio', minPrice: 700000, maxPrice: 990000, rating: 4.8, reviews: 89 },
    { id: 'm9', name: 'Elite Tattoo Studio', logoUrl: '', location: 'Bogotá, Colombia', category: 'Estudio', minPrice: 1100000, maxPrice: 1500000, rating: 5.0, reviews: 204 },
    { id: 'm10', name: 'Master Ink Collective', logoUrl: '', location: 'Medellín, Colombia', category: 'Tatuador', minPrice: 1200000, maxPrice: 1500000, rating: 4.9, reviews: 167 },
];

const getItemLink = (item: PriceResult): string => {
    if (item.studioId) return `/studio/${item.studioId}`;
    if (item.userId) return `/profile/${item.userId}`;
    if (item.category?.toLowerCase() === 'estudio') return `/studio/${item.id}`;
    return `/profile/${item.id}`;
};

const formatPrice = (v: any): string => {
    if (v == null || isNaN(Number(v))) return '$0';
    const num = Number(v);
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1).replace('.0', '')}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0).replace('.0', '')}K`;
    return `$${num.toLocaleString('es-CO')}`;
};

const DefaultStudioLogo = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full p-8" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="30" y="50" width="140" height="90" rx="6" />
        <rect x="55" y="70" width="90" height="50" rx="4" />
        <rect x="55" y="20" width="90" height="30" rx="6" />
        <line x1="100" y1="20" x2="100" y2="10" />
        <line x1="80" y1="10" x2="120" y2="10" />
        <rect x="80" y="80" width="40" height="40" rx="2" />
        <circle cx="100" cy="100" r="8" />
        <line x1="100" y1="95" x2="100" y2="100" />
        <line x1="97" y1="100" x2="103" y2="100" />
        <rect x="65" y="25" width="15" height="10" rx="2" />
        <rect x="120" y="25" width="15" height="10" rx="2" />
    </svg>
);

function filterMock(min: number, max: number): PriceResult[] {
    return MOCK_RESULTS.filter((r) => r.minPrice >= min && r.maxPrice <= max);
}

export default function PriceRangePage() {
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1500000);
    const [sort, setSort] = useState('recommended');
    const [results, setResults] = useState<PriceResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    const fetchResults = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const data = await filterByPrice(minPrice, maxPrice, token);
            const raw = Array.isArray(data) ? data : data.data || data.results || [];
            const arr = raw.map((r: any) => ({
                ...r,
                id: r.id || r._id || '',
                name: r.name || safeStr(r.studio?.name) || '',
                location: safeStr(r.location) || '',
                minPrice: Number(r.minPrice ?? r.min_price ?? 0),
                maxPrice: Number(r.maxPrice ?? r.max_price ?? 0),
                rating: Number(r.rating ?? 0),
                reviews: Number(r.reviews ?? 0),
                logoUrl: r.logoUrl || '',
                category: safeStr(r.category?.name ?? r.category),
                studioId: r.studioId || r.studio?._id || r.studio?.id,
                userId: r.userId || r.user?._id || r.user?.id,
                studio: undefined,
                tattooStyle: undefined,
                priceRange: undefined,
                user: undefined,
            }));
            if (arr.length > 0) {
                applySort(arr);
            } else {
                applySort(filterMock(minPrice, maxPrice));
            }
        } catch {
            applySort(filterMock(minPrice, maxPrice));
        } finally {
            setLoading(false);
        }
    }, [minPrice, maxPrice, sort]);

    function applySort(arr: PriceResult[]) {
        let sorted = [...arr];
        if (sort === 'rating') sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        else if (sort === 'minPrice') sorted.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
        else if (sort === 'maxPrice') sorted.sort((a, b) => (b.maxPrice || 0) - (a.maxPrice || 0));
        setResults(sorted);
    }

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    const handlePreset = (min: number, max: number) => {
        setMinPrice(min);
        setMaxPrice(max);
    };

    const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label || 'Recomendados';

    return (
        <main className="min-h-screen bg-white text-black">
            <Navbar />
            <div className="flex pt-20">
                <Sidebar />
                <section className="flex-1 bg-white overflow-y-auto h-[calc(100vh-5rem)]">
                    <div className="max-w-6xl mx-auto px-6 py-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-black tracking-tight text-black mb-2">
                                Rango de precio
                            </h1>
                            <p className="text-sm text-gray-500 font-medium">
                                Encuentra estudios y tatuadores según tu presupuesto.
                            </p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-black">Tu presupuesto</span>
                                <span className="text-lg font-black">
                                    {formatPrice(minPrice)} — {formatPrice(maxPrice)}
                                </span>
                            </div>

                            <div className="relative h-6 mb-2">
                                <input
                                    type="range"
                                    min={MIN}
                                    max={MAX}
                                    step={STEP}
                                    value={minPrice}
                                    onChange={(e) => {
                                        const v = Number(e.target.value);
                                        setMinPrice(Math.min(v, maxPrice - STEP));
                                    }}
                                    className="absolute w-full h-1.5 top-2.5 appearance-none bg-gray-200 rounded-full pointer-events-auto accent-black [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                                />
                                <input
                                    type="range"
                                    min={MIN}
                                    max={MAX}
                                    step={STEP}
                                    value={maxPrice}
                                    onChange={(e) => {
                                        const v = Number(e.target.value);
                                        setMaxPrice(Math.max(v, minPrice + STEP));
                                    }}
                                    className="absolute w-full h-1.5 top-2.5 appearance-none bg-transparent rounded-full pointer-events-auto accent-black [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                                />
                            </div>

                            <div className="flex justify-between text-[10px] text-gray-400 font-medium px-0.5">
                                <span>{formatPrice(MIN)}</span>
                                <span>{formatPrice(MAX)}+</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {PRESET_RANGES.map((preset) => {
                                const active = minPrice === preset.min && maxPrice === preset.max;
                                return (
                                    <button
                                        key={preset.label}
                                        onClick={() => handlePreset(preset.min, preset.max)}
                                        className={`px-4 py-2 text-xs font-bold rounded-md border-2 transition-colors ${
                                            active
                                                ? 'bg-black text-white border-black'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                                        }`}
                                    >
                                        {preset.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm font-bold text-gray-600">
                                {loading ? 'Buscando...' : `${results.length} resultados encontrados`}
                            </p>

                            <div className="relative">
                                <button
                                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-bold hover:border-black transition-colors"
                                >
                                    {currentSortLabel}
                                    <ChevronDown size={16} />
                                </button>
                                {showSortDropdown && (
                                    <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
                                        {SORT_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => {
                                                    setSort(opt.value);
                                                    setShowSortDropdown(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-gray-50 ${
                                                    sort === opt.value ? 'text-black' : 'text-gray-600'
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm font-bold text-red-600">{error}</p>
                            </div>
                        )}

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                            </div>
                        ) : results.length === 0 ? (
                            <div className="border border-dashed border-gray-300 rounded-lg p-14 text-center">
                                <DollarSign size={40} className="mx-auto text-gray-300 mb-4" />
                                <p className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-2">
                                    No se encontraron resultados
                                </p>
                                <p className="text-sm text-gray-500">
                                    Intenta con un rango de precio diferente.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {results.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={getItemLink(item)}
                                        className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-black transition-colors group block"
                                    >
                                        <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
                                            {item.logoUrl ? (
                                                <img
                                                    src={resolveImageUrl(item.logoUrl)}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <DefaultStudioLogo />
                                            )}
                                        </div>

                                        <div className="p-4">
                                            <h3 className="text-sm font-bold text-black mb-1 truncate">{item.name}</h3>

                                            {item.location && (
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                                                    <MapPin size={12} />
                                                    {item.location}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-2 mb-3">
                                                {safeStr(item.category) && (
                                                    <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded">
                                                        {safeStr(item.category)}
                                                    </span>
                                                )}
                                                <span className="text-[10px] font-black uppercase tracking-widest bg-black/5 px-2 py-0.5 rounded">
                                                    {formatPrice(item.minPrice)} - {formatPrice(item.maxPrice)}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                                                    <Star size={13} className="text-yellow-500 fill-yellow-500" />
                                                    {typeof item.rating === 'number' ? item.rating.toFixed(1) : '—'}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {item.reviews || 0} reseñas
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
