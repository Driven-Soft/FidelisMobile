import axios from "axios";

export const api = axios.create({
  // Definir no ambiente Expo quando a URL real do backend estiver disponível.
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
});
