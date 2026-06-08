'use client';

import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';

interface TattooCardProps {
    image?: string;
    author: string;
    authorAvatar: string;
    title: string;
    likes: number;
    comments: number;
    userId?: string;
    studioId?: string;
    liked?: boolean;
    onLike?: (postId: string) => void;
    postId?: string;
}

export const TattooCard = ({ image, author, authorAvatar, title, likes, comments, userId, studioId, liked, onLike, postId }: TattooCardProps) => {
    return (
        <div className="border border-[#D9D9D9] rounded-lg overflow-hidden bg-white hover:border-black transition-colors group">
            <div className="aspect-[4/3] bg-[#D9D9D9] relative overflow-hidden">
                {image ? (
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-gray-300 select-none">
                        {authorAvatar}
                    </div>
                )}
            </div>

            <div className="p-4">
                <Link href={studioId ? `/studio/${studioId}` : userId ? `/profile/${userId}` : '#'} className="flex items-center gap-2 mb-3 group">
                    <div className="w-6 h-6 rounded-full bg-[#E5D9F2] flex items-center justify-center text-[10px] font-black text-[#6000FF] flex-shrink-0 overflow-hidden">
                        {authorAvatar}
                    </div>
                    <span className="text-xs font-bold text-black group-hover:underline">{author}</span>
                </Link>

                <h3 className="text-sm font-bold text-black mb-3 line-clamp-2 leading-snug">{title}</h3>

                <div className="flex items-center gap-4 pt-3 border-t border-[#D9D9D9]">
                    <button
                        onClick={() => postId && onLike?.(postId)}
                        className="flex items-center gap-1.5"
                    >
                        <Heart
                            size={15}
                            className={liked ? 'text-red-500 fill-red-500' : 'text-[#474747]'}
                        />
                        <span className={`text-xs font-bold ${liked ? 'text-red-500' : 'text-[#474747]'}`}>{likes}</span>
                    </button>
                    <div className="flex items-center gap-1.5">
                        <MessageCircle size={15} className="text-[#474747]" />
                        <span className="text-xs font-bold text-[#474747]">{comments}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};