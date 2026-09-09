import { useMutation } from "@tanstack/react-query";
import { login } from "../repositories/auth/authRepository";
import type { LoginRequest, LoginResponse } from "../models/auth";

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
  });
}

export function getLoginErrorMessage(error: unknown): string {
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
