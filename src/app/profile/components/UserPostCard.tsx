'use client';

import Link from 'next/link';
import { MoreVertical } from 'lucide-react';
import { UserPost } from '@/lib/types';
import { PostStats } from './PostStats';
import { formatDate, resolveImageUrl } from '@/lib/utils';

interface UserPostCardProps {
    post: UserPost;
    onDeleteClick: (postId: string) => void;
    onViewComments?: (postId: string) => void;
    isDeleting?: boolean;
}

export const UserPostCard = ({ post, onDeleteClick, onViewComments, isDeleting = false }: UserPostCardProps) => {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-gray-300 transition-colors group">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <Link href={`/profile/${post.user.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#E5D9F2] flex items-center justify-center text-sm font-bold text-[#6000FF] overflow-hidden flex-shrink-0">
                        {post.user.avatar ? (
                            <img src={post.user.avatar} alt={post.user.username} className="w-full h-full object-cover" />
                        ) : (
                            post.user.username.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-black hover:underline truncate">{post.user.username}</p>
                        <p className="text-xs text-gray-400 font-medium">
                            {formatDate(post.createdAt)}
                        </p>
                    </div>
                </Link>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={() => onDeleteClick(post.id)}
                        disabled={isDeleting}
                        className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
                            isDeleting
                                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                        }`}
                    >
                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <MoreVertical size={18} className="text-gray-400 hover:text-black" />
                    </button>
                </div>
            </div>

            {/* Image */}
            {post.imageUrl && (
                <div className="w-full aspect-[2.5/1] bg-gray-200 overflow-hidden">
                    <img
                        src={resolveImageUrl(post.imageUrl)}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-bold mb-2 tracking-tight">{post.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                    {post.content}
                </p>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
                <PostStats stats={post.stats} onViewComments={onViewComments ? () => onViewComments(post.id) : undefined} />
            </div>
        </div>
    );
};
