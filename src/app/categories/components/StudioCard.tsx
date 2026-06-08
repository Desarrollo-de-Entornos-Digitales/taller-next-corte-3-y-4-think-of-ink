'use client';

import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';

interface StudioCardProps {
    name: string;
    city: string;
    rating: number;
    image?: string;
    studioId?: string;
}

const FALLBACK_LOGO = '/images/logos/ink-starter-studio.png';

export const StudioCard = ({ name, city, rating, image, studioId }: StudioCardProps) => {
    const Wrapper = studioId ? Link : 'div';
    const wrapperProps = studioId ? { href: `/studio/${studioId}`, className: 'border border-[#D9D9D9] rounded-lg overflow-hidden bg-white hover:border-black transition-colors group block' } as any
        : { className: 'border border-[#D9D9D9] rounded-lg overflow-hidden bg-white hover:border-black transition-colors group' };
    return (
        <Wrapper {...wrapperProps}>
            <div className="aspect-[16/9] bg-[#D9D9D9] relative overflow-hidden flex items-center justify-center">
                <img
                    src={image || FALLBACK_LOGO}
                    alt={name}
                    className="w-full h-full object-contain p-6"
                />
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
