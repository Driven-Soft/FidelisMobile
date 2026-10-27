import axios from "axios";
import type { AxiosRequestConfig } from "axios";

export const api = axios.create({
  // Definir no ambiente Expo quando a URL real do backend estiver disponível.
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
});

interface Link {
  href: string;
  rel: string;
  method: string;
}

export interface ResourceResponse<T> {
  data: T;
  links: Link[];
}

interface PagedResponse<T> {
  items: ResourceResponse<T>[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  links: Link[];
}

const PAGE_SIZE = 100;

export async function getResource<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return (await api.get<ResourceResponse<T>>(url, config)).data.data;
}

export async function getAll<T>(url: string, config: AxiosRequestConfig = {}): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1; ; page++) {
    const { data } = await api.get<PagedResponse<T>>(url, {
      ...config,
      params: { ...config.params, page, pageSize: PAGE_SIZE },
    });
    items.push(...data.items.map((item) => item.data));
    if (page >= data.totalPages) return items;
  }
}
