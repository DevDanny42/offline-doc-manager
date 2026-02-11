export interface User {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  profileImagePath?: string;
  createdAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

export interface ProfileUpdateRequest {
  fullName: string;
  email?: string;
  phone?: string;
  profileImagePath?: string;
}
