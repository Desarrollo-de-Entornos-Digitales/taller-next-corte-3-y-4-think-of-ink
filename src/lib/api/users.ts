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
    } catch {
        throw new Error(
            `Error de conexión: No se pudo conectar con el servidor (${API_URL}${endpoint}).`
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

export async function getUserProfile(token: string) {
    try {
        return await apiCall('/users/profile', { token });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

export async function updateUserProfile(
    profileData: Record<string, any>,
    token: string
) {
    try {
        return await apiCall('/users/profile', {
            method: 'PATCH',
            body: profileData,
            token,
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

export async function getPublicProfile(userId: string, token?: string) {
    try {
        return await apiCall(`/users/${userId}`, token ? { token } : {});
    } catch (error) {
        console.error('Error fetching public profile:', error);
        throw error;
    }
}

export async function getPostsByUser(userId: string, token?: string) {
    try {
        return await apiCall(`/posts/user/${userId}`, token ? { token } : {});
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
}
