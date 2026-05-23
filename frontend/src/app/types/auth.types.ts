// types/auth.types.ts

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export type AuthTab = "login" | "signup" | "forgot";

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    token?: string;
  };
  token?: string;
}

export interface AuthError {
  data?: {
    message: string;
    errors?: Record<string, string>;
  };
  status?: number;
}