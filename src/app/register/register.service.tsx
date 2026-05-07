import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type RegisterResponse = {
    id: number;
    username: string;
    email: string;
};

interface RegisterData {
    role?: string;
    fullName?: string;
    location?: string;
}

export const registerUser = async (
    username: string,
    email: string,
    password: string,
    additionalData?: RegisterData
): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(`${API_URL}/register`, {
        username,
        email,
        password,
        ...additionalData,
    });

    return response.data;
};
