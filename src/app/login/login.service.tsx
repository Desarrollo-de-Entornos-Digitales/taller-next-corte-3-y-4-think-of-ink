import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

type LoginResponse = {
    access_token: string;
};

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
        email,
        password,
    });

    return response.data;
};
