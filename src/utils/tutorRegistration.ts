import type { TutorRequest } from "../models/tutor";

export interface TutorRegistrationForm {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: string;
  password: string;
  confirmPassword: string;
}

function validateCPF(value: string): boolean {
  const cpf = value.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  for (const size of [9, 10]) {
    let sum = 0;
    for (let index = 0; index < size; index++) sum += Number(cpf[index]) * (size + 1 - index);
    const remainder = 11 - (sum % 11);
    if (Number(cpf[size]) !== (remainder >= 10 ? 0 : remainder)) return false;
  }
  return true;
}

export function validateTutorRegistration(form: TutorRegistrationForm): Partial<Record<keyof TutorRegistrationForm, string>> {
  const errors: Partial<Record<keyof TutorRegistrationForm, string>> = {};
  if (form.name.trim().split(/\s+/).length < 2 || form.name.trim().length > 75) errors.name = "Informe nome e sobrenome, com até 75 caracteres.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) || form.email.trim().length > 75) errors.email = "Informe um email válido de até 75 caracteres.";
  if (!/^\d{10,11}$/.test(form.phone.replace(/\D/g, ""))) errors.phone = "Informe telefone com DDD de 10 ou 11 dígitos.";
  if (!validateCPF(form.cpf)) errors.cpf = "Informe um CPF válido.";
  if (!form.address.trim() || form.address.trim().length > 255) errors.address = "Informe o endereço, com até 255 caracteres.";
  if (!form.password.trim() || form.password.length < 6 || form.password.length > 50) errors.password = "A senha deve ter entre 6 e 50 caracteres.";
  if (!form.confirmPassword || form.confirmPassword !== form.password) errors.confirmPassword = "As senhas não conferem.";
  return errors;
}

export function tutorRegistrationRequest(form: TutorRegistrationForm): TutorRequest {
  return {
    nome: form.name.trim(), email: form.email.trim().toLowerCase(),
    telefone: form.phone.replace(/\D/g, ""), cpf: form.cpf.replace(/\D/g, ""),
    endereco: form.address.trim(), senha: form.password,
  };
}

export function getRegistrationErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = error.response;
    if (response && typeof response === "object" && "status" in response) {
      if (response.status === 400) {
        const data = "data" in response ? response.data : null;
        // Detalhe confirmado no backend; em produção ele pode ser omitido.
        if (data && typeof data === "object" && "detail" in data && data.detail === "Já existe um tutor cadastrado com este email.") return data.detail;
        return "Cadastro não aceito. Confira os campos e se o email já está cadastrado.";
      }
      if (response.status === 401 || response.status === 403) return "O serviço não permitiu o cadastro. Tente novamente mais tarde.";
      if (response.status === 409) return "Cadastro em conflito. Verifique se os dados já estão cadastrados.";
      if (typeof response.status === "number" && response.status >= 500) return "Serviço indisponível. Tente novamente em instantes.";
      return "Não foi possível concluir o cadastro. Tente novamente.";
    }
  }
  return "Não foi possível confirmar o cadastro. Verifique sua conexão. Se a solicitação já foi enviada, tente entrar antes de cadastrar novamente.";
}
