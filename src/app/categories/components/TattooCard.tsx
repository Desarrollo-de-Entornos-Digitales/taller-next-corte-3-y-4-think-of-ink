'use client';

import { Heart, MessageCircle } from 'lucide-react';

interface TattooCardProps {
    image?: string;
    author: string;
    authorAvatar: string;
    title: string;
    likes: number;
    comments: number;
}

export const TattooCard = ({ image, author, authorAvatar, title, likes, comments }: TattooCardProps) => {
    return (
        <div className="border border-[#D9D9D9] rounded-lg overflow-hidden bg-white hover:border-black transition-colors group">
            <div className="aspect-[4/3] bg-[#D9D9D9] relative overflow-hidden">
                {image ? (
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-[120%] h-[0.5px] bg-black/10 rotate-[20deg] absolute" />
                        <div className="w-[120%] h-[0.5px] bg-black/10 -rotate-[20deg] absolute" />
                        <span className="text-3xl opacity-20">🖤</span>
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
