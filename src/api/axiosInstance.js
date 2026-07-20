import axios from "axios";
import { getStore } from "../redux/storeRegistry";
import { logout } from "../redux/auth/authSlice";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const publicPaths = ["/auth", "/coins", "/chat", "/test"];
      const isPublic = publicPaths.some((p) => error.config?.url?.includes(p));
      if (!isPublic) {
        const store = getStore();
        if (store) {
          store.dispatch(logout());
        }
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;