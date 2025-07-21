// API 응답 타입 정의
export interface ApiResponse<T> {
    data?: {
        content?: T;
    };
    error?: {
        message?: string;
    };
}

export interface SignUpResponse {
    id: number;
    createdAt: string;
    editedAt: string;
    nickname: string;
}
