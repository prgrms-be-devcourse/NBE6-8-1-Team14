/**
 * 범용 fetch 함수
 * 모든 API 요청에 대해 일관된 예외처리와 타입 안전성을 제공합니다.
 */

import { NEXT_PUBLIC_API_BASE_URL } from "@/lib/backend/client";

interface FetchOptions extends RequestInit {
    timeout?: number;
}

interface FetchResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
}

// 전역 로그인 만료 핸들러
let globalExpireHandler: (() => void) | null = null;
export function setGlobalExpireHandler(handler: () => void) {
    globalExpireHandler = handler;
}

// URL 빌더
function buildApiUrl(url: string): string {
    return url.startsWith("/api") ? NEXT_PUBLIC_API_BASE_URL + url.slice(1) : url;
}

// 에러 메시지 생성
function createErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        if (error.name === 'AbortError') return '요청 시간이 초과되었습니다.';
        if (error.name === 'TypeError') return '네트워크 연결을 확인해주세요.';
        return error.message;
    }
    return '알 수 없는 오류가 발생했습니다.';
}

// 토큰 만료 체크
function isTokenExpired(status: number, data?: { code?: string }): boolean {
    if ([401, 403, 404].includes(status)) return true;
    if (data?.code) {
        return data.code.includes("401") || data.code.includes("403") || data.code.includes("404");
    }
    return false;
}

// refreshToken으로 토큰 재발행 요청
async function refreshAuthToken(): Promise<{ expired: boolean }> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        globalExpireHandler?.();
        return { expired: true };
    }
    
    const response = await fetch(buildApiUrl("/api/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });
    
    if (isTokenExpired(response.status)) {
        globalExpireHandler?.();
        return { expired: true };
    }
    
    try {
        const data = await response.json();
        if (isTokenExpired(response.status, data)) {
            globalExpireHandler?.();
            return { expired: true };
        }
    } catch {}
    
    return { expired: false };
}

// 응답 처리
function handleResponse<T>(response: Response, data: unknown): { success: boolean; data: T | null; error: string | null; status: number } {
    if (!response.ok) {
        return {
            success: false,
            data: null,
            error: `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
        };
    }
    
    return {
        success: data !== null,
        data: data as T || null,
        error: null,
        status: response.status,
    };
}

// 토큰 만료 처리
function handleTokenExpiration<T>(response: Response, didRefresh: boolean): { success: boolean; data: T | null; error: string | null; status: number } | null {
    if (!isTokenExpired(response.status)) return null;
    
    if (didRefresh) {
        globalExpireHandler?.();
        return {
            success: false,
            data: null,
            error: '로그인이 만료되었습니다. 다시 로그인해주세요.',
            status: response.status,
        };
    }
    
    return null;
}

/**
 * 범용 fetch 함수
 */
export async function fetcher<T = unknown>(
    url: string,
    options: FetchOptions = {},
    didRefresh = false
): Promise<{ success: boolean; data: T | null; error: string | null; status: number }> {
    const { timeout = 10000, ...fetchOptions } = options;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(buildApiUrl(url), {
            ...fetchOptions,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // 토큰 만료 처리
        const tokenExpirationResult = handleTokenExpiration<T>(response, didRefresh);
        if (tokenExpirationResult) return tokenExpirationResult;

        // 최초 요청에서만 refresh 시도
        if (!didRefresh && isTokenExpired(response.status)) {
            const refreshResult = await refreshAuthToken();
            if (refreshResult.expired) {
                return {
                    success: false,
                    data: null,
                    error: '로그인이 만료되었습니다. 다시 로그인해주세요.',
                    status: response.status,
                };
            }
            return fetcher<T>(url, options, true);
        }

        // refresh 후 재시도에서도 401/403/404 에러가 발생하면 로그인 만료 처리
        if (didRefresh && isTokenExpired(response.status)) {
            globalExpireHandler?.();
            return {
                success: false,
                data: null,
                error: '로그인이 만료되었습니다.\n 다시 로그인해주세요.',
                status: response.status,
            };
        }

        // JSON 파싱
        let data: unknown = null;
        try {
            data = await response.clone().json();
        } catch {}

        return handleResponse<T>(response, data);

    } catch (error) {
        return {
            success: false,
            data: null,
            error: createErrorMessage(error),
            status: 0,
        };
    }
}

// HTTP 메서드별 헬퍼 함수들
export async function get<T = unknown>(url: string, options?: FetchOptions): Promise<FetchResponse<T>> {
    return fetcher<T>(buildApiUrl(url), { method: 'GET', ...options });
}

export async function post<T = unknown>(url: string, data?: unknown, options?: FetchOptions): Promise<FetchResponse<T>> {
    return fetcher<T>(buildApiUrl(url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        body: data ? JSON.stringify(data) : undefined,
        ...options,
    });
}

export async function put<T = unknown>(url: string, data?: unknown, options?: FetchOptions): Promise<FetchResponse<T>> {
    return fetcher<T>(buildApiUrl(url), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        body: data ? JSON.stringify(data) : undefined,
        ...options,
    });
}

export async function del<T = unknown>(url: string, options?: FetchOptions): Promise<FetchResponse<T>> {
    return fetcher<T>(buildApiUrl(url), { method: 'DELETE', ...options });
}