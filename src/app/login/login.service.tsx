import axios from 'axios';

const API_URL = 'http://localhost:3000/auth'; // ajusta si tu puerto cambia

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Error en el login' };
  }
};