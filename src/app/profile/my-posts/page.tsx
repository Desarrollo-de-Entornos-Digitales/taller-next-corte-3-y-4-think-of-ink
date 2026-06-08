'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
import { Navbar } from '@/app/components/Navbar';
import { Sidebar } from '@/app/components/Sidebar';
import { ProfileHeader } from '../components/ProfileHeader';
import { UserPostCard } from '../components/UserPostCard';
import { DeletePostModal } from '../components/DeletePostModal';
import { UserProfile, UserPost } from '@/lib/types';
import { getMyPosts, deletePost, normalizePostsResponse, getComments, createComment, deleteComment } from '@/lib/api/posts';
import { resolveImageUrl, formatDate } from '@/lib/utils';
import { useUser } from '@/app/context/UserContext';

export default function MyPostsPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<UserPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { user } = useUser();
    const [detailPost, setDetailPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [commentText, setCommentText] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const commentInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        if (!token) {
            router.push('/login');
            return;
        }

        if (username) {
            setProfile({
                id: user?.id || '',
                name: username,
                username,
                email: '',
                profession: localStorage.getItem('profession') || 'Creador Digital',
                location: localStorage.getItem('location') || 'Colombia',
                totalPosts: 0,
                avatar: user?.avatar || '',
            });
        }
    }, [router, user]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                setError(null);
                setLoading(true);
                const token = localStorage.getItem('token');

                if (!token) {
                    setError('Token no disponible');
                    return;
                }

                const response = await getMyPosts(token);
                const postsArray = normalizePostsResponse(response);

                const getCount = (val: any): number => {
                    if (typeof val === 'number') return val;
                    if (Array.isArray(val)) return val.length;
                    return 0;
                };

                const mappedPosts: UserPost[] = postsArray.map((post: any) => ({
                    id: post.id,
                    title: post.title || 'Nueva publicación',
                    content: post.content || '',
                    imageUrl: resolveImageUrl(post.imageUrl),
                    location: post.location,
                    postType: post.postType,
                    user: {
                        id: post.user?.id || user?.id || '',
                        username: post.user?.username || 'Usuario',
                        avatar: post.user?.avatar || user?.avatar,
                    },
                    category: post.category,
                    stats: {
                        likes: getCount(post._count?.likes ?? post.likes ?? post.likesCount ?? 0),
                        comments: getCount(post._count?.comments ?? post.comments ?? post.commentsCount ?? 0),
                    },
                    createdAt: post.createdAt || new Date().toISOString(),
                }));

                setPosts(mappedPosts);

                setProfile((prev) =>
                    prev
                        ? { ...prev, totalPosts: mappedPosts.length, avatar: user?.avatar || prev.avatar }
                        : null
                );
            } catch (err: any) {
                console.error('Error fetching posts:', err);
                if (err?.message === 'Unauthorized' || err?.message?.includes('401')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    router.push('/login');
                    return;
                }
                setError('No pudimos cargar tus publicaciones. Intenta nuevamente.');
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [router, user]);

    const handleDeleteClick = (postId: string) => {
        setPostToDelete(postId);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!postToDelete) return;

        try {
            setIsDeleting(true);
            setError(null);
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Token no disponible');
                return;
            }

            await deletePost(postToDelete, token);

            setPosts((prev) => prev.filter((post) => post.id !== postToDelete));

            setProfile((prev) =>
                prev ? { ...prev, totalPosts: prev.totalPosts - 1 } : null
            );

            setDeleteModalOpen(false);
            setPostToDelete(null);
            if (detailPost?.id === postToDelete) setDetailPost(null);
        } catch (err) {
            console.error('Error deleting post:', err);
            setError('No pudimos eliminar la publicación. Intenta nuevamente.');
        } finally {
            setIsDeleting(false);
        }
    };

    const openComments = async (postId: string) => {
        const post = posts.find((p) => p.id === postId);
        if (!post) return;
        setDetailPost(post);
        setComments([]);
        setCommentText('');
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            setCommentsLoading(true);
            const response = await getComments(postId, token);
            const commentsData = Array.isArray(response)
                ? response
                : response.data && Array.isArray(response.data)
                    ? response.data
                    : response.comments && Array.isArray(response.comments)
                        ? response.comments
                        : [];
            setComments(commentsData);
        } catch (err) {
            console.error('Error fetching comments:', err);
            setComments([]);
        } finally {
            setCommentsLoading(false);
        }
    };

    const closeDetail = () => {
        setDetailPost(null);
        setComments([]);
        setCommentText('');
    };

    const handleSubmitComment = async () => {
        if (!commentText.trim() || !detailPost) return;
        const token = localStorage.getItem('token');
        if (!token) return;

        setIsSubmittingComment(true);
        try {
            const res = await createComment(detailPost.id, commentText, token);
            const newComment = res?.data || res?.comment || res;
            setComments((prev) => [...prev, newComment]);
            setCommentText('');
            const newCount = typeof res?.commentsCount === 'number' ? res.commentsCount
                : res?._count?.comments ?? newComment?.commentsCount ?? newComment?._count?.comments;
            if (newCount !== undefined) {
                setPosts((prev) =>
                    prev.map((p) =>
                        p.id === detailPost.id
                            ? { ...p, stats: { ...p.stats, comments: newCount } }
                            : p
                    )
                );
            }
        } catch (err) {
            console.error('Error creating comment:', err);
            alert('Error al enviar comentario');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!detailPost) return;
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            await deleteComment(detailPost.id, commentId, token);
            setComments((prev) => prev.filter((c) => c.id !== commentId));
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    if (loading && !profile) {
        return (
            <main className="min-h-screen bg-white text-black">
                <Navbar />
                <div className="flex pt-20">
                    <Sidebar />
                    <section className="flex-1 bg-white p-8 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-sm font-bold text-gray-600">
                                Cargando publicaciones...
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white text-black">
            <Navbar />

            <div className="flex pt-20">
                <Sidebar />

                <section className="flex-1 bg-white overflow-y-auto h-[calc(100vh-5rem)]">
                    {profile && <ProfileHeader profile={profile} />}

                    <div className="p-8 border-b border-gray-100">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-2xl font-black tracking-tight">
                                Mis publicaciones
                            </h2>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="max-w-3xl mx-auto">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm font-bold text-red-600">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {loading ? (
                                <div className="flex justify-center py-10">
                                    <div className="text-center">
                                        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-sm font-bold text-gray-600">
                                            Cargando...
                                        </p>
                                    </div>
                                </div>
                            ) : posts.length > 0 ? (
                                <div className="flex flex-col gap-6">
                                    {posts.map((post) => (
                                        <UserPostCard
                                            key={post.id}
                                            post={post}
                                            onDeleteClick={handleDeleteClick}
                                            onViewComments={openComments}
                                            isDeleting={isDeleting && postToDelete === post.id}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center">
                                    <div className="mb-4">
                                        <svg
                                            className="w-12 h-12 mx-auto text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2v-5a2 2 0 012-2h2.924a1 1 0 00.894-.553l.812-1.622a1 1 0 00-.894-1.447h-5.28a2 2 0 00-2 2v5c0 1.1.9 2 2 2m2 0a2 2 0 100-4m0 4a2 2 0 110-4m6-5a1 1 0 100-2 1 1 0 000 2z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-4">
                                        No hay publicaciones todavía
                                    </p>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Comparte tu primera publicación con la comunidad
                                    </p>
                                    <Link
                                        href="/feed"
                                        className="inline-block px-6 py-3 bg-[#6000FF] text-white font-bold rounded-md hover:bg-[#5000DD] transition-colors"
                                    >
                                        Crear primera publicación
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {/* Comments Modal */}
            {detailPost && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <button onClick={closeDetail} className="text-gray-400 hover:text-black">
                                    <ChevronLeft size={24} strokeWidth={1.5} />
                                </button>
                                <h2 className="text-xl font-black">Comentarios</h2>
                            </div>
                            <button onClick={closeDetail} className="text-2xl text-gray-400 hover:text-black">✕</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {detailPost.imageUrl && (
                                <div className="rounded-lg overflow-hidden border border-gray-200 mb-6">
                                    <img src={detailPost.imageUrl} alt={detailPost.title} className="w-full max-h-60 object-cover" />
                                </div>
                            )}

                            <Link href={`/profile/${detailPost.user?.id}`} className="flex items-center gap-3 mb-4 group">
                                <div className="w-10 h-10 rounded-full bg-[#E5D9F2] flex items-center justify-center text-[#6000FF] font-bold flex-shrink-0 overflow-hidden">
                                    {detailPost.user?.avatar ? (
                                        <img src={detailPost.user.avatar} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        detailPost.user?.username?.charAt(0)?.toUpperCase() || '👤'
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold group-hover:underline">{detailPost.user?.username || 'Usuario'}</p>
                                    <p className="text-xs text-gray-400">{formatDate(detailPost.createdAt)}</p>
                                </div>
                            </Link>

                            <h3 className="text-lg font-bold mb-2">{detailPost.title}</h3>
                            {detailPost.content && <p className="text-sm text-gray-600 leading-relaxed mb-4">{detailPost.content}</p>}

                            <div className="flex items-center gap-4 pb-4 border-b border-gray-200 mb-6">
                                <div className="flex items-center gap-1.5">
                                    <Heart size={18} className="text-gray-600" />
                                    <span className="text-sm font-bold text-gray-600">{detailPost.stats?.likes} likes</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MessageCircle size={18} className="text-gray-600" />
                                    <span className="text-sm font-bold text-gray-600">{detailPost.stats?.comments} comentarios</span>
                                </div>
                            </div>

                            {/* Comments */}
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <MessageCircle size={18} className="text-gray-600" />
                                    <h4 className="text-sm font-black">{comments.length} Comentarios</h4>
                                </div>

                                {commentsLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                                    </div>
                                ) : comments.length > 0 ? (
                                    <div className="space-y-5 mb-6">
                                        {comments.map((comment: any) => {
                                            const isOwner = String(comment.user?.id) === String(user?.id);
                                            return (
                                                <div key={comment.id} className="flex gap-3">
                                                    <Link href={comment.user?.id ? `/profile/${comment.user.id}` : '#'} className="flex-shrink-0 mt-1">
                                                        <div className="w-8 h-8 rounded-full bg-[#E5D9F2] flex items-center justify-center text-[10px] font-bold text-[#6000FF] overflow-hidden">
                                                            {comment.user?.avatar ? (
                                                                <img src={comment.user.avatar} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                comment.user?.username?.charAt(0)?.toUpperCase() || '👤'
                                                            )}
                                                        </div>
                                                    </Link>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <Link href={comment.user?.id ? `/profile/${comment.user.id}` : '#'} className="text-xs font-bold hover:underline truncate">
                                                                {comment.user?.username || 'Usuario'}
                                                            </Link>
                                                            <span className="text-[10px] text-gray-400 whitespace-nowrap">{formatDate(comment.createdAt)}</span>
                                                            {isOwner && (
                                                                <button
                                                                    onClick={() => handleDeleteComment(comment.id)}
                                                                    className="ml-auto text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                                                                    title="Eliminar comentario"
                                                                >
                                                                    <Trash2 size={13} />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{comment.content}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg mb-6">
                                        <MessageCircle size={28} className="mx-auto text-gray-300 mb-2" strokeWidth={1.5} />
                                        <p className="text-sm text-gray-400 font-medium">No hay comentarios aún</p>
                                        <p className="text-xs text-gray-300 mt-1">Sé el primero en comentar</p>
                                    </div>
                                )}

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex gap-3">
                                        <input
                                            ref={commentInputRef}
                                            type="text"
                                            placeholder="Escribe un comentario..."
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSubmitComment();
                                                }
                                            }}
                                            className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-md focus:border-black focus:outline-none font-medium text-sm"
                                        />
                                        <button
                                            onClick={handleSubmitComment}
                                            disabled={!commentText.trim() || isSubmittingComment}
                                            className="px-5 py-2.5 bg-black text-white rounded-md font-bold text-sm hover:bg-[#333] transition-colors disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isSubmittingComment ? (
                                                <span className="loading loading-spinner loading-sm" />
                                            ) : (
                                                <Send size={16} />
                                            )}
                                            <span className="hidden sm:inline">Publicar</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            <DeletePostModal
                isOpen={deleteModalOpen}
                postId={postToDelete || ''}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setPostToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
            />
        </main>
    );
}