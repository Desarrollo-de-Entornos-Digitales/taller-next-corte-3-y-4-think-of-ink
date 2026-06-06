'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/app/components/Navbar';
import { Sidebar } from '@/app/components/Sidebar';
import { ProfileHeader } from '../components/ProfileHeader';
import { UserPostCard } from '../components/UserPostCard';
import { DeletePostModal } from '../components/DeletePostModal';
import { UserProfile, UserPost } from '@/lib/types';
import { getMyPosts, deletePost, normalizePostsResponse } from '@/lib/api/posts';

export default function MyPostsPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<UserPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        if (!token) {
            router.push('/login');
            return;
        }

        // Set initial profile from localStorage
        if (username) {
            setProfile({
                id: '',
                name: username,
                username,
                email: '',
                profession: localStorage.getItem('profession') || 'Creador Digital',
                location: localStorage.getItem('location') || 'Colombia',
                totalPosts: 0,
            });
        }
    }, [router]);

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

                // Usar el nuevo servicio con endpoint correcto
                const response = await getMyPosts(token);
                const postsArray = normalizePostsResponse(response);

                // Map API response to UserPost format
                const getCount = (val: any): number => {
                    if (typeof val === 'number') return val;
                    if (Array.isArray(val)) return val.length;
                    return 0;
                };

                const mappedPosts: UserPost[] = postsArray.map((post: any) => ({
                    id: post.id,
                    title: post.title || 'Nueva publicación',
                    content: post.content || '',
                    imageUrl: post.imageUrl,
                    location: post.location,
                    postType: post.postType,
                    user: {
                        id: post.user?.id || '',
                        username: post.user?.username || 'Usuario',
                        avatar: post.user?.avatar,
                    },
                    category: post.category,
                    stats: {
                        likes: getCount(post._count?.likes ?? post.likes ?? post.likesCount ?? 0),
                        comments: getCount(post._count?.comments ?? post.comments ?? post.commentsCount ?? 0),
                    },
                    createdAt: post.createdAt || new Date().toISOString(),
                }));

                setPosts(mappedPosts);

                // Update profile with total posts count
                setProfile((prev) =>
                    prev
                        ? { ...prev, totalPosts: mappedPosts.length }
                        : null
                );
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError('No pudimos cargar tus publicaciones. Intenta nuevamente.');
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, []);

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

            // Usar el nuevo servicio con endpoint correcto
            await deletePost(postToDelete, token);

            // Remove post from state without reloading
            setPosts((prev) => prev.filter((post) => post.id !== postToDelete));

            // Update profile post count
            setProfile((prev) =>
                prev ? { ...prev, totalPosts: prev.totalPosts - 1 } : null
            );

            setDeleteModalOpen(false);
            setPostToDelete(null);
            alert('Publicación eliminada con éxito');
        } catch (err) {
            console.error('Error deleting post:', err);
            setError('No pudimos eliminar la publicación. Intenta nuevamente.');
        } finally {
            setIsDeleting(false);
        }
    };

    // Loading state - show skeleton or minimal layout
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

                {/* Main Content */}
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
                            {/* Error message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm font-bold text-red-600">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Loading state for posts */}
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
                                // Posts list
                                <div className="flex flex-col gap-6">
                                    {posts.map((post) => (
                                        <UserPostCard
                                            key={post.id}
                                            post={post}
                                            onDeleteClick={handleDeleteClick}
                                            isDeleting={isDeleting && postToDelete === post.id}
                                        />
                                    ))}
                                </div>
                            ) : (
                                // Empty state
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
