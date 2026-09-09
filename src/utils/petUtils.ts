import type { PetResponse, PetPatchRequest } from "../models/pet";

export class PetFlowError extends Error {
  constructor(public readonly status: number) {
    super("Pet operation unavailable");
    this.name = "PetFlowError";
  }
}

export function normalizePetId(value: unknown): number | null {
  if (typeof value !== "number" && !(typeof value === "string" && /^\d+$/.test(value))) return null;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 && id <= 2147483647 ? id : null;
}

// Restrição temporária do fluxo Mobile. Não substitui autorização no backend.
export function assertPetOwner(pet: PetResponse, tutorId: number, id?: number): PetResponse {
  if (!pet || pet.tutorId !== tutorId || (id !== undefined && pet.id !== id)) throw new PetFlowError(403);
  return pet;
}

export function getPetErrorMessage(error: unknown): string {
  let status: unknown;
  if (error instanceof PetFlowError) status = error.status;
  else if (error && typeof error === "object" && "response" in error) {
    const response = error.response;
    if (response && typeof response === "object" && "status" in response) status = response.status;
  }
  if (status === 400) return "Confira os campos obrigatórios e os valores informados.";
  if (status === 401) return "Sua sessão não está disponível. Entre novamente.";
  if (status === 403) return "Este pet não está disponível para o seu usuário.";
  if (status === 404) return "Pet não encontrado.";
  if (typeof status === "number" && status >= 500) return "O serviço de pets está indisponível. Tente novamente em instantes.";
  return "Não foi possível concluir a operação. Verifique sua conexão e tente novamente.";
}

export interface PetFormValues {
  name: string;
  species: string;
  breed: string;
  sex: string;
  birthDate: string;
  fotoUrl: string;
}

export const emptyPetForm: PetFormValues = { name: "", species: "", breed: "", sex: "", birthDate: "", fotoUrl: "" };

export function petToForm(pet: PetResponse): PetFormValues {
  const [year, month, day] = pet.dataNascimento.slice(0, 10).split("-");
  return { name: pet.nome, species: pet.especie, breed: pet.raca, sex: pet.sexo,
    birthDate: `${day}/${month}/${year}`, fotoUrl: pet.fotoUrl };
}

function parseBirthDate(value: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const [, day, month, year] = match.map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day || date.getTime() > Date.now()) return null;
  return date;
}

export function validatePetForm(form: PetFormValues): Partial<Record<keyof PetFormValues, string>> {
  const errors: Partial<Record<keyof PetFormValues, string>> = {};
  if (!form.name.trim() || form.name.trim().length > 30) errors.name = "Informe um nome de até 30 caracteres.";
  if (!form.species.trim() || form.species.trim().length > 20) errors.species = "Informe uma espécie de até 20 caracteres.";
  if (!form.breed.trim() || form.breed.trim().length > 20) errors.breed = "Informe uma raça de até 20 caracteres.";
  if (!["M", "F"].includes(form.sex)) errors.sex = "Selecione Macho ou Fêmea.";
  if (!parseBirthDate(form.birthDate)) errors.birthDate = "Informe uma data válida, não futura, em DD/MM/AAAA.";
  if (!form.fotoUrl.trim() || form.fotoUrl.trim().length > 255) errors.fotoUrl = "Informe a URL da foto, com até 255 caracteres.";
  return errors;
}

export function petFormFields(form: PetFormValues) {
  const [day, month, year] = form.birthDate.trim().split("/");
  return { nome: form.name.trim(), especie: form.species.trim(), raca: form.breed.trim(), sexo: form.sex,
    dataNascimento: `${year}-${month}-${day}T00:00:00`, fotoUrl: form.fotoUrl.trim() };
}

export function petFormPatch(form: PetFormValues, original: PetResponse): PetPatchRequest {
  const fields = petFormFields(form);
  const patch: PetPatchRequest = {};
  for (const key of ["nome", "especie", "raca", "sexo", "fotoUrl"] as const) {
    if (fields[key] !== original[key]) patch[key] = fields[key];
  }
  if (fields.dataNascimento.slice(0, 10) !== original.dataNascimento.slice(0, 10)) patch.dataNascimento = fields.dataNascimento;
  return patch;
}

export function petAgeLabel(birthDate: string): string {
  const [year, month, day] = birthDate.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return "Idade não informada";
  const today = new Date();
  let years = today.getFullYear() - year;
  if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) years--;
  return `${Math.max(years, 0)} ano${years === 1 ? "" : "s"}`;
}
