package com.back.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // 커스텀 처리할 오류
    DEV_NOT_FOUND(HttpStatus.NOT_FOUND, "USER-404", "사용자를 찾을 수 없습니다(커스텀 예외 처리)"),
    TOKEN_NOT_FOUND(HttpStatus.NOT_FOUND, "TOKEN-404", "토큰을 찾을 수 없습니다"),
    INVALID_REFRESH_TOKEN(HttpStatus.NOT_FOUND, "TOKEN-403", "토큰이 유효하지 않습니다"),;

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}