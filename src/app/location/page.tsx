'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, Star, Navigation } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

const MapSection = dynamic(() => import('./MapSection'), { ssr: false });

interface Studio {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    rating: number;
    distance: string;
    image: string;
}

const STUDIOS: Studio[] = [
    {
        id: '1',
        name: 'Ink Starter Studio',
        address: 'San Fernando, Cali',
        lat: 3.4422,
        lng: -76.5231,
        rating: 4.9,
        distance: '0.4 km',
        image: '/images/logos/ink-starter-studio.png',
    },
    {
        id: '2',
        name: 'Black House Tattoo',
        address: 'Granada, Cali',
        lat: 3.4512,
        lng: -76.532,
        rating: 4.8,
        distance: '0.8 km',
        image: '/images/logos/black-house-tattoo.png',
    },
    {
        id: '3',
        name: 'Real Ink Tattoo',
        address: 'Centro, Cali',
        lat: 3.4351,
        lng: -76.515,
        rating: 4.7,
        distance: '1.2 km',
        image: '/images/logos/real-ink-tattoo.png',
    },
    {
        id: '4',
        name: 'Neo Art Studio',
        address: 'San Antonio, Cali',
        lat: 3.428,
        lng: -76.54,
        rating: 4.9,
        distance: '1.5 km',
        image: '/images/logos/neo-art-studio.png',
    },
    {
        id: '5',
        name: 'Fine Line Studio',
        address: 'Menga, Cali',
        lat: 3.46,
        lng: -76.528,
        rating: 4.7,
        distance: '2.1 km',
        image: '/images/logos/fine-line-studio.png',
    },
];

export default function LocationPage() {
    const [search, setSearch] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const mapRef = useRef<any>(null);

    const filteredStudios = STUDIOS.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.address.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = useCallback((id: string) => {
        setSelectedId(id);
    }, []);

    const handleMapReady = useCallback((map: any) => {
        mapRef.current = map;
    }, []);

    useEffect(() => {
        if (selectedId && mapRef.current) {
            const studio = STUDIOS.find((s) => s.id === selectedId);
            if (studio) {
                mapRef.current.flyTo([studio.lat, studio.lng], 15, {
                    duration: 0.6,
                });
            }
        }
    }, [selectedId]);

    return (
        <main className="min-h-screen bg-white text-black">
            <Navbar />
            <div className="flex pt-20">
                <Sidebar />
                <section className="flex-1 bg-white overflow-y-auto h-[calc(100vh-5rem)]">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-black tracking-tight text-black mb-2">
                                Explora estudios cerca de ti
                            </h1>
                            <p className="text-sm text-gray-500 font-medium">
                                Encuentra tatuadores y estudios según tu ubicación.
                            </p>
                        </div>

                        <div className="relative mb-6">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar ciudad, barrio o estudio..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none text-sm font-medium transition-all bg-white"
                            />
                        </div>

                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="w-full lg:w-[70%] h-[400px] lg:h-[520px] rounded-lg overflow-hidden border border-gray-200">
                                <MapSection
                                    studios={filteredStudios}
                                    selectedId={selectedId}
                                    onSelect={handleSelect}
                                    onMapReady={handleMapReady}
                                />
                            </div>

                            <div className="w-full lg:w-[30%]">
                                <div className="bg-white rounded-lg border border-gray-200 p-5">
                                    <h2 className="text-sm font-black mb-4">
                                        Estudios y tatuadores cercanos
                                    </h2>

                                    {filteredStudios.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-8">
                                            No se encontraron resultados
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {filteredStudios.map((studio) => (
                                                <button
                                                    key={studio.id}
                                                    onClick={() => handleSelect(studio.id)}
                                                    className={`w-full text-left p-3 rounded-lg transition-colors flex gap-3 ${
                                                        selectedId === studio.id
                                                            ? 'bg-gray-100 border border-gray-200'
                                                            : 'hover:bg-gray-50 border border-transparent'
                                                    }`}
                                                >
                                                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                        {studio.image ? (
                                                            <img
                                                                src={studio.image}
                                                                alt={studio.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <MapPin size={20} className="text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-black truncate">
                                                            {studio.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {studio.address}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-1.5">
                                                            <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                                                                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                                                {studio.rating}
                                                            </span>
                                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                                <Navigation size={12} />
                                                                {studio.distance}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
