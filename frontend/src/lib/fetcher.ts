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

/**
 * URL을 API 기본 URL과 결합하는 헬퍼 함수
 * @param url - 원본 URL
 * @returns 완전한 API URL
 */
function buildApiUrl(url: string): string {
    if (url.startsWith("/api")) {
        return NEXT_PUBLIC_API_BASE_URL + url.slice(1);
    }
    return url;
}

/**
 * 범용 fetch 함수
 * @param url - 요청할 URL
 * @param options - fetch 옵션 (timeout 포함)
 * @returns Promise<FetchResponse<T>>
 */
export async function fetcher<T = unknown>(
    url: string,
    options: FetchOptions = {}
): Promise<FetchResponse<T>> {
    const { timeout = 10000, ...fetchOptions } = options;

    try {
        // AbortController를 사용한 timeout 처리
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const apiUrl = buildApiUrl(url);

        const response = await fetch(apiUrl, {
            ...fetchOptions,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // HTTP 상태 코드 확인
        if (!response.ok) {
            const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            return {
                data: null,
                error: errorMessage,
                status: response.status,
            };
        }

        // JSON 파싱
        const data = await response.json();

        return {
            data,
            error: null,
            status: response.status,
        };

    } catch (error) {
        // 네트워크 오류, timeout, JSON 파싱 오류 등 처리
        let errorMessage = '알 수 없는 오류가 발생했습니다.';

        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                errorMessage = '요청 시간이 초과되었습니다.';
            } else if (error.name === 'TypeError') {
                errorMessage = '네트워크 연결을 확인해주세요.';
            } else {
                errorMessage = error.message;
            }
        }

        return {
            data: null,
            error: errorMessage,
            status: 0,
        };
    }
}

/**
 * GET 요청 전용 헬퍼 함수
 */
export async function get<T = unknown>(url: string, options?: FetchOptions): Promise<FetchResponse<T>> {
    return fetcher<T>(buildApiUrl(url), {
        method: 'GET',
        ...options,
    });
}

/**
 * POST 요청 전용 헬퍼 함수
 */
export async function post<T = unknown>(
    url: string,
    data?: unknown,
    options?: FetchOptions
): Promise<FetchResponse<T>> {
    return fetcher<T>(buildApiUrl(url), {
        method: 'POST',  headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        ...options,
    });
}

/**
 * PUT 요청 전용 헬퍼 함수
 */
export async function put<T = unknown>(
    url: string,
    data?: unknown,
    options?: FetchOptions
): Promise<FetchResponse<T>> {
    return fetcher<T>(buildApiUrl(url), {
        method: 'PUT',  headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        ...options,
    });
}

/**
 * DELETE 요청 전용 헬퍼 함수
 */
export async function del<T = unknown>(url: string, options?: FetchOptions): Promise<FetchResponse<T>> {
    return fetcher<T>(buildApiUrl(url), {
        method: 'DELETE',
        ...options,
    });
}