import { isValidLoginResponse } from "../../services/authSession";
import { api } from "../../services/api";
import type { LoginRequest, LoginResponse } from "../../models/auth";

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/api/Auth/login", request);

  if (!isValidLoginResponse(data) || data.tipo !== request.tipo) {
    throw new Error("Invalid LoginResponse");
  }

  return data;
}
