import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { login } from "../repositories/auth/authRepository";
import type { LoginRequest, LoginResponse } from "../models/auth";

export function useLogin() {
  const { startSession } = useContext(UserContext);
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (request) => {
      const result = await login(request);
      await startSession(result);
      return result;
    },
  });
}

export function getLoginErrorMessage(error: unknown): string {
  if (error instanceof Error && error.name === "SessionStorageError") {
    return "Não foi possível salvar a sessão no dispositivo. Tente novamente.";
  }
  if (error && typeof error === "object" && "response" in error) {
    const response = error.response;
    if (response && typeof response === "object" && "status" in response) {
      if (response.status === 401) return "Email ou senha inválidos.";
      if (response.status === 400) return "Confira os dados informados e tente novamente.";
      return "Não foi possível entrar agora. Tente novamente em instantes.";
    }
  }

  return "Não foi possível entrar. Verifique sua conexão e tente novamente.";
}
