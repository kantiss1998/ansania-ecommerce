import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Store authentication tokens in localStorage and cookies for middleware
 */
export function setTokens(accessToken: string, refreshToken?: string): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(TOKEN_KEY, accessToken);

    // Set cookie for middleware access
    // Expires in 7 days by default, or you can parse JWT to get actual exp
    Cookies.set(TOKEN_KEY, accessToken, {
        expires: 7,
        path: '/',
        sameSite: 'lax'
    });

    if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
}

/**
 * Get access token from localStorage or cookies
 */
export function getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY) || Cookies.get(TOKEN_KEY) || null;
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Remove all tokens from localStorage and cookies
 */
export function clearTokens(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    Cookies.remove(TOKEN_KEY, { path: '/' });
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
