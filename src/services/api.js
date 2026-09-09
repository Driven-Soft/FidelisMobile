import axios from "axios";
import { getSessionToken, invalidateSessionToken } from "./authSession";

export const api = axios.create({
  // Definir no ambiente Expo quando a URL real do backend estiver disponível.
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getSessionToken();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  else config.headers.delete("Authorization");
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authorization = error.config?.headers?.get?.("Authorization");
      if (typeof authorization === "string" && authorization.startsWith("Bearer ")) {
        invalidateSessionToken(authorization.slice(7));
      }
    }
    return Promise.reject(error);
  },
);
