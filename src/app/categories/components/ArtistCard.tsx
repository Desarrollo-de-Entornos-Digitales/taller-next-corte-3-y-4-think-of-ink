'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { resolveImageUrl } from '@/lib/utils';

interface ArtistCardProps {
    name: string;
    city: string;
    specialty: string;
    rating: number;
    avatar: string;
    logoUrl?: string;
    userId?: string;
    studioId?: string;
}

export const ArtistCard = ({ name, city, specialty, rating, avatar, logoUrl, userId, studioId }: ArtistCardProps) => {
    const linkHref = studioId ? `/studio/${studioId}` : userId ? `/profile/${userId}` : '';
    const Wrapper = linkHref ? Link : 'div';
    const wrapperProps = linkHref ? { href: linkHref, className: 'border border-[#D9D9D9] rounded-lg p-4 bg-white hover:border-black transition-colors flex items-center gap-4' } as any
        : { className: 'border border-[#D9D9D9] rounded-lg p-4 bg-white hover:border-black transition-colors flex items-center gap-4' };
    return (
        <Wrapper {...wrapperProps}>
            <div className="w-14 h-14 rounded-full bg-[#E5D9F2] flex items-center justify-center text-lg font-black text-[#6000FF] flex-shrink-0 overflow-hidden">
                {logoUrl ? (
                    <img src={resolveImageUrl(logoUrl)} alt={name} className="w-full h-full object-cover" />
                ) : (
                    avatar
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-black">{name}</h4>
                <p className="text-xs text-[#474747] font-medium mt-0.5">{city}</p>
                <p className="text-xs text-[#474747] font-medium mt-0.5">{specialty}</p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
                <Star size={14} className="text-[#6000FF] fill-[#6000FF]" />
                <span className="text-sm font-bold text-black">{rating.toFixed(1)}</span>
            </div>
        </Wrapper>
    );
};
