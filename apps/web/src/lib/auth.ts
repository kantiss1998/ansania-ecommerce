/**
 * Authentication utilities for JWT token management
 * Handles token storage, retrieval, and validation
 */

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Store authentication tokens in localStorage
 */
export function setTokens(accessToken: string, refreshToken?: string): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
}

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Remove all tokens from localStorage
 */
export function clearTokens(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
    const token = getAccessToken();
    if (!token) return false;

    // Check if token is expired
    try {
        const payload = parseJwt(token);
        const currentTime = Date.now() / 1000;
        return payload.exp > currentTime;
    } catch {
        return false;
    }
}

/**
 * Parse JWT token to get payload
 */
export function parseJwt(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

/**
 * Get user ID from token
 */
export function getUserIdFromToken(): number | null {
    const token = getAccessToken();
    if (!token) return null;

    const payload = parseJwt(token);
    return payload?.userId || payload?.sub || null;
}
