import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  created_at: Date;
  updated_at: Date;
}

export interface UserWithoutPassword extends Omit<User, 'password_hash'> {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface AuthResponse {
  user: UserWithoutPassword;
  token: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: 'admin' | 'user';
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user?: UserWithoutPassword;
} 