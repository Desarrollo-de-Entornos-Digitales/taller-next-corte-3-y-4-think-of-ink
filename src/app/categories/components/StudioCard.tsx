'use client';

import { Star, MapPin } from 'lucide-react';

interface StudioCardProps {
    name: string;
    city: string;
    rating: number;
    image?: string;
}

export const StudioCard = ({ name, city, rating, image }: StudioCardProps) => {
    return (
        <div className="border border-[#D9D9D9] rounded-lg overflow-hidden bg-white hover:border-black transition-colors group">
            <div className="aspect-[16/9] bg-[#D9D9D9] relative overflow-hidden">
                {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-[120%] h-[0.5px] bg-black/10 rotate-[20deg] absolute" />
                        <div className="w-[120%] h-[0.5px] bg-black/10 -rotate-[20deg] absolute" />
                        <span className="text-4xl opacity-20">🏢</span>
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
        </div>
    );
};
