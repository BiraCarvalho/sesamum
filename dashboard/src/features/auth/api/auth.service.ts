import { apiClient } from "@/shared/api/client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type {
  AuthResponse,
  GoogleLoginRequest,
  GoogleRegisterRequest,
} from "@/shared/types";

/**
 * Google OAuth login service
 * @param token - Google OAuth id_token from Google Sign-In
 * @returns AuthResponse with JWT tokens and user data
 */
export async function googleLogin(token: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    ENDPOINTS.AUTH.GOOGLE_LOGIN,
    { token } as GoogleLoginRequest,
  );
  return response.data;
}

/**
 * Google OAuth registration service
 * @param token - Google OAuth id_token from Google Sign-In
 * @param invite_token - User invite token (nano UUID)
 * @returns AuthResponse with JWT tokens and user data
 */
export async function googleRegister(
  token: string,
  invite_token: string,
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    ENDPOINTS.AUTH.GOOGLE_REGISTER,
    { token, invite_token } as GoogleRegisterRequest,
  );
  return response.data;
}
