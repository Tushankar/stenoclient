import axios from "axios";
import { useAuthStore } from "../store/authStore";

// Replace with localhost for local testing. Change back to stenoserver.onrender.com when deploying.
const api = axios.create({ baseURL: "http://localhost:5000/api" });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
