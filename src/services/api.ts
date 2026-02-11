import type { LoginRequest, LoginResponse, User, ProfileUpdateRequest } from "@/types/User";
import type { Document, DocumentCreateRequest, DocumentUpdateRequest } from "@/types/Document";

const BASE_URL = "http://localhost:8080/api";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const error = await res.text().catch(() => "Request failed");
    throw new Error(error);
  }
  return res.json();
}

// Auth
export const authApi = {
  login: (data: LoginRequest) =>
    request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Users
export const userApi = {
  getProfile: (id: number) => request<User>(`/users/${id}`),
  updateProfile: (id: number, data: ProfileUpdateRequest) =>
    request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Documents
export const documentApi = {
  getAll: (ownerId: number) =>
    request<Document[]>(`/documents?ownerId=${ownerId}`),
  getById: (id: number) => request<Document>(`/documents/${id}`),
  search: (query: string, ownerId: number) =>
    request<Document[]>(`/documents/search?q=${encodeURIComponent(query)}&ownerId=${ownerId}`),
  create: (data: DocumentCreateRequest) =>
    request<Document>("/documents", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: DocumentUpdateRequest) =>
    request<Document>(`/documents/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    request<void>(`/documents/${id}`, { method: "DELETE" }),
};
