import api from '../../lib/axios'; // (esto luego lo quitamos)

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await fetch('http://localhost:3001/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  const data = await response.json(); // 🔥 IMPORTANTE

  return data;
};