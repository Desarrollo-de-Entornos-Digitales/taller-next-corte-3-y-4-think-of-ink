import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

type RegisterResponse = {
    id: number;
    username: string;
    email: string;
};

export const registerUser = async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(`${API_URL}/register`, {
        username,
        email,
        password,
    });

    return response.data;
};
