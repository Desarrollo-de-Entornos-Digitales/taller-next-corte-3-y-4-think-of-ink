'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Star, MapPin } from 'lucide-react';

interface StudioCardProps {
    name: string;
    city: string;
    rating: number;
    image?: string;
    studioId?: string;
}

const STUDIO_PLACEHOLDER = (
    <svg viewBox="0 0 200 113" className="w-full h-full p-5 opacity-15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="50" y="35" width="100" height="65" rx="3" />
        <polygon points="40,45 100,18 160,45" />
        <rect x="60" y="55" width="25" height="25" rx="2" />
        <rect x="92" y="50" width="55" height="40" rx="2" />
        <line x1="110" y1="55" x2="110" y2="85" />
        <line x1="130" y1="55" x2="130" y2="85" />
        <line x1="92" y1="65" x2="147" y2="65" />
        <circle cx="72" cy="75" r="3" fill="currentColor" />
        <circle cx="72" cy="67" r="3" fill="currentColor" />
        <path d="M120 78 L110 90 L120 95 L130 90Z" />
        <line x1="72" y1="80" x2="72" y2="95" strokeWidth="2" />
    </svg>
);

export const StudioCard = ({ name, city, rating, image, studioId }: StudioCardProps) => {
    const Wrapper = studioId ? Link : 'div';
    const wrapperProps = studioId ? { href: `/studio/${studioId}`, className: 'border border-[#D9D9D9] rounded-lg overflow-hidden bg-white hover:border-black transition-colors group block' } as any
        : { className: 'border border-[#D9D9D9] rounded-lg overflow-hidden bg-white hover:border-black transition-colors group' };
    return (
        <Wrapper {...wrapperProps}>
            <div className="aspect-[16/9] bg-[#D9D9D9] relative overflow-hidden">
                {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-black">
                        {STUDIO_PLACEHOLDER}
                    </div>
                )}
            </div>

            <div className="p-4">
                <h4 className="text-sm font-bold text-black mb-1">{name}</h4>
                <div className="flex items-center gap-1 mb-3">
                    <MapPin size={12} className="text-[#474747]" />
                    <span className="text-xs text-[#474747] font-medium">{city}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Star size={14} className="text-[#6000FF] fill-[#6000FF]" />
                    <span className="text-sm font-bold text-black">{rating.toFixed(1)}</span>
                </div>
            </div>
        </Wrapper>
    );
};
