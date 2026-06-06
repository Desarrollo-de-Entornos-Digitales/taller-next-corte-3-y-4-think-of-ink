/**
 * Post API Service
 * Centraliza todas las llamadas a los endpoints de publicaciones
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;


interface FetchOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    token?: string;
}

async function apiCall(endpoint: string, options: FetchOptions = {}) {
    const { method = 'GET', body, token } = options;

    const headers: HeadersInit = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (body) {
        headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    let response: Response;

    try {
        response = await fetch(`${API_URL}${endpoint}`, config);
    } catch (networkError: any) {
        throw new Error(
            `Error de conexión: No se pudo conectar con el servidor (${API_URL}${endpoint}). Verifica que el backend esté corriendo.`
        );
    }

    if (!response.ok) {
        let errorMessage = `Error ${response.status}`;
        try {
            const errorBody = await response.json();
            if (errorBody.message) {
                errorMessage = errorBody.message;
            } else if (errorBody.error) {
                errorMessage = errorBody.error;
            }
        } catch {
            errorMessage = response.statusText || `Error ${response.status}`;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

/**
 * Obtiene todas las publicaciones (sin filtrar por usuario)
 */
export async function getAllPosts(token?: string) {
    try {
        return await apiCall('/posts', token ? { token } : {});
    } catch (error) {
        console.error('Error fetching all posts:', error);
        throw error;
    }
}

/**
 * Obtiene las publicaciones del usuario autenticado
 */
export async function getMyPosts(token: string) {
    try {
        return await apiCall('/posts/my-posts', { token });
    } catch (error) {
        console.error('Error fetching my posts:', error);
        throw error;
    }
}

/**
 * Crea una nueva publicación
 */
export async function createPost(
    postData: {
        content: string;
        category?: { name: string };
        location?: string;
        imageUrl?: string | null;
        title?: string;
        postType?: string;
    },
    token: string
) {
    try {
        return await apiCall('/posts', {
            method: 'POST',
            body: postData,
            token,
        });
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}

/**
 * Obtiene una publicación por ID
 */
export async function getPostById(postId: string, token: string) {
    try {
        return await apiCall(`/posts/${postId}`, { token });
    } catch (error) {
        console.error(`Error fetching post ${postId}:`, error);
        throw error;
    }
}

/**
 * Actualiza una publicación
 */
export async function updatePost(
    postId: string,
    postData: Partial<{
        content: string;
        category: { name: string };
        location: string;
        imageUrl: string;
        title: string;
    }>,
    token: string
) {
    try {
        return await apiCall(`/posts/${postId}`, {
            method: 'PATCH',
            body: postData,
            token,
        });
    } catch (error) {
        console.error(`Error updating post ${postId}:`, error);
        throw error;
    }
}

/**
 * Elimina una publicación
 */
export async function deletePost(postId: string, token: string) {
    try {
        return await apiCall(`/posts/${postId}`, {
            method: 'DELETE',
            token,
        });
    } catch (error) {
        console.error(`Error deleting post ${postId}:`, error);
        throw error;
    }
}

/**
 * Da o quita like a una publicación (toggle)
 */
export async function likePost(postId: string, token: string) {
    try {
        return await apiCall(`/posts/${postId}/like`, {
            method: 'POST',
            token,
        });
    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
}

/**
 * Obtiene los comentarios de una publicación
 */
export async function getComments(postId: string, token: string) {
    try {
        return await apiCall(`/posts/${postId}/comments`, { token });
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
}

/**
 * Crea un comentario en una publicación
 */
export async function createComment(
    postId: string,
    content: string,
    token: string
) {
    try {
        return await apiCall(`/posts/${postId}/comments`, {
            method: 'POST',
            body: { content },
            token,
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
}

/**
 * Elimina un comentario
 */
export async function deleteComment(postId: string, commentId: string, token: string) {
    try {
        return await apiCall(`/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            token,
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
}

/**
 * Filtra publicaciones por rango de precio
 */
export async function filterByPrice(minPrice: number, maxPrice: number, token: string) {
    try {
        const params = new URLSearchParams({ minPrice: String(minPrice), maxPrice: String(maxPrice) });
        return await apiCall(`/posts/filter-by-price?${params}`, { token });
    } catch (error) {
        console.error('Error filtering by price:', error);
        throw error;
    }
}

/**
 * Normaliza la respuesta de la API a un array de posts
 */
export function normalizePostsResponse(data: any): any[] {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.posts && Array.isArray(data.posts)) return data.posts;
    return [];
}
