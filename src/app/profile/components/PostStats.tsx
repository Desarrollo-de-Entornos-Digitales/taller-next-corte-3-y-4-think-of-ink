'use client';

import { Heart, MessageCircle } from 'lucide-react';
import { PostStats as PostStatsType } from '@/lib/types';

interface PostStatsProps {
    stats: PostStatsType;
    onViewComments?: () => void;
}

export const PostStats = ({ stats, onViewComments }: PostStatsProps) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Heart size={18} className="text-gray-600" />
                    <span className="text-sm font-bold text-gray-600">{stats.likes}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MessageCircle size={18} className="text-gray-600" />
                    <span className="text-sm font-bold text-gray-600">{stats.comments}</span>
                </div>
            </div>

            {onViewComments && (
                <button
                    onClick={onViewComments}
                    className="text-sm font-black tracking-[0.15em] uppercase border-b-2 border-transparent hover:border-black transition-all"
                >
                    Ver comentarios
                </button>
            )}
        </div>
    );
};