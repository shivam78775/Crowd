import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL.endsWith('/') 
    ? import.meta.env.VITE_API_BASE_URL 
    : `${import.meta.env.VITE_API_BASE_URL}/`,
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("fundify_auth");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

