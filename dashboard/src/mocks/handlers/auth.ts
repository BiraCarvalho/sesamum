import { http, HttpResponse, delay } from "msw";
import { mockUsers } from "../data/users";
import { mockUserInvites } from "../data/userInvites";
import type {
  GoogleLoginRequest,
  GoogleRegisterRequest,
  AuthResponse,
  JWTTokens,
} from "../../shared/types";

// ==========================================
// 🔐 Auth MSW Handlers (Google OAuth + Mock JWT)
// ==========================================

/**
 * Auth MSW Handlers
 *
 * Simulates the authentication system per API instructions:
 * - POST /api/v1/auth/google/login/     - Login with Google OAuth
 * - POST /api/v1/auth/google/register/  - Register with invite token
 * - POST /api/v1/auth/refresh/          - Refresh access token
 * - POST /api/v1/auth/logout/           - Logout (optional)
 *
 * Uses simple mock JWT tokens for MSW testing (no external dependencies).
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Token expiry times (in milliseconds)
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// In-memory token store for validation
interface TokenMetadata {
  user_id: number;
  expires_at: number;
  token_type: "access" | "refresh";
}

const mockTokenStore = new Map<string, TokenMetadata>();

/**
 * Generate mock JWT tokens for a user
 * Format: mock_<type>_<base64(payload)>
 */
function generateMockTokens(user: {
  id: number;
  email: string;
  role: string;
  company_id?: number;
}): JWTTokens {
  const now = Date.now();
  const accessExpiry = now + ACCESS_TOKEN_EXPIRY;
  const refreshExpiry = now + REFRESH_TOKEN_EXPIRY;

  const accessPayload = JSON.stringify({
    user_id: user.id,
    email: user.email,
    role: user.role,
    company_id: user.company_id,
    token_type: "access",
    exp: accessExpiry,
  });

  const refreshPayload = JSON.stringify({
    user_id: user.id,
    email: user.email,
    token_type: "refresh",
    exp: refreshExpiry,
  });

  const access = `mock_access_${btoa(accessPayload)}`;
  const refresh = `mock_refresh_${btoa(refreshPayload)}`;

  // Store tokens for validation
  mockTokenStore.set(access, {
    user_id: user.id,
    expires_at: accessExpiry,
    token_type: "access",
  });

  mockTokenStore.set(refresh, {
    user_id: user.id,
    expires_at: refreshExpiry,
    token_type: "refresh",
  });

  return { access, refresh };
}

/**
 * Verify and decode a mock token
 */
function verifyToken(
  token: string,
): { user_id: number; token_type: string; exp: number } | null {
  try {
    // Check if token exists in store
    const metadata = mockTokenStore.get(token);
    if (!metadata) {
      return null;
    }

    // Check expiration
    if (Date.now() > metadata.expires_at) {
      mockTokenStore.delete(token);
      return null;
    }

    // Extract payload from token
    const [, , encodedPayload] = token.split("_");
    const payload = JSON.parse(atob(encodedPayload));

    return payload;
  } catch {
    return null;
  }
}

/**
 * Mock Google OAuth token validation
 * In real implementation, this would validate with Google's API
 * For MSW, we extract email from a fake token structure
 */
function validateGoogleToken(
  token: string,
): { email: string; name: string } | null {
  try {
    // Mock token format: "google_token_<email>"
    // e.g., "google_token_admin@sesamum.com"
    if (token.startsWith("google_token_")) {
      const email = token.replace("google_token_", "");
      const name = email.split("@")[0]; // Simple name extraction
      return { email, name };
    }

    return null;
  } catch {
    return null;
  }
}

export const authHandlers = [
  // ========================================
  // POST /api/v1/auth/google/login/
  // ========================================
  http.post(
    `${API_BASE_URL}/api/v1/auth/google/login/`,
    async ({ request }) => {
      await delay(1200); // Realistic network delay

      try {
        const body = (await request.json()) as GoogleLoginRequest;
        const { token } = body;

        // Validate token structure
        if (!token) {
          return HttpResponse.json(
            { error: "Token is required" },
            { status: 400 },
          );
        }

        // Validate Google OAuth token (mock)
        const googleUser = validateGoogleToken(token);
        if (!googleUser) {
          return HttpResponse.json(
            { error: "Invalid Google OAuth token" },
            { status: 401 },
          );
        }

        // Check if user exists in our system
        const user = mockUsers.find((u) => u.email === googleUser.email);
        if (!user) {
          return HttpResponse.json(
            {
              error: "User not found",
              detail:
                "Email not registered in Sesamum. Please use an invite link to register.",
            },
            { status: 403 },
          );
        }

        // Generate mock JWT tokens
        const tokens = generateMockTokens({
          id: user.id,
          email: user.email,
          role: user.role,
          company_id: user.company_id,
        });

        // Return auth response
        const response: AuthResponse = {
          tokens,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            company_id: user.company_id,
          },
        };

        return HttpResponse.json(response, { status: 200 });
      } catch (error) {
        console.error("Login error:", error);
        return HttpResponse.json(
          { error: "Internal server error" },
          { status: 500 },
        );
      }
    },
  ),

  // ========================================
  // POST /api/v1/auth/google/register/
  // ========================================
  http.post(
    `${API_BASE_URL}/api/v1/auth/google/register/`,
    async ({ request }) => {
      await delay(1500); // Registration takes slightly longer

      try {
        const body = (await request.json()) as GoogleRegisterRequest;
        const { token, invite_token } = body;

        // Validate required fields
        if (!token || !invite_token) {
          return HttpResponse.json(
            { error: "Token and invite_token are required" },
            { status: 400 },
          );
        }

        // Validate Google OAuth token (mock)
        const googleUser = validateGoogleToken(token);
        if (!googleUser) {
          return HttpResponse.json(
            { error: "Invalid Google OAuth token" },
            { status: 401 },
          );
        }

        // Check if user already exists
        const existingUser = mockUsers.find(
          (u) => u.email === googleUser.email,
        );
        if (existingUser) {
          return HttpResponse.json(
            { error: "User already registered. Please use login instead." },
            { status: 409 },
          );
        }

        // Find the invite
        const invite = mockUserInvites.find((inv) => inv.id === invite_token);
        if (!invite) {
          return HttpResponse.json(
            { error: "Invalid invite token" },
            { status: 404 },
          );
        }

        // Check if invite is already used
        if (invite.used_by !== null) {
          return HttpResponse.json(
            { error: "Invite token already used" },
            { status: 400 },
          );
        }

        // Check expiration
        const now = new Date();
        const expiresAt = new Date(invite.expires_at);
        if (now > expiresAt) {
          return HttpResponse.json(
            { error: "Invite token expired" },
            { status: 400 },
          );
        }

        // Validate email restriction (if set)
        if (invite.email && invite.email !== googleUser.email) {
          return HttpResponse.json(
            {
              error: "Email mismatch",
              detail: `This invite is restricted to ${invite.email}`,
            },
            { status: 403 },
          );
        }

        // Create new user
        const newUserId = Math.max(...mockUsers.map((u) => u.id), 0) + 1;
        const newUser = {
          id: newUserId,
          name: googleUser.name,
          email: googleUser.email,
          role: invite.role,
          company_id: invite.company_id,
          created_at: new Date().toISOString(),
          picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(googleUser.name)}&background=random`,
        };

        mockUsers.push(newUser);

        // Mark invite as used by setting used_by to new user ID
        invite.used_by = newUserId;

        // Generate mock JWT tokens
        const tokens = generateMockTokens({
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          company_id: newUser.company_id,
        });

        // Return auth response
        const response: AuthResponse = {
          tokens,
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            company_id: newUser.company_id,
          },
        };

        return HttpResponse.json(response, { status: 201 });
      } catch (error) {
        console.error("Registration error:", error);
        return HttpResponse.json(
          { error: "Internal server error" },
          { status: 500 },
        );
      }
    },
  ),

  // ========================================
  // POST /api/v1/auth/refresh/
  // ========================================
  http.post(`${API_BASE_URL}/api/v1/auth/refresh/`, async ({ request }) => {
    await delay(400); // Faster than login

    try {
      const body = (await request.json()) as { refresh: string };
      const { refresh } = body;

      if (!refresh) {
        return HttpResponse.json(
          { error: "Refresh token is required" },
          { status: 400 },
        );
      }

      // Verify refresh token
      const decoded = verifyToken(refresh);
      if (!decoded || decoded.token_type !== "refresh") {
        return HttpResponse.json(
          { error: "Invalid or expired refresh token" },
          { status: 401 },
        );
      }

      // Find user
      const user = mockUsers.find((u) => u.id === decoded.user_id);
      if (!user) {
        return HttpResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Generate new access token only
      const now = Date.now();
      const accessExpiry = now + ACCESS_TOKEN_EXPIRY;
      const accessPayload = JSON.stringify({
        user_id: user.id,
        email: user.email,
        role: user.role,
        company_id: user.company_id,
        token_type: "access",
        exp: accessExpiry,
      });
      const access = `mock_access_${btoa(accessPayload)}`;
      mockTokenStore.set(access, {
        user_id: user.id,
        expires_at: accessExpiry,
        token_type: "access",
      });

      return HttpResponse.json({ access }, { status: 200 });
    } catch (error) {
      console.error("Refresh error:", error);
      return HttpResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  }),

  // ========================================
  // POST /api/v1/auth/logout/
  // ========================================
  http.post(`${API_BASE_URL}/api/v1/auth/logout/`, async ({ request }) => {
    await delay(300);

    try {
      const body = (await request.json()) as { refresh?: string };

      // Remove tokens from mock store
      if (body.refresh) {
        mockTokenStore.delete(body.refresh);
      }

      return HttpResponse.json(
        { message: "Successfully logged out" },
        { status: 200 },
      );
    } catch {
      return HttpResponse.json(
        { message: "Successfully logged out" },
        { status: 200 },
      );
    }
  }),
];

// Export utilities for testing
export { generateMockTokens, verifyToken, validateGoogleToken };
