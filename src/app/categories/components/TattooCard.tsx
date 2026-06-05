'use client';

import { useMemo } from 'react';
import { Heart, MessageCircle } from 'lucide-react';

interface TattooCardProps {
    image?: string;
    author: string;
    authorAvatar: string;
    title: string;
    likes: number;
    comments: number;
}

const PLACEHOLDER_VARIANTS = [
    // Skull & crossbones (traditional tattoo flash)
    <svg key="0" viewBox="0 0 200 150" className="w-full h-full p-6 opacity-15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="100" cy="62" r="30" />
        <ellipse cx="88" cy="55" rx="4" ry="5" />
        <ellipse cx="112" cy="55" rx="4" ry="5" />
        <path d="M90 72 Q100 82 110 72" />
        <rect x="95" y="78" width="10" height="20" rx="2" />
        <path d="M70 98 L55 130" />
        <path d="M130 98 L145 130" />
        <path d="M100 90 L100 60" strokeDasharray="3 3" />
    </svg>,
    // Rose (traditional)
    <svg key="1" viewBox="0 0 200 150" className="w-full h-full p-6 opacity-15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M100 80 C70 50 50 70 60 90 C70 110 90 120 100 130 C110 120 130 110 140 90 C150 70 130 50 100 80Z" />
        <path d="M100 80 C80 65 65 80 75 95 C80 105 90 110 100 115" />
        <path d="M100 80 C120 65 135 80 125 95 C120 105 110 110 100 115" />
        <path d="M100 80 C90 60 75 55 65 70" />
        <path d="M100 80 C110 60 125 55 135 70" />
        <path d="M100 115 L100 140" strokeWidth="2" />
        <path d="M85 135 L115 135" strokeWidth="1" />
        <path d="M70 125 L82 130" />
        <path d="M130 125 L118 130" />
    </svg>,
    // Diamond / geometric
    <svg key="2" viewBox="0 0 200 150" className="w-full h-full p-6 opacity-15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="100,25 175,75 100,125 25,75" />
        <polygon points="100,42 155,75 100,108 45,75" />
        <polygon points="100,58 135,75 100,92 65,75" />
        <line x1="100" y1="25" x2="100" y2="125" />
        <line x1="25" y1="75" x2="175" y2="75" />
        <circle cx="100" cy="75" r="8" />
        <circle cx="100" cy="75" r="3" fill="currentColor" />
    </svg>,
    // Mandala
    <svg key="3" viewBox="0 0 200 150" className="w-full h-full p-6 opacity-15" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="100" cy="75" r="50" />
        <circle cx="100" cy="75" r="40" strokeDasharray="4 4" />
        <circle cx="100" cy="75" r="30" />
        <circle cx="100" cy="75" r="20" strokeDasharray="3 3" />
        <circle cx="100" cy="75" r="10" />
        <circle cx="100" cy="75" r="3" fill="currentColor" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line key={angle} x1="100" y1="75" x2={100 + 50 * Math.cos(angle * Math.PI / 180)} y2={75 + 50 * Math.sin(angle * Math.PI / 180)} />
        ))}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
            <line key={angle} x1={100 + 30 * Math.cos(angle * Math.PI / 180)} y1={75 + 30 * Math.sin(angle * Math.PI / 180)} x2={100 + 50 * Math.cos(angle * Math.PI / 180)} y2={75 + 50 * Math.sin(angle * Math.PI / 180)} />
        ))}
    </svg>,
    // Needle / tattoo machine
    <svg key="4" viewBox="0 0 200 150" className="w-full h-full p-6 opacity-15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="75" y="20" width="50" height="30" rx="5" />
        <circle cx="100" cy="35" r="10" />
        <line x1="100" y1="50" x2="100" y2="120" strokeWidth="1" />
        <path d="M85 50 L70 60" />
        <path d="M115 50 L130 60" />
        <circle cx="100" cy="122" r="5" />
        <path d="M60 35 L75 35" />
        <path d="M125 35 L140 35" />
        <line x1="95" y1="118" x2="90" y2="125" strokeWidth="0.8" />
        <line x1="105" y1="118" x2="110" y2="125" strokeWidth="0.8" />
    </svg>,
    // Feather / script
    <svg key="5" viewBox="0 0 200 150" className="w-full h-full p-6 opacity-15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M60 100 Q80 40 140 30 Q120 50 110 70 Q100 90 90 100 Q80 110 60 100Z" />
        <path d="M110 70 L160 45" strokeWidth="1" />
        <path d="M100 85 L155 65" strokeWidth="1" />
        <path d="M90 95 L145 80" strokeWidth="1" />
        <path d="M65 35 L60 20" strokeWidth="2" />
        <path d="M60 20 Q55 10 65 8" />
        <line x1="60" y1="100" x2="50" y2="130" strokeWidth="2" />
        <path d="M130 35 Q135 40 145 33" fill="currentColor" opacity="0.5" />
    </svg>,
    // Tribal / Polynesian pattern
    <svg key="6" viewBox="0 0 200 150" className="w-full h-full p-6 opacity-15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 20 L50 10 L60 30 L55 50 L70 45 L80 60 L65 75 L50 70 L40 85 L30 75 Z" />
        <path d="M160 20 L150 10 L140 30 L145 50 L130 45 L120 60 L135 75 L150 70 L160 85 L170 75 Z" />
        <path d="M40 130 L50 140 L60 120 L55 100 L70 105 L80 90 L65 75 L50 80 L40 65 L30 75 Z" />
        <path d="M160 130 L150 140 L140 120 L145 100 L130 105 L120 90 L135 75 L150 80 L160 65 L170 75 Z" />
        <path d="M80 45 L100 35 L120 45" />
        <path d="M80 105 L100 115 L120 105" />
        <line x1="100" y1="35" x2="100" y2="115" />
        <circle cx="100" cy="75" r="15" />
        <circle cx="100" cy="75" r="6" fill="currentColor" />
    </svg>,
    // Eye (anime/realism)
    <svg key="7" viewBox="0 0 200 150" className="w-full h-full p-6 opacity-15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M55 75 Q100 45 145 75 Q100 105 55 75Z" />
        <circle cx="100" cy="75" r="18" />
        <circle cx="100" cy="75" r="10" />
        <circle cx="100" cy="75" r="3" fill="currentColor" />
        <circle cx="108" cy="70" r="3" fill="currentColor" opacity="0.3" />
        <path d="M55 75 Q100 55 145 75" strokeWidth="2" />
        <path d="M40 65 L55 70" />
        <path d="M160 65 L145 70" />
        <line x1="45" y1="60" x2="50" y2="68" />
        <line x1="155" y1="60" x2="150" y2="68" />
    </svg>,
];

export const TattooCard = ({ image, author, authorAvatar, title, likes, comments }: TattooCardProps) => {
    const placeholder = useMemo(() => {
        let hash = 0;
        for (let i = 0; i < title.length; i++) {
            hash = ((hash << 5) - hash) + title.charCodeAt(i);
        }
        return PLACEHOLDER_VARIANTS[Math.abs(hash) % PLACEHOLDER_VARIANTS.length];
    }, [title]);

    return (
        <div className="border border-[#D9D9D9] rounded-lg overflow-hidden bg-white hover:border-black transition-colors group">
            <div className="aspect-[4/3] bg-[#D9D9D9] relative overflow-hidden">
                {image ? (
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-black">
                        {placeholder}
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#E5D9F2] flex items-center justify-center text-[10px] font-black text-[#6000FF] flex-shrink-0">
                        {authorAvatar}
                    </div>
                    <span className="text-xs font-bold text-black">{author}</span>
                </div>

                <h3 className="text-sm font-bold text-black mb-3 line-clamp-2 leading-snug">{title}</h3>

                <div className="flex items-center gap-4 pt-3 border-t border-[#D9D9D9]">
                    <div className="flex items-center gap-1.5">
                        <Heart size={15} className="text-[#474747]" />
                        <span className="text-xs font-bold text-[#474747]">{likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MessageCircle size={15} className="text-[#474747]" />
                        <span className="text-xs font-bold text-[#474747]">{comments}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
