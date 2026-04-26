import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await axios.post(`${API_URL}/register`, {
    username,
    email,
    password,
  });

  return response.data;
};