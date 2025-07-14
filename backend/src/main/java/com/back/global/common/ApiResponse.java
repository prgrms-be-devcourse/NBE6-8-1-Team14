package com.back.global.common;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ApiResponse<T> {
    private final boolean success;
    private final String code;
    private final String message;
    private final T content;

    private final static String SUCCESS_CODE = "200";

    // 성공 응답 생성 메서드
    public static <T> ApiResponse<T> success(T content) {
        return ApiResponse.<T>builder()
                .success(true)
                .code(SUCCESS_CODE)
                .message("Success")
                .content(content)
                .build();
    }

    public static <T> ApiResponse<T> success(String message, T content) {
        return ApiResponse.<T>builder()
                .success(true)
                .code(SUCCESS_CODE)
                .message(message)
                .content(content)
                .build();
    }

    // 실패 응답 생성 메서드
    public static <T> ApiResponse<T> fail(String code, String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .code(code)
                .message(message)
                .content(null)
                .build();
    }
}