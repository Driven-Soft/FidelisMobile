import { api } from "../../services/api";
import type { LoginRequest, LoginResponse } from "../../models/auth";

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/api/Auth/login", request);

  if (
    !data ||
    typeof data.token !== "string" ||
    !data.token.trim() ||
    typeof data.expiraEm !== "string" ||
    !data.expiraEm.trim() ||
    !Number.isInteger(data.tutorId) ||
    data.tutorId <= 0 ||
    typeof data.nome !== "string" ||
    !data.nome.trim()
  ) {
    throw new Error("Invalid LoginResponse");
  }

  return data;
}
