import { jwtDecode } from "jwt-decode";

// Type for Supabase JWT token
export interface SupabaseJWT {
  aal: string;
  amr: Array<{ method: string; timestamp: number }>;
  app_metadata: {
    app_role: string;
    name: string;
    provider: string;
    providers: string[];
  };
  aud: string[];
  email: string;
  exp: number;
  iat: number;
  is_anonymous: boolean;
  iss: string;
  phone: string;
  role: string;
  session_id: string;
  sub: string;
  user_metadata: {
    email_verified: boolean;
  };
}

/**
 * Decode a Supabase JWT access token
 * @param token - The JWT access token string
 * @returns Decoded token object or null if decoding fails
 */
export function decodeSupabaseToken(token: string): SupabaseJWT | null {
  try {
    const decodedToken = jwtDecode<SupabaseJWT>(token);
    return decodedToken;
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return null;
  }
}

/**
 * Get the app role from a Supabase JWT token
 * @param token - The JWT access token string
 * @returns The app role string or null if not found
 */
export function getAppRole(token: string): string | null {
  const decodedToken = decodeSupabaseToken(token);
  return decodedToken?.app_metadata?.app_role || null;
}

/**
 * Get the user name from a Supabase JWT token
 * @param token - The JWT access token string
 * @returns The user name or null if not found
 */
export function getUserName(token: string): string {
  const decodedToken = decodeSupabaseToken(token);
  return decodedToken?.app_metadata?.name || '';
}

/**
 * Get user email from a Supabase JWT token
 * @param token - The JWT access token string
 * @returns The user email or null if not found
 */
export function getUserEmail(token: string): string | null {
  const decodedToken = decodeSupabaseToken(token);
  return decodedToken?.email || null;
}

/**
 * Get user ID from a Supabase JWT token
 * @param token - The JWT access token string
 * @returns The user ID or null if not found
 */
export function getUserId(token: string): string | null {
  const decodedToken = decodeSupabaseToken(token);
  return decodedToken?.sub || null;
}

/**
 * Check if token is expired
 * @param token - The JWT access token string
 * @returns True if token is expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  const decodedToken = decodeSupabaseToken(token);
  if (!decodedToken) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTime;
}

