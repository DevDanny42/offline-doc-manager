export interface Person {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  createdByUserId: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PersonCreateRequest {
  name: string;
  phone?: string;
  address?: string;
  createdByUserId: number;
}

export interface PersonUpdateRequest {
  name?: string;
  phone?: string;
  address?: string;
}
