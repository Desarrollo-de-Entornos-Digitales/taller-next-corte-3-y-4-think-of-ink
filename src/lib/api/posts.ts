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

/**
 * Realiza una llamada autenticada a la API
 */
async function apiCall(endpoint: string, options: FetchOptions = {}) {
    const { method = 'GET', body, token } = options;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
        throw new Error(
            `API Error: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
}

/**
 * Obtiene todas las publicaciones (sin filtrar por usuario)
 */
export async function getAllPosts(token: string) {
    try {
        return await apiCall('/posts', { token });
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
 * Normaliza la respuesta de la API a un array de posts
 */
export function normalizePostsResponse(data: any): any[] {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.posts && Array.isArray(data.posts)) return data.posts;
    return [];
}
