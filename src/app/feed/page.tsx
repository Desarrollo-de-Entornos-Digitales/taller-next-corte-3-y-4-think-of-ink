'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Pencil, Megaphone, MessageCircle, Upload, Heart, Bookmark, Send, ChevronLeft, Trash2, AlertCircle } from 'lucide-react';

import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

import { InfoCard } from './ui/InfoCard';
import { getAllPosts, createPost, normalizePostsResponse, likePost, getComments, createComment, deleteComment, deletePost } from '@/lib/api/posts';
import { formatDate, resolveImageUrl } from '@/lib/utils';
import { MOCK_FEED_POSTS } from '@/lib/mock-profiles';
import { CATEGORIES } from '@/lib/categories';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024;

type TabKey = 'para-ti' | 'recientes' | 'siguiendo';

export default function Feed() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [allPosts, setAllPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<TabKey>('para-ti');
    const [showNewPostModal, setShowNewPostModal] = useState(false);
    const [postType, setPostType] = useState('Diseño');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [uploadError, setUploadError] = useState<string>('');
    const [isPublishing, setIsPublishing] = useState(false);
    const [username, setUsername] = useState('Usuario Regular');
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [detailPost, setDetailPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [commentText, setCommentText] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [deleteConfirmPostId, setDeleteConfirmPostId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const commentInputRef = useRef<HTMLInputElement>(null);

    const getCount = (v: any): number => typeof v === 'number' ? v : (Array.isArray(v) ? v.length : 0);

    const fetchPosts = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Token no disponible');
                return;
            }
            const response = await getAllPosts(token);
            let postsArray = normalizePostsResponse(response).map(p => {
                const resolved = resolveImageUrl(p.imageUrl);
                if (p.imageUrl) console.log('[Feed] imageUrl:', p.imageUrl, '→', resolved);
                return { ...p, imageUrl: resolved };
            });
            const camilaPost = MOCK_FEED_POSTS.find(p => p.user?.id === 'camilasanchez');
            const luisPost = MOCK_FEED_POSTS.find(p => p.user?.id === 'luis-rojas');
            const extraPosts = [camilaPost, luisPost].filter(Boolean);
            const existingIds = new Set(postsArray.map(p => p.id));
            for (const ep of extraPosts) {
                if (ep && !existingIds.has(ep.id)) {
                    postsArray.push(ep);
                }
            }
            postsArray = postsArray.slice(0, 3);
            setAllPosts(postsArray);
            const liked = new Set<string>();
            for (const p of postsArray) {
                if (p.likedByCurrentUser || p.isLiked || p.liked) liked.add(p.id);
            }
            setLikedPosts(liked);
        } catch (err) {
            console.error('Error obteniendo posts:', err);
            setAllPosts(MOCK_FEED_POSTS.slice(0, 3));
            setError(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const uid = payload.sub || payload.id || payload.userId;
            if (uid) setCurrentUserId(String(uid));
        } catch {
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const getSortedPosts = useCallback(() => {
        if (activeTab === 'recientes') {
            return [...allPosts].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
        if (activeTab === 'siguiendo') {
            return [];
        }
        return allPosts;
    }, [activeTab, allPosts]);

    const displayPosts = getSortedPosts();
    const itemsPerPage = 3;
    const totalPages = Math.ceil(displayPosts.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentItems = displayPosts.slice(start, end);

    const validateFile = (file: File): string | null => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return 'Formato no válido. Solo se aceptan JPG, PNG y WebP.';
        }
        if (file.size > MAX_SIZE) {
            return 'El archivo es demasiado grande. Máximo 10MB.';
        }
        return null;
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        setUploadError('');
        if (files && files.length > 0) {
            const file = files[0];
            const error = validateFile(file);
            if (error) {
                setUploadError(error);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(null);
        setImagePreview('');
        setUploadError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handlePublish = async () => {
        if (!title.trim() || !description.trim() || !category) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        setIsPublishing(true);
        setUploadError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Token no disponible');
                return;
            }

            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('title', title);
                formData.append('content', description);
                formData.append('category', JSON.stringify({ name: category }));
                if (location) formData.append('location', location);
                formData.append('postType', postType);
                await createPost(formData, token);
            } else {
                await createPost(
                    {
                        content: description,
                        category: { name: category },
                        location: location,
                        postType: postType,
                        title: title,
                    },
                    token
                );
            }

            removeImage();
            setTitle('');
            setDescription('');
            setCategory('');
            setLocation('');
            setPostType('Diseño');
            setShowNewPostModal(false);

            await fetchPosts();
        } catch (error: any) {
            console.error('Error:', error);
            setUploadError(error?.message || 'Error al publicar. Intenta nuevamente.');
        } finally {
            setIsPublishing(false);
        }
    };

    const handleLike = async (postId: string) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const result = await likePost(postId, token);
            const newLikesCount = result?.likesCount ?? result?.likes ?? result?._count?.likes ?? result?.count;
            const nowLiked = result?.likedByCurrentUser ?? result?.isLiked ?? result?.liked ?? false;
            setLikedPosts((prev) => {
                const next = new Set(prev);
                if (nowLiked) next.add(postId);
                else next.delete(postId);
                return next;
            });
            if (newLikesCount !== undefined) {
                setAllPosts((prev) =>
                    prev.map((p) =>
                        p.id === postId ? { ...p, likesCount: newLikesCount, _count: { ...p._count, likes: newLikesCount } } : p
                    )
                );
                setDetailPost((prev: any) =>
                    prev?.id === postId ? { ...prev, likesCount: newLikesCount, _count: { ...prev._count, likes: newLikesCount } } : prev
                );
            }
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    const handleDeletePost = async () => {
        if (!deleteConfirmPostId) return;
        setIsDeleting(true);
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            await deletePost(deleteConfirmPostId, token);
            setAllPosts((prev) => prev.filter((p) => p.id !== deleteConfirmPostId));
            if (detailPost?.id === deleteConfirmPostId) closeDetail();
        } catch (err) {
            console.error('Error deleting post:', err);
            alert('Error al eliminar la publicación');
        } finally {
            setIsDeleting(false);
            setDeleteConfirmPostId(null);
        }
    };

    const openDetail = async (post: any) => {
        setDetailPost(post);
        setComments([]);
        setCommentText('');
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            setCommentsLoading(true);
            const response = await getComments(post.id, token);
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
            const newCount = (typeof res?.commentsCount === 'number' ? res.commentsCount
                : res?._count?.comments ?? newComment?.commentsCount ?? newComment?._count?.comments);
            if (newCount !== undefined) {
                setAllPosts((prev) =>
                    prev.map((p) =>
                        p.id === detailPost.id ? { ...p, commentsCount: newCount, _count: { ...p._count, comments: newCount } } : p
                    )
                );
                setDetailPost((prev: any) =>
                    prev?.id === detailPost.id ? { ...prev, commentsCount: newCount, _count: { ...prev._count, comments: newCount } } : prev
                );
            } else {
                const current = getCount(detailPost._count?.comments ?? detailPost.comments ?? detailPost.commentsCount ?? 0);
                const updated = current + 1;
                setAllPosts((prev) =>
                    prev.map((p) =>
                        p.id === detailPost.id ? { ...p, commentsCount: updated, _count: { ...p._count, comments: updated } } : p
                    )
                );
                setDetailPost((prev: any) =>
                    prev?.id === detailPost.id ? { ...prev, commentsCount: updated, _count: { ...prev._count, comments: updated } } : prev
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
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await deleteComment(detailPost.id, commentId, token);
            setComments((prev) => prev.filter((c) => c.id !== commentId));
            if (detailPost) {
                const desCount = (typeof res?.commentsCount === 'number' ? res.commentsCount
                    : res?._count?.comments);
                const current = getCount(detailPost._count?.comments ?? detailPost.comments ?? detailPost.commentsCount ?? 0);
                const updated = desCount !== undefined ? desCount : Math.max(0, current - 1);
                setDetailPost((prev: any) =>
                    prev ? { ...prev, commentsCount: updated, _count: { ...prev._count, comments: updated } } : prev
                );
                setAllPosts((prev) =>
                    prev.map((p) =>
                        p.id === detailPost.id ? { ...p, commentsCount: updated, _count: { ...p._count, comments: updated } } : p
                    )
                );
            }
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    const handleTabChange = (tab: TabKey) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const getTabClass = (tab: TabKey) => {
        const base = 'pb-3 text-xs font-bold transition-colors';
        if (activeTab === tab) {
            return `${base} border-b-2 border-black`;
        }
        return `${base} text-gray-400 hover:text-black`;
    };

    return (
        <main className="min-h-screen bg-white text-black font-sans">
            <Navbar />

            <div className="flex pt-20">
                <Sidebar onNewPostClick={() => setShowNewPostModal(true)} />

                <section className="flex-1 bg-white p-8 border-l border-gray-100 overflow-y-auto h-[calc(100vh-5rem)]">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex gap-8 border-b border-gray-200 mb-8">
                            <button
                                className={getTabClass('para-ti')}
                                onClick={() => handleTabChange('para-ti')}
                            >
                                Para ti
                            </button>
                            <button
                                className={getTabClass('recientes')}
                                onClick={() => handleTabChange('recientes')}
                            >
                                Publicaciones recientes
                            </button>
                            <button
                                className={getTabClass('siguiendo')}
                                onClick={() => handleTabChange('siguiendo')}
                            >
                                Siguiendo
                            </button>
                        </div>

                        {activeTab === 'siguiendo' && (
                            <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center mb-6">
                                <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">
                                    Funcionalidad disponible próximamente
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm font-bold text-red-600">{error}</p>
                            </div>
                        )}

                        {loading && (
                            <div className="flex justify-center py-10">
                                <div className="text-center">
                                    <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-sm font-bold text-gray-600">
                                        Cargando publicaciones...
                                    </p>
                                </div>
                            </div>
                        )}

                        {!loading && activeTab !== 'siguiendo' && displayPosts.length > 0 && (
                            <>
                                <div className="flex flex-col gap-6">
                                    {currentItems.map((item) => {
                                        const itemLikes = getCount(item._count?.likes ?? item.likes ?? item.likesCount ?? 0);
                                        const itemComments = getCount(item._count?.comments ?? item.comments ?? item.commentsCount ?? 0);
                                        return (
                                            <div key={item.id} className="border border-gray-200 rounded-lg p-6 bg-white hover:border-black transition-colors group">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Link href={item.user?.isStudio ? `/studio/${item.user.id}` : item.user?.id ? `/profile/${item.user.id}` : '#'} className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="w-8 h-8 rounded-full bg-[#E5D9F2] flex items-center justify-center text-[#6000FF] flex-shrink-0 overflow-hidden">
                                                            {item.user?.avatar ? (
                                                                <img src={resolveImageUrl(item.user.avatar)} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-[10px] font-bold">{item.user?.username?.charAt(0)?.toUpperCase() || '👤'}</span>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-bold truncate hover:underline">{item.user?.username || 'Usuario Regular'}</p>
                                                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{item.location || item.user?.location || 'Colombia'}</p>
                                                        </div>
                                                    </Link>
                                                    <div className="ml-auto flex-shrink-0">
                                                        <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                                                            {item.category?.name || 'General'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <h4 className="text-sm font-bold mb-1 tracking-tight">{item.title || 'Nueva publicación'}</h4>
                                                <p className="text-[11px] text-gray-500 leading-relaxed mb-4 line-clamp-3">{item.content}</p>

                                                {item.imageUrl && (
                                                    <div className="mb-4">
                                                        <div className="bg-[#D9D9D9] border border-gray-200 rounded overflow-hidden aspect-[2.5/1]">
                                                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                                                    <button
                                                        onClick={() => handleLike(item.id)}
                                                        className="flex items-center gap-1.5"
                                                    >
                                                        <span className="text-base transition-colors">
                                                            {likedPosts.has(item.id) ? '❤️' : '🤍'}
                                                        </span>
                                                        <span className={`text-xs font-bold ${
                                                            likedPosts.has(item.id) ? 'text-red-500' : 'text-gray-600'
                                                        }`}>
                                                            {itemLikes}
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={() => openDetail(item)}
                                                        className="flex items-center gap-1.5"
                                                    >
                                                        <MessageCircle size={16} className="text-gray-600 hover:text-black transition-colors" />
                                                        <span className="text-xs font-bold text-gray-600">{itemComments}</span>
                                                    </button>
                                                    <div className="ml-auto flex items-center gap-3">
                                                        {String(item.user?.id) === String(currentUserId) && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setDeleteConfirmPostId(item.id); }}
                                                                className="text-[10px] font-black uppercase tracking-[0.15em] text-red-400 hover:text-red-600 transition-colors"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => openDetail(item)}
                                                            className="text-[10px] font-black uppercase tracking-[0.15em] border-b-2 border-transparent hover:border-black transition-all"
                                                        >
                                                            Ver detalles
                                                        </button>
                                                    </div>
                                                </div>

                                                <p className="text-[10px] text-gray-400 mt-2">
                                                    {item.createdAt ? formatDate(item.createdAt) : ''}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex justify-center gap-3 mt-10 pb-8">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                            (page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                                                        page === currentPage
                                                            ? 'bg-black text-white'
                                                            : 'bg-gray-200 text-black hover:bg-gray-300'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {!loading && activeTab !== 'siguiendo' && displayPosts.length === 0 && (
                            <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center">
                                <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">
                                    No hay publicaciones todavía
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Modal Nueva Publicación */}
            {showNewPostModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-8 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h1 className="text-2xl font-black">Nueva publicación</h1>
                                <p className="text-sm text-gray-600">
                                    Comparte tu diseño, promoción o idea con la comunidad.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowNewPostModal(false)}
                                className="text-2xl text-gray-400 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto flex gap-8 p-6">
                            {/* Form */}
                            <div className="flex-1 max-w-2xl space-y-6">
                                <div>
                                    <label className="text-sm font-bold block mb-3">
                                        Tipo de publicación
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Diseño', 'Promoción', 'Solicitud'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setPostType(type)}
                                                className={`py-4 px-3 rounded-md border-2 font-bold text-sm transition-all flex flex-col items-center gap-2 ${
                                                    postType === type
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-gray-300 bg-white text-black hover:border-black'
                                                }`}
                                            >
                                                {type === 'Diseño' && (
                                                    <Pencil size={20} strokeWidth={1.5} />
                                                )}
                                                {type === 'Promoción' && (
                                                    <Megaphone size={20} strokeWidth={1.5} />
                                                )}
                                                {type === 'Solicitud' && (
                                                    <MessageCircle size={20} strokeWidth={1.5} />
                                                )}
                                                <span className="text-xs">{type}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold block mb-2">Título</label>
                                    <input
                                        type="text"
                                        placeholder="Escribe un título atractivo"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-black focus:outline-none font-medium text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-bold block mb-2">
                                        Descripción
                                    </label>
                                    <textarea
                                        placeholder="Cuéntales a todos sobre tu publicación..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={5}
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-black focus:outline-none font-medium text-sm resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold block mb-2">
                                            Categoría
                                        </label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-black focus:outline-none font-medium text-sm bg-white cursor-pointer"
                                        >
                                            <option value="">Selecciona una categoría</option>
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold block mb-2">
                                            Ubicación
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ej. Bogotá, Colombia"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-black focus:outline-none font-medium text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold block mb-2">Imagen</label>

                                    {uploadError && (
                                        <div className="mb-3 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                                            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                                            <p className="text-xs font-medium text-red-600">{uploadError}</p>
                                        </div>
                                    )}

                                    {imagePreview ? (
                                        <div className="relative group">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-32 object-cover rounded-md border border-gray-200"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-md flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-xs font-bold px-4 py-2 rounded-md hover:bg-gray-100"
                                                >
                                                    Reemplazar
                                                </button>
                                                <button
                                                    onClick={removeImage}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-md hover:bg-red-600"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-black transition-colors cursor-pointer relative">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.webp"
                                                onChange={handleImageUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload size={28} strokeWidth={1.5} />
                                                <p className="text-sm font-bold">
                                                    Arrastra una imagen o selecciona archivo
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    JPG, PNG, WebP — Máximo 10MB
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handlePublish}
                                    disabled={isPublishing}
                                    className="w-full bg-black text-white py-3 font-black rounded-md hover:bg-[#333] transition-all text-sm disabled:opacity-50"
                                >
                                    {isPublishing ? 'Publicando...' : 'Publicar'}
                                </button>
                            </div>

                            {/* Preview */}
                            <div className="w-80">
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 sticky top-6">
                                    <h2 className="font-black text-sm mb-3">Vista previa</h2>
                                    <p className="text-xs text-gray-600 mb-3">
                                        Así se verá tu publicación en el feed.
                                    </p>

                                    <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-[#E5D9F2] flex items-center justify-center text-xs">
                                                    👤
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold">{username}</p>
                                                    <p className="text-[9px] text-gray-400">
                                                        {location || 'Tu ubicación'} · 2h
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-black text-sm">
                                                ⋮
                                            </button>
                                        </div>

                                        {title && (
                                            <>
                                                <h4 className="text-xs font-bold">{title}</h4>
                                                <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-2">
                                                    {description}
                                                </p>
                                            </>
                                        )}

                                        {imagePreview && (
                                            <div className="grid gap-1 grid-cols-1">
                                                <div className="bg-gray-200 rounded flex items-center justify-center overflow-hidden aspect-[2.5/1]">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-2 pt-2 border-t border-gray-200">
                                            <button className="flex-1 flex justify-center py-2">
                                                <Heart size={18} strokeWidth={1.5} />
                                            </button>

                                            <button className="flex-1 flex justify-center py-2">
                                                <MessageCircle size={18} strokeWidth={1.5} />
                                            </button>

                                            <button className="flex-1 flex justify-center py-2">
                                                <Bookmark size={18} strokeWidth={1.5} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Confirmación Eliminar */}
            {deleteConfirmPostId && (
                <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                            <Trash2 size={24} className="text-red-500" />
                        </div>
                        <h3 className="text-lg font-black mb-2">Eliminar publicación</h3>
                        <p className="text-sm text-gray-600 mb-6">¿Estás seguro? Esta acción no se puede deshacer.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirmPostId(null)}
                                disabled={isDeleting}
                                className="flex-1 py-3 border-2 border-gray-200 rounded-md font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeletePost}
                                disabled={isDeleting}
                                className="flex-1 py-3 bg-red-500 text-white rounded-md font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? <span className="loading loading-spinner loading-sm" /> : <Trash2 size={16} />}
                                {isDeleting ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detalle de Publicación */}
            {detailPost && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <button onClick={closeDetail} className="text-gray-400 hover:text-black">
                                    <ChevronLeft size={24} strokeWidth={1.5} />
                                </button>
                                <h2 className="text-xl font-black">Detalles</h2>
                            </div>
                            <button onClick={closeDetail} className="text-2xl text-gray-400 hover:text-black">✕</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {detailPost.imageUrl && (
                                <div className="rounded-lg overflow-hidden border border-gray-200 mb-6">
                                    <img src={detailPost.imageUrl} alt={detailPost.title} className="w-full max-h-80 object-cover" />
                                </div>
                            )}

                            <Link href={detailPost.user?.isStudio ? `/studio/${detailPost.user.id}` : detailPost.user?.id ? `/profile/${detailPost.user.id}` : '#'} className="flex items-center gap-3 mb-4 group">
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

                            <h3 className="text-2xl font-black mb-2">{detailPost.title}</h3>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {detailPost.category?.name && (
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                                        {detailPost.category.name}
                                    </span>
                                )}
                                {detailPost.postType && (
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                                        {detailPost.postType}
                                    </span>
                                )}
                                {detailPost.location && (
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                                        📍 {detailPost.location}
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 leading-relaxed mb-6">{detailPost.content}</p>

                            <div className="flex items-center gap-6 pb-4 border-b border-gray-200 mb-6">
                                <button onClick={() => handleLike(detailPost.id)} className="flex items-center gap-2">
                                    <span className="text-xl transition-colors">
                                        {likedPosts.has(detailPost.id) ? '❤️' : '🤍'}
                                    </span>
                                    <span className={`text-sm font-bold ${likedPosts.has(detailPost.id) ? 'text-red-500' : 'text-gray-600'}`}>
                                        {getCount(detailPost._count?.likes ?? detailPost.likes ?? detailPost.likesCount ?? 0)} likes
                                    </span>
                                </button>
                                <button onClick={() => commentInputRef.current?.focus()} className="flex items-center gap-2">
                                    <MessageCircle size={20} className="text-gray-600 hover:text-black transition-colors" />
                                    <span className="text-sm font-bold text-gray-600 hover:text-black transition-colors">
                                        {getCount(detailPost._count?.comments ?? detailPost.comments ?? detailPost.commentsCount ?? 0)} comentarios
                                    </span>
                                </button>
                            </div>

                            {/* Comentarios */}
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <MessageCircle size={18} className="text-gray-600" />
                                    <h4 className="text-sm font-black">
                                        {getCount(detailPost._count?.comments ?? detailPost.comments ?? detailPost.commentsCount ?? 0)} Comentarios
                                    </h4>
                                </div>

                                {commentsLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                                    </div>
                                ) : comments.length > 0 ? (
                                    <div className="space-y-5 mb-6">
                                        {comments.map((comment: any) => {
                                            const isOwner = String(comment.user?.id) === String(currentUserId);
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
        </main>
    );
}
