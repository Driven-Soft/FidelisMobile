import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

// Dados do tutor: primeira carga normal; novas consultas por ação do usuário.
export const manualTutorQueryOptions = {
  refetchInterval: false,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const;
